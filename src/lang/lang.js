/**
 * AP lang utils
 * Inspired by YUI lang module
 * @module ap
 * @submodule lang
 */
AP.add('lang', function (A) {
    /**
     * Provides the language utilites and extensions used by the library
     * @class Lang
     * @static
     */
    A.Lang = A.Lang || {};

    var L = A.Lang,
        ARRAY_TOSTRING = '[object Array]',
        FUNCTION_TOSTRING = '[object Function]',
        REGEXP_TOSTRING = '[object RegExp]',
        PRIMITIVES = { 'string' : 'string', 'boolean' : 'boolean', 'number' : 'number'},
        OBJECT = 'object',
        UNDEFINED = 'undefined',
        OP = Object.prototype;

    /**
     * Determines whether or not the provided object is an array.
     * Testing typeof/instanceof/constructor of arrays across frame
     * boundaries isn't possible in Safari unless you have a reference
     * to the other frame to test against its Array prototype.  To
     * handle this case, we test well-known array properties instead.
     * properties.
     * @TODO can we kill this cross frame hack?
     * @method isArray
     * @static
     * @param o The object to test
     * @return {boolean} true if o is an array
     */
    L.isArray = function (o) {
        return OP.toString.apply(o) === ARRAY_TOSTRING;
    };

    /**
     * Determines whether or not the provided object is a boolean
     * @method isBoolean
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a boolean
     */
    L.isBoolean = function (o) {
        return typeof o === PRIMITIVES['boolean'] || o instanceof Boolean;
    };

    /**
     * Determines whether or not the provided object is a function
     * Note: Internet Explorer thinks certain functions are objects:
     *
     * var obj = document.createElement("object");
     * AP.Lang.isFunction(obj.getAttribute) // reports false in IE
     *
     * var input = document.createElement("input"); // append to body
     * AP.Lang.isFunction(input.focus) // reports false in IE
     *
     * You will have to implement additional tests if these functions
     * matter to you.
     *
     * @method isFunction
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a function
     */
    L.isFunction = function (o) {
        return OP.toString.apply(o) === FUNCTION_TOSTRING;
    };

    /**
     * Determines whether or not the supplied object is a date instance
     * @method isDate
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a date
     */
    L.isDate = function (o) {
        return o instanceof Date;
    };

    /**
     * Determines whether or not the provided object is null
     * @method isNull
     * @static
     * @param o The object to test
     * @return {boolean} true if o is null
     */
    L.isNull = function (o) {
        return o === null;
    };

    /**
     * Determines whether or not the provided object is a legal number
     * Also returns true if Number object passed in
     * @method isNumber
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a number
     */
    L.isNumber = function (o) {
        return (typeof o === PRIMITIVES['number'] || o instanceof Number) && isFinite(o);
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
    L.isObject = function (o, failfn) {
        return (o && (typeof o === OBJECT || (!failfn && L.isFunction(o)))) || false;
    };

    /**
     * Determines whether or not the provided object is a string
     * @method isString
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a string
     */
    L.isString = function (o) {
        return typeof o === PRIMITIVES['string'];
    };

    /**
     * Determines whether or not the provided object is undefined
     * @method isUndefined
     * @static
     * @param o The object to test
     * @return {boolean} true if o is undefined
     */
    L.isUndefined = function (o) {
        return typeof o === UNDEFINED;
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
    L.isValue = function (o) {
        return (L.isObject(o) || L.isString(o) || L.isNumber(o) || L.isBoolean(o));
    };

    /**
     * Determines whether or not the provided object is a RegExp object
     * @method isRegExp
     * @static
     * @param o The object to test
     * @return {boolean} true if o is a regexp
     * @param o
     */
    L.isRegExp = function (o) {
        return typeof(o) === REGEXP_TOSTRING;
    };

    /**
     * Deep compare of array, object, function, string and number. If value of object are equal, return true.
     * Otherwise, return false.
     * TODO: review maybe it is better to update this method in MochiKit way - to return -1,0,1 and being able to sort.
     * @method compare
     * @static
     * @param a first item to compare
     * @param b second item to compare
     */
    L.compare = function (a, b) {
        var count, lengthOfA, lengthOfB;
        // return primitive equivalent for string, number or boolean object
        function primitify (o) {
            return L.isObject(o) && (L.isNumber(o) || L.isString(o.valueOf()) || L.isBoolean(o)) ? o.valueOf() : o;
        }
        // check type of the passed values. if it is different, return
        if (L.isNull(a) && L.isNull(b)) {
            return true;
        }

        if (L.isUndefined(a) && L.isUndefined(b)) {
            return true;
        }
        // convert date into milliseconds
        a = L.isDate(a) ? a.getTime() : a;
        b = L.isDate(b) ? b.getTime() : b;
        // convert objects into primitives
        a = primitify(a);
        b = primitify(b);

        // check if a & b are primitives
        if (typeof a in PRIMITIVES && typeof b in PRIMITIVES) {
            // compare primitives
            return a == b;
        }

        // compare functions
        if (L.isFunction(a) && L.isFunction(b)) {
            return a.toString() == b.toString();
        }

        // deep compare arraylike structures
        // compare types of the passed variables
        if (L.isArray(a) && L.isArray(b)) {
            // compare lengths
            count = a.length;
            if (count != b.length) { return false; }
            // recursive call compare onto each element
            while(count--) {
                if (!L.compare(a[count], b[count])) {
                    return false;
                }
            }
            return true;
        }

        // deep compare objects
        if (L.isObject(a) && L.isObject(b)) {
            // check number of properties. if it's different, return false
            lengthOfA = lengthOfB = 0;

            for (i in a) { lengthOfB++; lengthOfA++; }
            if (lengthOfA != lengthOfB) { return false; }
            // recursive call compare method for every property
            for (i in a) {
                if (!L.compare(a[i], b[i])) { return false; }
            }
            return true;
        }

        // passed variables cannot be compared, return false (TODO: review, need we to throw error)
        return false;
     };
}, '0.0.3');