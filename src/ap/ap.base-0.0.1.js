// ================================================================
// = Copyright (c) 2008, Alan Point Company. All rights reserved. =
// ================================================================

/**
 * AP core
 * @module ap
 * @author Alexander Ulizko <http://ulizko.com>
 */
(function () {
    var _instances = {};

    var _APPLY_TO_WHITE_LIST = {};

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
                A._setup();
                return A;
            }
         };
    }

    // The prototype contains some core functionality which help to
    // develop projects and some shared configuration
    AP.prototype = {

        /**
        * Initialize this AP instance
        * @param o config options. For details, @see <AP>
        * @private
        */
        _init : function (o) {
           o = o || {};

           // find targeted window
           var w = (o.win) ? (o.win.contentWindow) : o.win || window;
           o.win = w;
           o.doc = w.document;
           o.browser = {
               ie6 : ($.browser.msie && (($.browser.version.substr(0, 1) - 0) == 6))
           };

           AP._configureEnvinronment();

           this.config = o;
            
            this.CONSTANT = {
                KEYCODE : {
                    CAPS_LOCK: 20,
                    ALT: 18,
                    CONTROL: 17,
                    DOWN: 40,
                    END: 35,
                    ENTER: 13,
                    ESCAPE: 27,
                    HOME: 36,
                    INSERT: 45,
                    LEFT: 37,
                    NUMPAD_ADD: 107,
                    NUMPAD_DIVIDE: 111,
                    NUMPAD_ENTER: 108,
                    NUMPAD_MULTIPLY: 106,
                    PAGE_DOWN: 34,
                    PAGE_UP: 33,
                    PERIOD: 190,
                    RIGHT: 39,
                    SHIFT: 16,
                    TAB: 9,
                    UP: 38
                }
           };

           this.Env = {
               // todo expand the new module metadata
               mods: {},
               _idx: 0,
               _pre: 'ap',
               _used: {},
               _attached: {},
               _yidx: 0,
               _uidx: 0
           };

           if (AP.Env) {
               this.Env._yidx = ++AP.Env._idx;
               this.id = this.stamp(this);
               _instances[this.id] = this;
           }

           this.constructor = AP;
        },

        /**
         * Finishes the instance setup. Attaches whatever modules were defined
         * when the ap modules was registered. Load utilites, if any.
         *
         * @method _setup
         * @private
         */
        _setup : function (o) {

            this.use("ap");

            // todo eval the need to copy the config
            this.config = this.merge(this.config);
        },

        /**
         * Makes development a lot easier.
         * Defines free from conflicts shortcut $ for jQuery
         *
         * @method _configureEnvinronment
         * @private
         */
        _configureEnvinronment : function () {
            // Define safe shortcut for jQuery $ function.

//            if (typeof(jQuery) !== 'undefined' && jQuery && typeof($) === 'undefined') {
//                $ = jQuery.noConflict();
//            }
        },


        /**
         * Returns the namespace specified and creates it if it doesn't exist
         * <pre>
         * AP.namespace("property.package");
         * AP.namespace("AP.property.package");
         * </pre>
         * Either of the above would create AP.property, then
         * AP.property.package
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
                o = this;
                for (j=(d[0] == "AP") ? 1 : 0; j<d.length; j=j+1) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
                // initialize MemoryManager namespace
                if (this.Manager) {
                    this.Manager.currentNamespace = o;
                }

            }
            return o;
        },

        /**
         * Register a module
         * @method add
         * @param name {String} module name
         * @param namespace {String} name space for the module
         * @param fn {Function} entry point into the module that
         * is used to bind module to the AP instance
         * @param version {String} version string
         * @return {AP} the AP instance
         */
        add: function(name, fn, version, details) {

            // todo expand this to include version mapping

            // todo allow requires/supersedes

            // todo may want to restore the build property

            // todo fire moduleAvailable event

            var m = {
                name: name,
                fn: fn,
                version: version,
                details: details || {}
            };

            AP.Env.mods[name] = m;

            return this; // chain support
        },

        _attach: function(r, fromLoader) {
            var mods = AP.Env.mods,
                attached = this.Env._attached;

            for (var i=0, l=r.length; i<l; i=i+1) {
                var name = r[i], m = mods[name], mm;
                if (!attached[name] && m) {

                    attached[name] = true;

                    var d = m.details, req = d.requires, use = d.use;

                    if (req) {
                        this._attach(this.Array(req));
                    }


                    if (m.fn) {
                        m.fn(this);
                    }

                    if (use) {
                        this._attach(this.Array(use));
                    }
                }
            }

        },

        /**
         * Bind a module to a AP instance
         * @param modules* {String} 1-n modules to bind (uses arguments array)
         * @param *callback {function} callback function executed when
         * the instance has the required functionality.  If included, it
         * must be the last parameter.
         *
         * <pre>
         * AP().use('dragdrop')
         * AP().use('dragdrop:2.4.0'); // specific version
         * AP().use('dragdrop:2.4.0-'); // at least this version
         * AP().use('dragdrop:2.4.0-2.9999.9999'); // version range
         * AP().use('*'); // use all available modules
         * AP().use('lang+dump+substitute'); // use lang and some plugins
         * AP().use('lang+*'); // use lang and all known plugins
         * </pre>
         *
         * @return {AP} the AP instance
         */
        use: function() {

            var A = this,
                a=Array.prototype.slice.call(arguments, 0),
                mods = AP.Env.mods,
                used = A.Env._used,
                loader,
                firstArg = a[0],
                dynamic = false,
                callback = a[a.length-1];


            // The last argument supplied to use can be a load complete callback
            if (typeof callback === 'function') {
                a.pop();
                A.Env._callback = callback;
            } else {
                callback = null;
            }

            // AP().use('*'); // bind everything available
            if (firstArg === "*") {
                a = [];
                for (var k in mods) {
                    if (mods.hasOwnProperty(k)) {
                        a.push(k);
                    }
                }

                return A.use.apply(A, a);

            }


            // use loader to optimize and sort the requirements if it
            // is available.
            if (A.Loader) {
                dynamic = true;
                loader = new A.Loader(A.config);
                loader.require(a);
                loader.ignoreRegistered = true;
                loader.calculate();
                a = loader.sorted;
            }


            var missing = [], r = [],
              /** @ignore */
              f = function(name) {

                // only attach a module once
                if (used[name]) {
                    return;
                }

                var m = mods[name], j, req, use;

                if (m) {
                    used[name] = true;

                    req = m.details.requires;
                    use = m.details.use;
                } else {
                    missing.push(name);
                }

                // make sure requirements are attached
                if (req) {
                    if (A.Lang.isString(req)) {

                        f(req);
                    } else {
                        for (j = 0; j < req.length; j = j + 1) {
                            f(req[j]);
                        }
                    }
                }

                // add this module to full list of things to attach
                r.push(name);

            };

            // process each requirement and any additional requirements
            // the module metadata specifies
            for (var i=0, l=a.length; i<l; i=i+1) {
                f(a[i]);
            }


            var onComplete = function(fromLoader) {


                fromLoader = fromLoader || {
                    success: true,
                    msg: 'not dynamic'
                };

                if (A.Env._callback) {

                    var cb = A.Env._callback;
                    A.Env._callback = null;
                    cb(A, fromLoader);
                }

            };


            // dynamic load
            if (A.Loader && missing.length) {
                loader = new A.Loader(A.config);
                loader.onSuccess = onComplete;
                loader.onFailure = onComplete;
                loader.onTimeout = onComplete;
                loader.attaching = a;
                loader.require(missing);
                loader.insert();
            } else {
                A._attach(r);
                onComplete();
            }

            return A; // chain support var ap = AP().use('dragdrop');
        },


        /**
         * Executes a method on a AP instance with
         * the specified id if the specified method is whitelisted.
         * @method applyTo
         * @param id {String} the AP instance id
         * @param method {String} the name of the method to exectute.
         * Ex: 'Object.keys'
         * @param args {Array} the arguments to apply to the method
         * @return {object} the return value from the applied method or null
         */
        applyTo: function(id, method, args) {

            if (!(method in _APPLY_TO_WHITE_LIST)) {
                this.fail(method + ': applyTo not allowed');
                return null;
            }

            var instance = _instances[id];

            if (instance) {

                var nest = method.split('.'), m = instance;

                for (var i=0; i<nest.length; i=i+1) {

                    m = m[nest[i]];

                    if (!m) {
                        this.fail('applyTo not found: ' + method);
                    }
                }

                return m.apply(instance, args);
            }

            return null;
        },
        // stub which will be misplaced by logger module
        log: function () {

        },

        /**
         * Generate an id that is unique among all AP instances
         * @method guid
         * @param pre {String} optional guid prefix
         * @return {String} the guid
         */
        guid: function(pre) {
            var e = this.Env, p = (pre) || e._pre;
            return p +'-' + e._yidx + '-' + e._uidx++;
        },

        /**
         * Stamps an object with a guid.  If the object already
         * has one, a new one is not created
         * @method stamp
         * @param o The object to stamp
         * @return {String} The object's guid
         */
        stamp: function(o) {

            if (!o) {
                return o;
            }

            var uid = (typeof o === 'string') ? o : o._apid;

            if (!uid) {
                uid = this.guid();
                o._apid = uid;
            }

            return uid;
        }
    };



    // Give the AP global the same properties as an instance.
    // todo review

    var A = AP, p = A.prototype, i;

    // inheritance utilities are not available yet
    for (i in p) {
        if (true) { // hasOwnProperty not available yet and not needed
           A[i] = p[i];
        }
    }

    // set up the environment
    A._init({debug: true});

})();

