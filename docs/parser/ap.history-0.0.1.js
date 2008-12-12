
AP.add('history', function (A) {
    /**
     * History managment, for ajax-based pages
     * @module history
     * @class History
     * @constructor
     */
    A.History = function () {
        var
        /**
         * @property currentHash
         * @private
         */
        currentHash,
        /**
         * @property _callback
         * @private
         */
        _callback,

        historyBackStack,

        historyForwardStack,

        isFirst,

        dontCheck,

        check = function () {
            var i, hash;
            if($.browser.msie) {
                // On IE, check for location.hash of iframe
                return function () {
                    var ihistory = $("#APHistory")[0];
                    var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
                    hash = iframe.location.hash;
                    if(hash != currentHash) {

                        location.hash = hash;
                        currentHash = hash;
                        _callback(hash.replace(/^#/, ''));
                    }
                };
            } else if ($.browser.safari) {
                return function () {
                    if (dontCheck) {
                        var historyDelta = history.length - historyBackStack.length;

                        if (historyDelta) { // back or forward button has been pushed
                            isFirst = false;
                            if (historyDelta < 0) { // back button has been pushed
                                // move items to forward stack
                                for (i = 0; i < Math.abs(historyDelta); i++) historyForwardStack.unshift(historyBackStack.pop());
                            } else { // forward button has been pushed
                                // move items to back stack
                                for (i = 0; i < historyDelta; i++) historyBackStack.push(historyForwardStack.shift());
                            }
                            var cachedHash = historyBackStack[historyBackStack.length - 1];
                            if (cachedHash != undefined) {
                                currentHash = location.hash;
                                _callback(cachedHash);
                            }
                        } else if (historyBackStack[historyBackStack.length - 1] == undefined && !isFirst) {
                            // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                            // document.URL doesn't change in Safari
                            if (document.URL.indexOf('#') >= 0) {
                                _callback(document.URL.split('#')[1]);
                            } else {
                                _callback('');
                            }
                            isFirst = true;
                        }
                    }
                };
            } else {
                // otherwise, check for location.hash
                return function () {
                    hash = location.hash;
                    if(hash != currentHash) {
                        currentHash = hash;
                        _callback(hash.replace(/^#/, ''));
                    }
                };
            }
        }();

        return {
            initialize : function (callback) {
                if ($.browser.msie) {
                    return function (callback) {
                        _callback = callback;
                        currentHash = location.hash;
                        // To stop the callback firing twice during initilization if no hash present
                        if (currentHash == '') {
                            currentHash = '#';
                        }

                        // add hidden iframe for IE
                        $("body").prepend('<iframe id="APHistory" style="display: none;"></iframe>');
                        var iframe = $("#APHistory")[0].contentWindow.document;
                        iframe.open();
                        iframe.close();
                        iframe.location.hash = currentHash;
                        
                        _callback(currentHash.replace(/^#/, ''));
                        setInterval(check, 100);
                    };
                } else if ($.browser.safari) {
                    return function (callback) {
                        _callback = callback;
                        currentHash = location.hash;
                        // etablish back/forward stacks

                        historyBackStack = [];
                        historyBackStack.length = history.length;
                        historyForwardStack = [];
                        isFirst = true;
                        dontCheck = false;
                        
                        _callback(currentHash.replace(/^#/, ''));
                        setInterval(check, 100);
                    };
                } else {
                    return function (callback) {
                        _callback = callback;
                        currentHash = location.hash;
                        _callback(currentHash.replace(/^#/, ''));
                        setInterval(check, 100);
                    };
                }
            }(),

            add : function (hash) {
                // This makes the looping function do something
                historyBackStack.push(hash);

                historyForwardStack.length = 0; // clear forwardStack (true click occured)
                isFirst = true;
            },

            /**
             *
             * @param hash {String} desiring hash without first #
             */
            load : function(hash) {
                if ($.browser.safari) {
                    return function (hash) {
                        var newhash;
                        newhash = hash;
                        
                        currentHash = newhash;
                        
                        dontCheck = true;
                        // Manually keep track of the history values for Safari
                        this.add(hash);

                        // Wait a while before allowing checking so that Safari has time to update the "history" object
                        // correctly (otherwise the check loop would detect a false change in hash).
                        var fn = function() {AP.History.setCheck(false);};
                        window.setTimeout(fn, 200);
                        _callback(hash);
                        // N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
                        //      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
                        //      URL in the browser and the "history" object are both updated correctly.
                        location.hash = newhash;
                    };
                } else if ($.browser.msie) {
                    return function (hash) {
                        var newhash;
                        
                        newhash = '#' + hash;
                        location.hash = newhash;
                        
                        currentHash = newhash;
                        
                        var ihistory = $("#APHistory")[0]; // TODO: need contentDocument?
                        var iframe = ihistory.contentWindow.document;
                        iframe.open();
                        iframe.close();
                        iframe.location.hash = newhash;
                        _callback(hash);
                    };
                } else {
                    return function (hash) {
                        var newhash;

                        newhash = '#' + hash;
                        location.hash = newhash;

                        currentHash = newhash;

                        _callback(hash);
                    };
                }
            }(),

            /**
             * Set need we check, or not.
             * @param check {Boolean}
             * @protected
             */
            setCheck : function (check) {
                dontCheck = check;
            },

            /**
             * @method getCurrentHash
             * @return {String}
             */
            getCurrentHash : function () {
                return currentHash;
            }
        };
    }();


}, '0.0.1');