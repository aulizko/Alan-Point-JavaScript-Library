/*
 * AP object utilities
 * @module ap
 * @submodule object
 */
AP.add('object', function (A) {
    /**
     * Adds the following Object utilities to the YUI instance
     * @class AP~object
     */

    /**
     * A.Object(o) returns a new object based upon the supplied object.  
     * Inspired from the Douglas Crockford 'object' method
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
    
    var O = A.Object;
    
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
     * @param f {Function} the function to execute
     * @param c the execution context
     * @param proto {Boolean} include proto
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
     * Return new object based on passed in object.
     * New object contains public properties from the supplier, if passed in function return true
     * when evaluated property value.
     * @method Object.filter
     * @static
     * @param o {Object} the object to filter
     * @param f {Function} the function to execute
     * @param c {Object} execution context
     * @return {Object} new object
     */
    O.filter = function (o, f, c) {
        var res = {};
        O.each(o, function (item, name) {
            if (f(item)) res[name] = item;
        }, c || A);
        return res;
    };
    
    /**
     * Cleans passed in object - remove properties which value is null or undefined.
     * @method Object.clean
     * @static
     * @param o {Object} 'dirty' object
     * @return {Object} clean object
     */
    O.clean = function (o) {
        return O.filter(o, function (item) { return A.Lang.isValue(item); });
    };
    
    /**
     * Create mapping of the input object
     * @method Object.map
     * @static
     * @param o {Object} source object
     * @param f {Function} function to execute
     * @param c {Object} execution context
     * @return {Object} mapped object
     */
    O.map = function (o, f, c) {
        var res = {};
        O.each(o, function (item, name) {
            res[name] = f(item);
        }, c || A);
        return res;
    };
    
    /**
     * Executes provided function on each property of the supplied object
     * If at least one property value, passed in the function, return true, return true.
     * Otherwise, return false.
     * @method Object.some
     * @static
     * @param o {Object} object to iterate
     * @param f {Function} comparator
     * @param c {Object} execution context
     * @return {boolean} match at least one property value comparator or not
     */
    O.some = function (o, f, c) {
        var s = c || A;
        for (var i in o) {
            if (f.call(s, o[i])) {
                return true;
            }
        }
        return false;
    };
    
    /** 
     * Executes provided function on each property of the supplied object.
     * If all properties value match comparator, than, return true. Otherwise, return false.
     * @method Object.every
     * @static
     * @param o {Object} object to iterate
     * @param f {Function} comparator
     * @param c {Object} execution context
     * @return {boolean}
     */
    O.every = function (o, f, c) {
        var s = c || A;
        for (var i in o) {
            if (!f.call(s, o[i])) {
                return false;
            }
        }
        return true;
    };
    
    /**
     * Return name of the property which value equal passed value
     * @method Object.indexOf
     * @static
     * @param o {Object} source hash
     * @param v value to compare with
     * @return name of the property
     */
    O.indexOf = function (o, v) {
        for (var i in o) {
            if (o[i] == v) {
                return i;
            }
        }
        return null;
    };
}, '0.0.1', [
    {
        name : 'lang',
        minVersion : '0.0.2'
    }
]);