// This is just a stub to for dependency processing
AP.add("ap-base", null, "0.0.1ar");


AP.add("log",
    /**
     * AP universal logger
     * @class Log
     * @borrows AP#log as instance.log
     */
    function(instance) {
     /**
      * If the 'debug' config is true, a 'ap:log' event will be
      * dispatched, which the logger widget and anything else
      * can consume.  If the 'useConsole' config is true, it will
      * write to the browser console if available.
      *
      *
      * @param  {String}  msg  The message to log.
      * @param  {String}  cat  The log category for the message.  Default
      *                        categories are "info", "warn", "error", time".
      *                        Custom categories can be used as well. (opt)
      * @param  {String}  src  The source of the the message (opt)
      * @return {AP}      AP instance
      */
    instance.log = function(msg, src, cat) {
        var A = instance, c = A.config;

        // suppress log message if the config is off or the event stack
        // or the event call stack contains a consumer of the ap:log event
        if (c.debug) {
            // define the output:
            if ("console" in window) {
                var f = (cat && console[cat]) ? cat : 'log',
                  m = (src) ? msg + ': %o' : msg;

                if (src) {
                    console[f](m, src);
                } else {
                    console[f](m);
                }
            } else if ("log" in window) {
                // use "log" function as output
                log(msg);
            } else if ("LOG" in window) {
                // use "LOG" as output
                // TODO : check api of comparison js and logger and console
                LOG(msg);
            }
        }
        return A;
    };
}, '0.0.1');

