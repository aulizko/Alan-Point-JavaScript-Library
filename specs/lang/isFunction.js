(function () {
    (function () {
        var isFunction = AP.Lang.isFunction;
        describe('isFunction', {
            'should return false if passed value is NaN' : function () {
                value_of(isFunction((new Number('abracadabra')).valueOf())).should_be_false();
            },
            
            'should return false if passed value is undefined' : function () {
                var abracadabra;
                value_of(isFunction(abracadabra)).should_be_false();
                value_of(isFunction(undefined)).should_be_false();
            },

            'should return false if passed value is null' : function () {
                value_of(isFunction(null)).should_be_false();
            },

            'should return false if passed value is Date Object' : function () {
                value_of(isFunction(new Date())).should_be_false();
            },

            'should return false if passed value is Number object' : function () {
                value_of(isFunction(new Number(0))).should_be_false();

            },

            'should return false if passed value is number primitive' : function () {
                value_of(isFunction(1)).should_be_false();
            },

            'should return false if passed value is boolean primitive' : function () {
                value_of(isFunction(true)).should_be_false();
                value_of(isFunction(false)).should_be_false();
            },

            'should return false if passed value is Boolean Object' : function () {
                value_of(isFunction(new Boolean(true))).should_be_false();
                value_of(isFunction(new Boolean(false))).should_be_false();
            },

            'should return false if passed value is String object' : function () {
                value_of(isFunction(new String('abracadabra'))).should_be_false();
            },

            'should return false if passed value is string primitive' : function () {
                value_of(isFunction('abracadabra')).should_be_false();
                value_of(isFunction('')).should_be_false();
            },

            'should return true if passed value is Function Object' : function () {
                value_of(isFunction(function () {})).should_be_true();
                value_of(isFunction(new Function('a', 'return true;'))).should_be_true();
            },

            'should return false if passed value is Object' : function () {
                value_of(isFunction({})).should_be_false();
                value_of(isFunction({ name : 'Joe' })).should_be_false();
                value_of(isFunction(new Object())).should_be_false();
            },

            'should return false if passed value is Array' : function () {
                value_of(isFunction([])).should_be_false();
                value_of(isFunction([1,2,3])).should_be_false();
                value_of(isFunction(new Array())).should_be_false();
                value_of(isFunction(new Array(1,2,3))).should_be_false();
            }
        });
    })();
})();