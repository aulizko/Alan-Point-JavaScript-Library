AP.add('interface.searchStringBuilder', function (A) {

    var I = A.namespace('Interface'),
        L = A.Lang;

    I.SearchStringBuilder = {
        buildSearchString : function (source, base) {
            return buildQueryStringFromHash (source, base);
        }
    };

    /**
     * Build url query string from hash. It is simplier to show it by example:
     * var a = { name : 'John Doe', address : 'st. Patric, apt. 42' };
     * The idea and implementation inspired by MooTools framework: http://mootools.net/docs/core/Native/Hash#Hash:toQueryString
     * AP.String.buildQueryStringFromHash(a); // produce: "name=John%20Doe&amp;address=st.%20Patric,&apt.%2042
     * @method buildQueryStringFromHash
     * @param source {Object} Hash object to build query from.
     * @static
     * @return {String} url-like query string
     */
    function buildQueryStringFromHash (source, base) {
        var queryString = [];
        AP.Object.each(source, function(value, key){
            if (!L.isUndefined(value)) {
                if (base) key = base + '[' + key + ']';
                var result, qs;
                if (L.isArray(value)) {
                    A.Array.each(value, function (val, index) {
                        qs[index] = val;
                    }, this);

                    result = buildQueryStringFromHash(qs, key);
                } else if (L.isObject(value)) {
                    result = buildQueryStringFromHash(value, key);
                } else {
                    result = key + '=' + encodeURIComponent(value);
                }
                queryString.push(result);
            }
        });

        return queryString.join('&');
    };

}, '0.0.1', [
    { name : 'array', minVersion : '1.0.0' },
    { name : 'object', minVersion : '0.0.1' }
]);