AP.add("lang", function(A) {

    /**
     * Provides the language utilites and extensions used by the library
     * @class AP~Lang
     * @static
     */
    AP.Lang = AP.Lang || {};

    var SPLICE="splice", LENGTH="length";

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * todo can we kill this cross frame hack?
     * @method isArray
     * @static
     * @param {Object} o The object to test
     * @return {boolean} true if o is an array
     */
     AP.Lang.isArray = function(o) {
        if (o) {
           //return L.isNumber(o.length) && L.isFunction(o.splice);
           return (o[SPLICE] && AP.Lang.isNumber(o[LENGTH]));
        }
        return false;
    };

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a boolean
     */
    AP.Lang.isBoolean = function(o) {
        return typeof o === 'boolean';
    };

    /**
     * Determines whether or not the provided object is a function
     * @method isFunction
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a function
     */
    AP.Lang.isFunction = function(o) {
        return typeof o === 'function';
    };

    /**
     * Determines whether or not the supplied object is a date instance
     * @method isDate
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a date
     */
    AP.Lang.isDate = function(o) {
        return o instanceof Date;
    };

    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @static
     * @param o The object to test
     * @return {boolean} true if o is null
     */
    AP.Lang.isNull = function(o) {
        return o === null;
    };

    /**
     * Determines whether or not the provided object is a legal number
     * @method isNumber
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a number
     */
    AP.Lang.isNumber = function(o) {
        return typeof o === 'number' && isFinite(o);
    };

    /**
     * Determines whether or not the provided object is of type object
     * or function
     * @method isObject
     * @static
     * @param o The object to test
     * @param failfn {boolean} fail if the input is a function
     * @return {boolean} true if o is an object
     */
    AP.Lang.isObject = function(o, failfn) {
return (o && (typeof o === 'object' || (!failfn && AP.Lang.isFunction(o)))) || false;
    };

    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a string
     */
    AP.Lang.isString = function(o) {
        return typeof o === 'string';
    };

    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @static
     * @param o The object to test
     * @return {boolean} true if o is undefined
     */
    AP.Lang.isUndefined = function(o) {
        return typeof o === 'undefined';
    };

    /**
     * Returns a string without any leading or trailing whitespace.  If
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @static
     * @param s {String} the string to trim
     * @return {String} the trimmed string
     */
    AP.Lang.trim = function(s){
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    };

    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN, true for other values,
     * including 0/false/''
     * @method isValue
     * @static
     * @param o The item to test
     * @return {boolean} true if it is not null/undefined/NaN || false
     */
    AP.Lang.isValue = function(o) {
// return (o || o === false || o === 0 || o === ''); // Infinity fails
return (AP.Lang.isObject(o) || AP.Lang.isString(o) || AP.Lang.isNumber(o) || AP.Lang.isBoolean(o));
    };

    /**
     * Checks if an item is null or is an empty array / empty jQuery object
     * or an empty object (object that has no keys)
     * @method isEmpty
     * @static
     * @param o item
     * @return {boolean} true if the item is empty
     */
    AP.Lang.isEmpty = function (o) {
        return AP.Lang.isNull(o) || (!AP.Lang.isUndefined(o.length) && o.length == 0);
        //return AP.Lang.isNull(o) || (!AP.Lang.isUndefined(o.length) && o.length == 0) || (AP.Lang.isObject(o) && !AP.Object.keys(o).length);
    };

}, "0.0.1");

