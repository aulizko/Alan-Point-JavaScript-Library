AP.add('interface.options', function (A) {

    var I = A.namespace('Interface'),
        L = A.Lang,
        O = A.Object;

    I.Options = {
        setOptions : function (options) {
            var used = [];
            function overrideDefault(st, input) {
                var result = {};
                O.each(input, function (value, key) {
                    if (L.isValue(value)) {


                        if (L.isObject(value) && !value.nodeType && !('jquery' in value) && !L.isFunction(value)) { // todo: remove jQuery-related hack
                            result[key] = overrideDefault(st[key], value);
                        } else {
                            result[key] = value;
                        }
                        used[key] = true;
                    }
                }, this);

                O.each(st, function (value, key) {
                    if (!used[key]) {
                        result[key] = value;
                    }
                }, this);

                delete used;

                return result;
            };
            this.options = overrideDefault(this.options, options);
        }
    };

}, '0.0.1', [
    { name : 'lang', minVersion: '0.0.3' },
    { name : 'object', minVersion: '0.0.1' }
]);