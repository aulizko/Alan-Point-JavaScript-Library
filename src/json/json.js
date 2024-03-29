AP.add("json-decode", function(A) {


/**
 * Provides AP.JSON.decode method to take JSON strings and return native
 * JavaScript objects.
 * The JSON Utility provides methods to serialize JavaScript objects into
 * JSON strings and decode JavaScript objects from strings containing JSON data.
 * Three modules are available for inclusion:
 * <ol>
 * <li>1. <code>json-decode</code> for parsing JSON strings into native JavaScript data</li>
 * <li>2. <code>json-encode</code> for stringification of JavaScript objects into JSON strings</li>
 * <li>3. <code>json</code> for both parsing and stringification</li>
 * </ol>
 *
 * Both <code>json-decode</code> and <code>json-encode</code> create functions in a static JSON class under your AP instance (e.g. A.JSON.decode(..)).
 * @class AP.JSON
 * @static
 */
AP.JSON = AP.JSON || {};

// All internals kept private for security reasons

var
    /**
     * Replace certain Unicode characters that JavaScript may handle incorrectly
     * during eval--either by deleting them or treating them as line endings--with
     * escape sequences.
     * IMPORTANT NOTE: This regex will be used to modify the input if a match is
     * found.
     * @property {RegExp} _UNICODE_EXCEPTIONS
     * @memberOf AP.JSON
     * @private
     */
    _UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,


/**
 * First step in the validation.  Regex used to replace all escape
 * sequences (i.e. "\\", etc) with '@' characters (a non-JSON character).
 * @property {RegExp} _ESCAPES
 * @memberOf AP.JSON
 * @private
 */
    _ESCAPES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,

/**
 * Second step in the validation.  Regex used to replace all simple
 * values with ']' characters.
 * @property {RegExp} _VALUES
 * @memberOf AP.JSON
 * @private
 */
    _VALUES  = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
/**
 * Now Firefox (since 3.1b6) have native support for JSON decoding, so that 
 * Now scripts check if there is native support and if it present, use it (cause firefox implementation 
 * is much faster)
 * @property {Boolean} _IS_BROWSER_SUPPORT_NATIVE
 * @private
 */
    _IS_BROWSER_SUPPORT_NATIVE = typeof JSON !== 'undefined',
/**
 * Third step in the validation.  Regex used to remove all open square
 * brackets following a colon, comma, or at the beginning of the string.
 * @property {RegExp} _BRACKETS
 * @memberOf AP.JSON
 * @private
 */

    _BRACKETS = /(?:^|:|,)(?:\s*\[)+/g,

/**
 * Final step in the validation.  Regex used to test the string left after
 * all previous replacements for invalid characters.
 * @property {RegExp} _INVALID
 * @memberOf AP.JSON
 * @private
 */
    _INVALID  = /^[\],:{}\s]*$/,

    has = Object.prototype.hasOwnProperty,
/**
 * Traverses nested objects, applying a reviver function to each (key,value)
 * from the scope if the key:value's containing object.  The value returned
 * from the function will replace the original value in the key:value pair.
 * If the value returned is undefined, the key will be omitted from the
 * returned object.
 * @method _revive
 * @memberOf AP.JSON
 * @param data {MIXED} Any JavaScript data
 * @param reviver {Function} filter or mutation function
 * @return {MIXED} The results of the filtered data
 * @private
 */
    _revive = function (data, reviver) {
        var walk = function (o,key) {
            var k,v,value = o[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (has.call(value,k)) {
                        v = walk(value, k);
                        if (v === undefined) {
                            delete value[k];
                        } else {
                            value[k] = v;
                        }
                    }
                }
            }
            return reviver.call(o,key,value);
        };

        return typeof reviver === 'function' ? walk({'':data},'') : data;
    };

/**
 * Parse a JSON string, returning the native JavaScript representation.
 * @param s {String} JSON string data
 * @param reviver {function} (optional) function(k,v) passed each key value pair of object literals, allowing pruning or altering values
 * @return {MIXED} the native JavaScript representation of the JSON string
 * @throws SyntaxError
 * @method decode
 * @static
 * @public
 */
AP.JSON.decode = (_IS_BROWSER_SUPPORT_NATIVE) ?
    JSON.parse :
    function (s,reviver) {
        // Ensure valid JSON
        if (typeof s === 'string') {
            // Replace certain Unicode characters that are otherwise handled
            // incorrectly by some browser implementations.
            // NOTE: This modifies the input if such characters are found!
            s = s.replace(_UNICODE_EXCEPTIONS, function (c) {
                return '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
            });

            // Test for validity
            if (_INVALID.test(s.replace(_ESCAPES,'@').
                                replace(_VALUES,']').
                                replace(_BRACKETS,''))) {

                // Eval the text into a JavaScript data structure, apply any
                // reviver function, and return
                return _revive( eval('(' + s + ')'), reviver );
            }
        }

        // The text is not JSON parsable
        throw new SyntaxError('decodeJSON');
    };


}, '0.0.1' );


