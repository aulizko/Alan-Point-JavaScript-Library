/**
 * AP Core
 * @module ap
 * @author Alexander <xan> Ulizko
 */
(function () {
    if (typeof AP === 'undefined' || !AP) {
        /**
         * The AP global namespace object. If AP is already defined,
         * existing AP object will not be overwritten so that defined
         * namespaces are preserved.
         * @class AP
         * @constructor
         * @param o Optional configuration object.  Options:
         * <ul>
         *  <li>------------------------------------------------------------------------</li>
         *  <li>Global:</li>
         *  <li>------------------------------------------------------------------------</li>
         *  <li>debug:
         *  Turn debug statements on or off</li>
         *  <li>win:
         *  The target window/frame</li>
         * </ul>
         */
        AP = function (o) {
            var A = this;
            // Allow var ap = AP() instead of var ap = new AP()
            if (A == window) {
                return new AP(o);
            } else {
                // set up the core environment
                A._init(o);
                // A._setup();
                return A;
            }
        };
    }

    AP.prototype = {
        /**
         * Initialize this AP instance
         * @param o config options. For details, @see <AP>
         * @private
         */
        init : function (o) {
            o = o || {};

            // find targeted window
            var w = (o.win) ? (o.win.contentWindow) : o.win || window;
            o.win = w;
            o.doc = w.document;
            o.envinronment = {
                prefix : 'ap',
                uidIndex : 0,
                modules : {}
            };

            this.config = o;
            this.constructor = AP;
        },
        /**
         * Returns the namespace specified and creates it if it doesn't exist
         * <pre>
         * AP.namespace("property.package");
         * AP.namespace("AP.property.package");
         * </pre>
         * Either of the above would create AP.property, then
         * AP.Project.property.package
         *
         * Be careful when naming packages. Reserved words may work in some browsers
         * and not others. For instance, the following will fail in Safari:
         * <pre>
         * AP.namespace("really.long.nested.namespace");
         * </pre>
         * This fails because "long" is a future reserved word in ECMAScript
         *
         * @method namespace
         * @param  {string*} arguments 1-n namespaces to create
         * @return {object}  A reference to the last namespace object created
         */
        namespace: function() {
            var a=arguments, o=null, i, j, d;
            for (i=0; i<a.length; i=i+1) {
                d = a[i].split(".");

                o = this.Project ? this.Project : this.Project = {};
                for (j = 0; j < d.length; j = j + 1) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            }
            return o;
        },

        /**
         * Creates an empty function which does nothing but return the value passed.
         * Inspired with MooTools $lambda function
         * implementation was taken from MooTools.1.2.1 Core.js, line 201
         * @method lambda
         * @param {Mixed} value The value for the created function to return.
         * @return {Function} A function which returns the desired value.
         */
        lambda : function (value) {
        	return (typeof value == 'function') ? value : function(){
        		return value;
        	};
        },
        // stub which will be misplaced by Console module
        // inspired with YUI log function
        log : function () {},

        /**
         * Generate an id that is unique among all AP instances
         * inspired by YUI 3.0 <guid> method.
         * @method generateUID
         * @return {String} the guid
         */
        generateUID : function (pre) {
            var e = this.config.envinronment, p = (pre) || e.prefix;
            return p +'-' + e.uidIndex++;
        },

        /**
         * Stamps an object with a guid.  If the object already
         * has one, a new one is not created
         * Implementation was taken from YUI 3.0.0.pr1 line 448
         * @method stamp
         * @param o The object to stamp
         * @return {String} The object's unique identifier
         */
        stamp: function(o) {

            if (!o) {
                return o;
            }

            var uid = (typeof o === 'string') ? o : o._uid;

            if (!uid) {
                uid = this.generateUID();
                o._uid = uid;
            }

            return uid;
        },

        /**
         * Register a module
         * Inspired from YUI.3.0.0.pr1 add module
         * @method add
         * @param name {String} module name
         * @param fn {Function} entry point into the module that
         * is used to bind module to the AP instance
         * @param version {String} version string
         * @return {AP} the AP instance
         */
        add : function (name, fn, version, requirements) {
            var m = this.config.envinronment.modules, requirement, i,

            // expand version into major, minor, micro numbers (inspired from Yahoo! BrowserPlus services version system)
            v = {
                version : (function (version) {
                    var v = {
                        major : 0,
                        minor : 0,
                        micro : 0
                    };
                    if (typeof version === 'string') {
                        // inspired with John's Resig fast replace implementation, more details:
                        // http://ejohn.org/blog/search-and-dont-replace/
                        version.replace(/(\d+)\.(\d+)\.(\d+)/, function (m, major, minor, micro) {
                            v.major = major;
                            v.minor = minor;
                            v.micro = micro;
                        });
                    }
                    return v;
                })(version)
            };

            if (!!m[name]) {
                // module with same name already registered. Now is time to compare versions and newer will be registered
                var inc = v.version, ext = m[name].version;

                // TODO: refactor
                if (!((inc.major > ext.major) ||
                    (inc.major == ext.major && inc.minor > ext.minor) ||
                    (inc.major == ext.major && inc.minor == ext.minor && inc.micro > ext.micro))) {

                    return;
                }
            }

            // check requirements
            if (typeof requirements !== 'undefined' && requirements) {
                i = 0;
                while(requirement = requirements[i++]) {
                    var requirementName = requirement.name,
                        error = 'Module registration failure: module ' + name + ' requires module ' + requirementName;

                    if (typeof requirementName === 'string' && typeof m[requirementName] === 'undefined') {
                        throw new Error(error);
                    }

                    if (typeof requirement.minVersion === 'string') {
                        // parse requirement into major, minor, micro numbers
                        var version = requirement.minVersion.split(/\./), j = 0, existedVersion = m[requirementName].version;
                        if ((existedVersion.major < version[0]) ||
                          (existedVersion.major == version[0] && existedVersion.minor < version[1]) ||
                          (existedVersion.major == version[0] && existedVersion.minor == version[1] && existedVersion.micro < version[2])) {

                            throw new Error(error + ' version at least ' + requirement.minVersion);
                        }

                    }

                    if (typeof requirement.maxVersion === 'string') {
                        // parse requirement into major, minor, micro numbers
                        var version = requirement.maxVersion.split(/\./), j = 0, existedVersion = m[requirementName].version;
                        if ((existedVersion.major > version[0]) ||
                              (existedVersion.major == version[0] && existedVersion.minor > version[1]) ||
                              (existedVersion.major == version[0] && existedVersion.minor == version[1] && existedVersion.micro > version[2])) {
                            throw new Error(error + ' version no greater than ' + requirement.maxVersion);
                        }
                    }
                }
            }



            m[name] = v;

            fn(this);
        }
    };

    var A = AP, p = A.prototype, i;

    // inheritance utilities are not available yet
    for (i in p) {
        if (true) { // hasOwnProperty not available yet and not needed
           A[i] = p[i];
        }
    }

    A.init();

})();
