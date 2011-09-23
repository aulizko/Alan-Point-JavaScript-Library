AP.add('io.ajax', function (A) {

    var L = A.Lang, I = A.namespace('IO');

    // good old ajax
    /**
     * Old plain ajax helper
     * Realization is pretty standart - I can't say where from I taken it. If you know where from - tell me, I will include link to the author
     * @module io
     * @submodule ajax
     */
    I.Ajax = {
        createXHR : function () {
            return AP.tryThese(function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
                function () { return new XMLHttpRequest(); },
                function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
                function () { return new ActiveXObject('Msxml2.XMLHTTP.4.0'); });
        },
        /**
         * Global ajax options (like loader, default method etc.)
         * @property options
         */
        options : {
            /**
             * Default url
             */
            url : location.href,
            /**
             * Default method type
             */
            type : "GET",
            /**
             * Default content type
             */
            contentType : "application/x-www-form-urlencoded",
            /**
             * Senf async or sync objects?
             */
            async : true,
            /**
             * Timeout before connection readed is failed (in secs), default to 30
             */
            timeout : 0,

            /**
             * jsonp get parameter name, default to"callback"
             */
            jsonp : 'callback',

            username : null,

            password : null,

            accepts : {
                xml : "application/xml, text/xml",
                html : "text/html",
                script : "text/javascript, application/javascript",
                json : "application/json, text/javascript",
                text : "text/plain",
                _default : "*/*"
            }
        },

        globalOptions : this.options,

        /**
         * Whole-project related ajax settings
         * @method setup
         * @param options {Object} hash contains properties
         */
        setup : function (options) {
            this.setOptions(options);
            this.globalOptions = this.options;
        },
        /**
         * Start request
         * @param options {Object} hash contains request-related properties like method etc.
         * @method send
         */
        send : function (options) {
            this.setOptions(options);


            var status, data,
                type = this.options.type.toUpperCase();

            // convert data if not already a string
            if ( this.options.data && !L.isString(this.options.data)) {
                this.options.data = this.buildSearchString(this.options.data);
            }

            if ( this.options.cache === false && type == "GET" ) {
                var ts = A.random();
                // try replacing _= if it is there
                var ret = this.options.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
                // if nothing was replaced, add timestamp to the end
                this.options.url = ret + ((ret == this.options.url) ? (this.options.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
            }

            // If data is available, append data to url for get requests
            if ( this.options.data && type == "GET" ) {
                this.options.url += (this.options.url.match(/\?/) ? "&" : "?") + this.options.data;
            }

            this.publish('start');

            var requestDone = false;

            // Create the request object
            var xhr = this.createXHR();

            // Open the socket
            // Passing null username, generates a login popup on Opera (#2865)
            if( this.options.username )
                xhr.open(type, this.options.url, this.options.async, this.options.username, this.options.password);
            else
                xhr.open(type, this.options.url, this.options.async);

            // Need an extra try/catch for cross domain requests in Firefox 3
            try {
                // Set the correct header, if data is being sent
                if ( this.options.data ) {
                    xhr.setRequestHeader("Content-Type", this.options.contentType);
                }

                // Set header so the called script knows that it's an XMLHttpRequest
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                // Set the Accepts header for the server, depending on the dataType
                xhr.setRequestHeader("Accept", this.options.dataType && this.options.accepts[ this.options.dataType ] ?
                    this.options.accepts[ this.options.dataType ] + ", */*" :
                    this.options.accepts._default );
            } catch(e){}

            // Allow custom headers/mimetypes and early abort
            if ( this.options.beforeSend && this.options.beforeSend(xhr, this.options) === false ) {
                this.publish('stop');
                // close opended socket
                xhr.abort();
                return false;
            }

            this.publish('send');

            // Wait for a response to come back
            var onreadystatechange = function(isTimeout){
                // The request was aborted, clear the interval
                if (xhr.readyState == 0) {
                    if (ival) {
                        // clear poll interval
                        ival.cancel();
                        ival = null;
                        // Handle the global AJAX counter
                        AP.IO.Ajax.publish('stop');
                    }
                // The transfer is complete and the data is available, or the request timed out
                } else if ( !requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout") ) {
                    requestDone = true;

                    // clear poll interval
                    if (ival) {
                        ival.cancel();
                        ival = null;
                    }

                    status = isTimeout == "timeout" ? "timeout" :
                        !AP.IO.Ajax.httpSuccess( xhr ) ? "error" : "success";

                    if ( status == "success" ) {
                        // Watch for, and catch, XML document parse errors
                        try {
                            // process the data (runs the xml through httpData regardless of callback)

                            data = this.httpData( xhr, AP.IO.Ajax.options.dataType, AP.IO.Ajax.options );
                        } catch(e) {
                            status = "parsererror";
                        }
                    }

                    // Make sure that the request was successful or notmodified
                    if ( status == "success" ) {
                        // Cache Last-Modified header, if ifModified mode.
                        var modRes;
                        try {
                            modRes = xhr.getResponseHeader("Last-Modified");
                        } catch(e) {} // swallow exception thrown by FF if header is not available                            
                    } else {
                        AP.IO.Ajax.handleError(AP.IO.Ajax.options, xhr, status);
                    }


                    // Fire the complete handlers
                    complete();

                    if ( isTimeout ) {
                        xhr.abort();
                    }    

                    // Stop memory leaks
                    if ( AP.IO.Ajax.options.async ) {
                        xhr = null;
                    }

                }
            };

            if ( this.options.async ) {
                // don't attach the handler to the request, just poll it instead
                var ival = A.Timer.later(13, this, onreadystatechange, null, true);

                // Timeout checker
                if ( this.options.timeout > 0 )
                    A.Timer.later(AP.IO.Ajax.options.timeout, this, function () {
                        // Check to see if the request is still happening
                        if ( xhr && !requestDone ) {
                            onreadystatechange( "timeout" );
                        }
                    }, null);
            }

            // Send the data
            try {
                xhr.send( type === "POST" ? AP.IO.Ajax.options.data : null );
            } catch(e) {
                AP.IO.Ajax.handleError(AP.IO.Ajax.options, xhr, null, e);
            }

            // firefox 1.5 doesn't fire statechange for sync requests
            if ( !AP.IO.Ajax.options.async )
                onreadystatechange();

            function complete(){
                // Process result
                if ( AP.IO.Ajax.options.complete )
                    AP.IO.Ajax.options.complete(xhr, status);

                // The request was completed
                AP.IO.Ajax.publish('complete', [xhr, this.options]);

                // Handle the global AJAX counter
                AP.IO.Ajax.publish('stop');
            }

            // return XMLHttpRequest to allow aborting the request etc.
            return xhr;

        },
        /**
         * Abort current request
         * @method stop 
         */
        stop : function () {},


        httpSuccess: function( xhr ) {
            try {
                // IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
                return !xhr.status && location.protocol == "file:" ||
                    ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status == 1223;
            } catch(e){}
            return false;
        },

        httpData: function( xhr, type ) {
            var ct = xhr.getResponseHeader("content-type"),
                xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if ( xml && data.documentElement.tagName == "parsererror" ) {
                throw "parsererror";
            }

            // The filter can actually parse the response
            if (L.isString(data)) {

                // Get the JavaScript object, if JSON is used.
                if ( type == "json" ) {
                    data = A.JSON.decode(data);
                }
            }

            return data;
        },

        handleError: function( s, xhr, status, e ) {
            // If a local callback was specified, fire it
            if ( s.error ) s.error( xhr, status, e );

            this.publish('error');
        }
    };


    I.Ajax = A.OOP.merge(I.Ajax, A.Interface.Options, A.Interface.SearchStringBuilder, AP.util.Event.Observable);



}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'io', minVersion : '0.0.1' },
    { name : 'interface.options', minVersion : '0.0.1' },
    { name : 'interface.searchStringBuilder', minVersion : '0.0.1' },
    { name : 'timer', minVersion : '0.0.1' },
    { name : 'json-decode', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' }
]);