/*
 * Array utilities
 * @module ap
 * @submodule array
 */
AP.add("array", function(A) {

    var L = A.Lang, Native = Array.prototype;

    /**
     * Adds the following array utilities to the AP instance
     * @class AP~array
     */

    /**
     * A.Array(o) returns an array:
     * - Arrays are return unmodified unless the start position is specified.
     * - "Array-like" collections (@see Array.test) are converted to arrays
     * - For everything else, a new array is created with the input as the sole item
     * - The start position is used if the input is or is like an array to return
     *   a subset of the collection.
     *
     *   todo this will not automatically convert elements that are also collections
     *   such as forms and selects.  Passing true as the third param will
     *   force a conversion.
     *
     * @method Array
     * @static
     *   @param o the item to arrayify
     *   @param i {int} if an array or array-like, this is the start index
     *   @param al {boolean} if true, it forces the array-like fork.  This
     *   can be used to avoid multiple array.test calls.
     *   @return {Array} the resulting array
     */
    A.Array = function(o, i, al) {
        var t = (al) ? 2 : A.Array.test(o);
        switch (t) {
            case 1:
                return (i) ? o.slice(o, i) : o;
            case 2:
                return Native.slice.call(o, i || 0);
            default:
                return [o];
        }
    };

    var A = A.Array;

    /**
     * Evaluates the input to determine if it is an array, array-like, or
     * something else.  This is used to handle the arguments collection
     * available within functions, and HTMLElement collections
     *
     * @method Array.test
     * @static
     *
     * todo current implementation (intenionally) will not implicitly
     * handle html elements that are array-like (forms, selects, etc).
     *
     * @return {int} a number indicating the results:
     * 0: Not an array or an array-like collection
     * 1: A real array.
     * 2: array-like collection.
     */
    A.test = function(o) {
        var r = 0;
        if (L.isObject(o, true)) {
            if (L.isArray(o)) {
                r = 1;
            } else {
                try {
                    // indexed, but no tagName (element) or alert (window)
                    if ("length" in o && !("tagName" in o)  && !("alert" in o)) {
                        r = 2;
                    }

                } catch(ex) {}
            }
        }
        return r;
    };

    /**
     * Executes the supplied function on each item in the array.
     * @method Array.each
     * @static
     * @return {AP} the AP instance
     */
    A.each = (Native.forEach) ?
        function (a, f, o) {
            Native.forEach.call(a, f, o || A);
            return A;
        } :
        function (a, f, o) {
            var l = a.length, i;
            for (i = 0; i < l; i=i+1) {
                f.call(o || A, a[i], i, a);
            }
            return A;
        };

    /**
     * Returns an object using the first array as keys, and
     * the second as values.  If the second array is not
     * provided the value is set to true for each.
     * @method Array.hash
     * @static
     * @param k {Array} keyset
     * @param v {Array} optional valueset
     * @return {object} the hash
     */
    A.hash = function(k, v) {
        var o = {}, l = k.length, vl = v && v.length, i;
        for (i=0; i<l; i=i+1) {
            o[k[i]] = (vl && vl > i) ? v[i] : true;
        }

        return o;
    };


    /**
     * Returns the index of the first item in the array
     * that contains the specified value, -1 if the
     * value isn't found.
     * todo use native method if avail
     * @method Array.indexOf
     * @static
     * @param a {Array} the array to search
     * @param val the value to search for
     * @return {int} the index of the item that contains the value or -1
     */
    A.indexOf = function(a, val) {
        for (var i=0; i<a.length; i=i+1) {
            if (a[i] === val) {
                return i;
            }
        }

        return -1;
    };

    /**
     * Creates a new array with all elements that pass the test implemented by the provided function
     * @method filter
     * @param a {Array} array to work with
     * @param func {Function} function that called once for each element. If func return true, than that element will be in output. Keep it boolean.
     * func will receive next params:<ul>
     * <li>value {Object} the value of the element.</li>
     * <li>index {Number} the index of the element.
     * <li>container {Array} the Array object being traversed</li>
     * </ul>
     * @param c {Object} Context object. (opt)
     */
    A.filter = function (a, func, c) {

        if (!L.isFunction(func)) {
            throw new TypeError('argument {func} must be a Function');
        }

        if (!L.isArray(a)) {
            throw new TypeError('argument {a} must be an Array');
        }

        if (!Array.prototype.filter) {
            var result = new Array(),
            context = c || AP.conf.win,
            len = a.length,
            value, i;

            for (i = 0; i < len; i++) {
                if (i in a) {
                    value = a[i]; // in case fun mutates this
                    if (func.call(context, value, i, a)) {
                        result.push(value);
                    }
                }
            }

            return result;
        } else {
            return a.filter(func, c);
        }


    };

    /**
     * Compare length, properties (recursievly) of two arrays. If any diffences found, return false.
     * @param expected {Array}
     * @param actual {Array}
     * @method equal
     */
    A.equal = function (expected, actual) {
        if (L.isNull(expected)) {
            return L.isNull(actual);
        }
        if (L.isNull(actual)) {
            return L.isNull(expected);
        }
        if (L.isUndefined(expected)) {
            return L.isUndefined(actual);
        }
        if (L.isUndefined(actual)) {
            return L.isUndefined(expected);
        }
        var length = expected.length, i, expectedProperty, actualProperty;
        if (length != actual.length) {
            return false;
        }
        for (i = 0; i < length; i++) {
            expectedProperty = expected[i];
            actualProperty = actual[i];
            if (L.isUndefined(actualProperty)) {
                return false;
            } else {
                if (L.isValue(actualProperty) && !L.isObject(actualProperty)
                  && L.isValue(expectedProperty) && !L.isObject(expectedProperty)) {
                    // the property is the simple value so that we can easy compare it with each other
                    if (actualProperty != expectedProperty) {
                        return false;
                    }
                } else if (L.isObject(actualProperty) && L.isObject(expectedProperty)) {
                    if (!AP.Object.equal(expectedProperty, actualProperty)) {
                        return false;
                    }
                } else if (L.isArray(actualProperty) && L.isArray(expectedProperty)) {
                    if (!AP.Array.equal(expectedProperty, actualProperty)) {
                        return false;
                    }
                } else if (L.isFunction(actualProperty) && L.isFunction(expectedProperty)) {
                    // I don't know way to comparise a function - maybe it is possible to
                    // comparise name of the functions, arguments, callee.
                } else {
                    return true;
                }
            }
        }
        return true;
    };

    /**
     * Return new Array with uniq elements of input Array
     * @method unique
     * @param inputArray {Array} source array
     * @return {Array} new Array with uniq elements of input Array
     */
    A.unique = function (inputArray) {
        var resultArray = new Array(), arrayHash = [], arrayLength = inputArray.length, i, value;
        for (i = 0; i < arrayLength; ++i) arrayHash[inputArray[i]] = true;

        for (value in arrayHash) resultArray.push(value);
        return resultArray;
    };

    /**
     * Return new array as result of call provided function of the elements of input array
     * @method map
     * @param fn {Function} function
     * @param input {Array} input array
     * @return {Array}
     */
     A.map = function (fn ,input, context) {
        if (!L.isArray(input)) {
            throw "input must be array";
        }
        var out = [], length = input.length, i = 0;
        for (i; i < length; i++) {
             out[i] = fn.call((context) ? context : AP.config.win, input[i]);
        }
        return out;
    };

}, "0.0.1");


