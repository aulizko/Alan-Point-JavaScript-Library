/*
 * Array utilities
 * Inspired by YUI 3.0.0.pr2 Array submodule
 * 
 * @module ap
 */
AP.add('array', function (A) {
    
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
        var t = (al) ? 2 : AP.Array.test(o);
        switch (t) {
            case 1:
                // return (i) ? o.slice(i) : o;
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
     * @param a {Array} input array
     * @param f {Function} function which will be executed on each item
     * @param o {Object} this context for supplied function (opt)
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
     * Executes the supplied function on each item in the array.
     * Returning true from the processing function will stop the 
     * processing of the remaining
     * items.
     * @method Array.some
     * @param a {Array} the array to iterate
     * @param f {Function} the function to execute on each item
     * @param o Optional context object
     * @static
     * @return {boolean} true if the 
     */
     A.some = (Native.some) ?
        function (a, f, o) { 
            return a.some(f, o || AP.config.win);
        } :
        function (a, f, o) {
            var l = a.length;
            for (var i = 0; i < l; i=i+1) {
                if (f.call(o || AP.config.win, a[i], i, a)) {
                    return true;
                }
            }
            return false;
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
     * @param val {Mixed} the value to search for
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
     * @param fn {Function} function that called once for each element. If func return true, than that element will be in output. Keep it boolean.
     * func will receive next params:<ul>
     * <li>value {Object} the value of the element.</li>
     * <li>index {Number} the index of the element.
     * <li>container {Array} the Array object being traversed</li>
     * </ul>
     * @param c {Object} Context object. (opt)
     */
    A.filter = (Native.filter) ?
        function (a, fn, c) {
            return a.filter(fn, c || AP.config.win);
        } :
        function (a, func, c) {
            var result = [], i = a.length;
            while(i--) {
                if (i in a && fn.call(c || AP.conf.win, a[i], i, a)) result.push(a[i]);
            }
            return result;
        };

    /**
     * Return new Array with uniq elements of input Array
     * @method unique
     * @param a {Array} source array
     * @return {Array} new Array with uniq elements of input Array
     */
    A.unique = function (a) {
        var hash = {}, i = a.length;
        while(i--) {
            if (a[i] in hash) a.splice(i, 1);
            else hash[a[i]] = true;
        }
        return a;
    };

    /**
     * Return new array as result of call provided function of the elements of input array
     * @method map
     * @static
     * @param fn {Function} function
     * @param a {Array} input array
     * @param c {Object} context to function evaluate
     * @return {Array}
     */
    A.map = (Native.map) ?
        function (a, fn, c) {
            return a.map(fn, c || AP.config.win);
        } :
        function (a, fn, c) {
            var result = [], i = a.length;
            while(i--) {
                result[i] = fn.call(c || AP.config.win, a[i]);
            }
            return result;
        };
    
    /**
     * Clean input array from undefined, null values. 
     * Inspired with MooTools clean method.
     * @method clean
     * @static
     * @param input {Array} array to clean
     * @return {Array} cleaned array
     */
    A.clean = function (input) {
        return this.filter(input, function (item) { return AP.Lang.isValue(item); }, this);
    };
    
    /**
     * Return true if every element of the array, evaluated with fn, return true @see MDC every method
     * @method every
     * @static
     * @param a {Array} input array
     * @param fn {Function} function which will evaluate elements
     * @param c {Object} Context of the function
     * @return {Boolean} true if every elements match.
     */
    A.every = (Native.every) ? 
        function (a, fn, c) {
            return a.every(fn, c || AP.config.win);
        } :
        function (a, fn, c) {
            var i = a.length, thisp = c || AP.config.win;
            while(i--) {
                if (i in a && !fn.call(thisp, a[i], i, a))
                    return false;
            }
            return true;
        };
    
    /**
     * Remove from the input array values, equal passed
     * TODO: review to use AP.Lang.compare method to check equality
     * @method erase
     * @static
     * @param a {Array} input array
     * @param val {Mixed} value to erase
     * @return {Array} new array which doesn't contain elements equal passed value
     */
    A.erase = function (a, val) {
        var i = a.length;
        while (i--) {
            if (a[i] === val) a.splice(i, 1);
        }
        return a;
    };
}, '1.0.0', [ { name : 'lang', minversion : '0.0.3' } ]);