AP.add("json-encode", function(A) {

/**
 * Provides A.JSON.encode method for converting objects to JSON strings.
 * @module json
 * @submodule json-encode
 * @for JSON
 * @static
 */
A.JSON = A.JSON || {};

var isA = A.Lang.isArray,
     _IS_BROWSER_SUPPORT_NATIVE = typeof JSON !== 'undefined';




A.OOP.mix(A.JSON,{
    /**
     * Regex used to capture characters that need escaping before enclosing
     * their containing string in quotes.
     * @property _SPECIAL_CHARS
     * @type {RegExp}
     * @private
     */
    _SPECIAL_CHARS : /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

    /**
     * Character substitution map for common escapes and special characters.
     * @property _CHARS
     * @type {Object}
     * @static
     * @private
     */
    _CHARS : {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },

    /**
     * Serializes a Date instance as a UTC date string.  Used internally by
     * encode.  Override this method if you need Dates serialized in a
     * different format.
     * @method dateToString
     * @param d {Date} The Date to serialize
     * @return {String} stringified Date in UTC format YYYY-MM-DDTHH:mm:SSZ
     * @static
     */
    dateToString : function (d) {
        function _zeroPad(v) {
            return v < 10 ? '0' + v : v;
        }

        return '"' + d.getUTCFullYear()   + '-' +
            _zeroPad(d.getUTCMonth() + 1) + '-' +
            _zeroPad(d.getUTCDate())      + 'T' +
            _zeroPad(d.getUTCHours())     + ':' +
            _zeroPad(d.getUTCMinutes())   + ':' +
            _zeroPad(d.getUTCSeconds())   + 'Z"';
    },

    /**
     * Converts an arbitrary value to a JSON string representation.
     * Cyclical object or array references are replaced with null.
     * If a whitelist is provided, only matching object keys will be included.
     * If a depth limit is provided, objects and arrays at that depth will
     * be stringified as empty.
     * @method encode
     * @param o {MIXED} any arbitrary object to convert to JSON string
     * @param w {Array|Function} (optional) whitelist of acceptable object
     *                  keys to include, or a replacer function to modify the
     *                  raw value before serialization
     * @param d {number} (optional) depth limit to recurse objects/arrays
     *                   (practical minimum 1)
     * @return {String} JSON string representation of the input
     * @static
     * @public
     */
    encode : (_IS_BROWSER_SUPPORT_NATIVE) ? JSON.stringify : function (o,w,d) {

        var m      = A.JSON._CHARS,
            str_re = A.JSON._SPECIAL_CHARS,
            rep    = typeof w === 'function' ? w : null,
            pstack = []; // Processing stack used for cyclical ref protection

        if (rep || typeof w !== 'object') {
            w = undefined;
        }

        // escape encode special characters
        var _char = function (c) {
            if (!m[c]) {
                m[c]='\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
            }
            return m[c];
        };

        // Enclose the escaped string in double quotes
        var _string = function (s) {
            return '"' + s.replace(str_re, _char) + '"';
        };

        // Use the configured date conversion
        var _date = A.JSON.dateToString;

        // Worker function.  Fork behavior on data type and recurse objects and
        // arrays per the configured depth.
        var _encode = function (h,key,d) {
            var o = typeof rep === 'function' ? rep.call(h,key,h[key]) : h[key],
                t = typeof o,
                i,len,j, // array iteration
                k,v,     // object iteration
                a;       // composition array for performance over string concat

            // String
            if (t === 'string') {
                return _string(o);
            }

            // native boolean and Boolean instance
            if (t === 'boolean' || o instanceof Boolean) {
                return String(o);
            }

            // native number and Number instance
            if (t === 'number' || o instanceof Number) {
                return isFinite(o) ? String(o) : 'null';
            }

            // Date
            if (o instanceof Date) {
                return _date(o);
            }

            // Object types
            if (t === 'object') {
                if (!o) {
                    return 'null';
                }

                // Check for cyclical references
                for (i = pstack.length - 1; i >= 0; --i) {
                    if (pstack[i] === o) {
                        return 'null';
                    }
                }

                // Add the object to the processing stack
                pstack[pstack.length] = o;

                a = [];

                // Only recurse if we're above depth config
                if (d > 0) {
                    // Array
                    if (isA(o)) {
                        for (i = o.length - 1; i >= 0; --i) {
                            a[i] = _encode(o,i,d-1) || 'null';
                        }

                    // Object
                    } else {
                        // If whitelist provided, take only those keys
                        k = isA(w) ? w : A.Object.keys(w||o);

                        for (i = 0, j = 0, len = k.length; i < len; ++i) {
                            if (typeof k[i] === 'string') {
                                v = _encode(o,k[i],d-1);
                                if (v) {
                                    a[j++] = _string(k[i]) + ':' + v;
                                }
                            }
                        }
                    }
                }

                // remove the array from the stack
                pstack.pop();

                return isA(o) ? '['+a.join(',')+']' : '{'+a.join(',')+'}';
            }

            return undefined; // invalid input
        };

        // Default depth to POSITIVE_INFINITY
        d = d >= 0 ? d : 1/0;

        // process the input
        return _encode({'':o},'',d);
    }
});


}, '0.0.1', [
    { name : 'oop', minVersion : '0.0.1' } // TODO: review
]);