AP.add("object", function(A) {

    /**
     * A.Object(o) returns a new object based upon the supplied object.
     * @class AP~object
     * @method Object
     * @static
     * @param o the supplier object
     * @return {object} the new object
     */
    A.Object = function(o) {
        var F = function() {};
        F.prototype = o;
        return new F();
    };

    var O = A.Object, L = A.Lang;
    /**
     * Returns an array containing the object's keys
     * @method Object.keys
     * @static
     * @param o an object
     * @return {string[]} the keys
     */
    O.keys = function(o) {
        var a=[], i;
        for (i in o) {
            if (o.hasOwnProperty(i)) {
                a.push(i);
            }
        }

        return a;
    };

    /**
     * Executes a function on each item. The function
     * receives the value, the key, and the object
     * as paramters (in that order).
     * @method Object.each
     * @static
     * @param o the object to iterate
     * @param f {function} the function to execute
     * @param c the execution context
     * @param proto {boolean} include proto
     * @return {AP} the AP instance
     */
    O.each = function (o, f, c, proto) {
        var s = c || A;

        for (var i in o) {
            if (proto || o.hasOwnProperty(i)) {
                f.call(s, o[i], i, o);
            }
        }
        return A;
    };

    /**
     * Check properties presence i\and equality of its values in two provided objects. If properties are same, return true.
     * @method equal
     * @param expected {Object} object to compare with
     * @param actual {Object} object to compare with
     * @return {Boolean} true if properties are equal, false in other way.
     */
    O.equal = function (expected, actual) {
        if (L.isNull(expected)) {
            return L.isNull(actual);
        }
        if (L.isNull(actual)) {
            return L.isNull(expected);
        }
        if (L.isUndefined(expected)) {
            return L.isUndefined(actual);
        }
        if (L.isUndefined(actual)) {
            return L.isUndefined(expected);
        }
        //get all properties in the object
        var properties = O.keys(expected), length = properties.length, i, expectedProperty, actualProperty;
        if (L.isNull(expected)) {
            return L.isNull(actual);
        }
        if (L.isNull(actual)) {
            return L.isNull(expected);
        }
        //see if the properties are in the expected object
        for (i=0; i < length; i++){
            expectedProperty = expected[properties[i]];
            actualProperty = actual[properties[i]];
            if (L.isUndefined(actualProperty)) {
                // actual doesn't have property which exists in expected object
                return false;
            } else {
                // compare value of the properties
                if (L.isValue(actualProperty) && !L.isObject(actualProperty)
                  && L.isValue(expectedProperty) && !L.isObject(expectedProperty)) {
                    // the property is the simple value so that we can easy compare it with each other
                    if (actualProperty != expectedProperty) {
                        return false;
                    }
                } else if (L.isObject(actualProperty) && L.isObject(expectedProperty)) {
                    if (!AP.Object.equal(expectedProperty, actualProperty)) {
                        return false;
                    }
                } else if (L.isArray(actualProperty) && L.isArray(expectedProperty)) {
                    if (!AP.Array.equal(expectedProperty, actualProperty)) {
                        return false;
                    }
                    // todo: make comparison using corresponding AP.Array method
                } else if (L.isFunction(actualProperty) && L.isFunction(expectedProperty)) {
                    // I don't know way to comparise a function - maybe it is possible to
                    // comparise name of the functions, arguments, callee.
                } else {
                    return true;
                }
            }
        }
        return true;

    };
}, "0.0.1");
/*
 * AP core utilities
 * @module ap
 * @submodule core
 * @requires lang
 */
