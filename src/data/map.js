AP.add('map', function (A) {

    var data = A.namespace('data'), O = A.Object, L = A.Lang, R = A.Reflection;

    /**
     * Java HashMap implementation for JavaScript. 
     * I tried to preserve Java Map API.
     * @class Map 
     * @module data
     */ 
    data.Map = function () {
        return function () {

            var silo = R.deepCopy(arguments[0]) || {};

            function length () {
                return O.keys(silo).length;
            };

            return {
                /**
                 * Add value to the hash, apply provided key as key to that value. If key is already binded, than silo should rewrite value
                 * @method add
                 * @param key {String} name of the added paramether
                 * @param value {Mixed} actual value which will be added to the silo
                 */
                add : function (key, value) {
                    if (L.isValue(key)) {
                        silo[key] = value;
                    }
                    this.length++;
                    return this;
                },

                /**
                 * Remove value located by provided key. If value exists, than returns old value, otherwise returns null
                 * @method remove
                 * @param key {String} name of the key
                 * @return {Mixed} deleted value (if any, or null)
                 */
                remove : function (key) {
                    if (L.isValue(key)) {
                        var value = silo[key];
                        silo[key] = null;
                        delete silo[key];
                        this.length--;
                        if (L.isValue(value)) return value;
                    }
                    return null;
                },
                /**
                 * Return true if silo is empty, otherwise, return false
                 * @method isEmpty
                 * @return {Boolean} is silo empty or not
                 */
                isEmpty : function () {
                    return this.length === 0;
                },
                /**
                 * Clear silo, strip all keys and values
                 * @method empty
                 */
                empty : function () {
                    silo = {};
                    this.length = 0;
                },

                /**
                 * Clear all keys which values is null or undefined
                 * @method clean
                 */
                clean : function () {
                    silo = O.clean(silo);
                    this.length = length();
                },

                /**
                 * Return value binded by provided key
                 * @method get
                 * @param key {String} key which you want to receive
                 * @return {Mixed} value which you asked of or null if there is no value at provided key
                 */
                get : function (key) {
                    if (L.isValue(key) && L.isValue(silo[key])) return silo[key];
                    return null;
                },

                /**
                 * Set new value to existing key
                 * @method set
                 * @param key {String} key of the value which you want to update
                 * @param value {Mixed} value you want to assign
                 * @return {Mixed} old value
                 */
                set : function (key, value) {
                    var dump = (silo[key]) ? silo[key] : null;
                    silo[key] = value;
                    return dump;
                },

                /**
                 * Return array which contains list of keys
                 * @method keys
                 * @return {Array} list of keys
                 */
                keys : function () {
                    return O.keys(silo);
                },
                /**
                 * Pretty nice string value of the list
                 * @method toString
                 * @return {String} pretty output
                 */
                toString : function () {
                    return A.JSON.encode(silo);
                },

                length : length(),

                /**
                 * This method used to dump values into json object and all that
                 * @method valueOf
                 * @return {Object} Hash with list keys as keys and values as values
                 */
                valueOf : function () {
                    return silo.valueOf();
                },
                /**
                 * Compare list with another one list. If the keys and appropriate values are equal, then, returns true.
                 * Otherwise - false. Used AP~Lang~compare method
                 * @method equal
                 * @param that {Map} list to compare with
                 * @return {Boolean} true if lists are equal and false otherwise
                 */
                equal : function (that) {
                    return L.compare(silo, that.valueOf());
                },

                /**
                 * Call passed function on the each value. Pass value and key into that function.
                 * @method each
                 * @param fn {Function} function to call. Map should pass value, key and whole inner silo into it
                 * @param context {Mixed} context from which this function will be called
                 */
                each : function (fn, context) {
                    O.each(silo, fn, context);
                }
            };

        }(arguments[0]);;
    };
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'json', minVersion : '0.0.1' },
    { name : 'reflection', minVersion : '0.0.1' } 
]);