AP.add("core", function(A) {

    var L = A.Lang,
    Ar = A.Array,
    OP = Object.prototype,
    IEF = ["toString", "valueOf"],
    PROTO = 'prototype',

    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions
     * we care about on the Object prototype.
     * @property _iefix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param w a whitelist object (the keys are the valid items to reference)
     * @private
     * @for AP
     */
    _iefix = ($.browser && $.browser.msid) ?
        function(r, s, w) {
            for (var i=0, a=IEF; i<a.length; i=i+1) {
                var n = a[i], f = s[n];
                if (L.isFunction(f) && f != OP[n]) {
                    if (!w || (n in w)) {
                        r[n]=f;
                    }
                }
            }
        } : function() {};


    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.  Passing in a
     * single object will create a shallow copy of it.  For a deep
     * copy, use clone.
     * @method merge
     * @param arguments {Obje ct*} the objects to merge
     * @return {object} the new merged object
     */
    A.merge = function() {
        // var o={}, a=arguments;
        // for (var i=0, l=a.length; i<l; i=i+1) {
        //var a=arguments, o=A.Object(a[0]);
        var a=arguments, o={};
        for (var i=0, l=a.length; i<l; i=i+1) {
            A.mix(o, a[i], true);
        }
        return o;
    };

    /**
     * Applies the supplier's properties to the receiver.  By default
     * all prototype and static propertes on the supplier are applied
     * to the corresponding spot on the receiver.  By default all
     * properties are applied, and a property that is already on the
     * reciever will not be overwritten.  The default behavior can
     * be modified by supplying the appropriate parameters.
     *
     * todo add constants for the modes
     *
     * @method mix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param ov {boolean} if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @param wl {string[]} a whitelist.  If supplied, only properties in
     * this list will be applied to the receiver.
     * @param {int} mode what should be copies, and to where
     *        default(0): object to object
     *        1: prototype to prototype (old augment)
     *        2: prototype to prototype and object props (new augment)
     *        3: prototype to object
     *        4: object to prototype
     * @param merge {boolean} merge objects instead of overwriting/ignoring
     * Used by A.aggregate
     * @return {object} the augmented object
     * todo review for PR2
     */
    A.mix = function(r, s, ov, wl, mode, merge) {

        if (!s||!r) {
            return A;
        }

        var w = (wl && wl.length) ? Ar.hash(wl) : null, m = merge,

            f = function(fr, fs, proto, iwl) {

                var arr = m && L.isArray(fr);

                for (var i in fs) {

                    // We never want to overwrite the prototype
                    // if (PROTO === i) {
                    if (PROTO === i || '_apid' === i) {
                        continue;
                    }

                    // todo deal with the hasownprop issue

                    // check white list if it was supplied
                    if (!w || iwl || (i in w)) {
                        // if the receiver has this property, it is an object,
                        // and merge is specified, merge the two objects.
                        if (m && L.isObject(fr[i], true)) {
                            // todo recursive or no?
                            // A.mix(fr[i], fs[i]); // not recursive
                            f(fr[i], fs[i], proto, true); // recursive
                        // otherwise apply the property only if overwrite
                        // is specified or the receiver doesn't have one.
                        // todo make sure the 'arr' check isn't desructive
                        } else if (!arr && (ov || !(i in fr))) {
                            fr[i] = fs[i];
                        // if merge is specified and the receiver is an array,
                        // append the array item
                        } else if (arr) {
                            // todo probably will need to remove dups
                            fr.push(fs[i]);
                        }
                    }
                }

                _iefix(fr, fs, w);
            };

        var rp = r.prototype, sp = s.prototype;

        switch (mode) {
            case 1: // proto to proto
                f(rp, sp, true);
                break;
            case 2: // object to object and proto to proto
                f(r, s);
                f(rp, sp, true);
                break;
            case 3: // proto to static
                f(r, sp, true);
                break;
            case 4: // static to proto
                f(rp, s);
                break;
            default:  // object to object
                f(r, s);
        }

        return r;
    };

}, "0.0.1");