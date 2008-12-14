(function () {
    var isUndefined = AP.Lang.isUndefined;
    describe('isUndefined', {
        'should return false if passed value is NaN' : function () {
            value_of(isUndefined((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return true if passed value is undefined' : function () {
            var abracadabra;
            value_of(isUndefined(abracadabra)).should_be_true();
            value_of(isUndefined(undefined)).should_be_true();
        },

        'should return false if passed value is null' : function () {
            value_of(isUndefined(null)).should_be_false();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isUndefined(new Date())).should_be_false();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isUndefined(new Number(0))).should_be_false();

        },

        'should return false if passed value is number primitive' : function () {
            value_of(isUndefined(1)).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isUndefined(true)).should_be_false();
            value_of(isUndefined(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isUndefined(new Boolean(true))).should_be_false();
            value_of(isUndefined(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isUndefined(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isUndefined('abracadabra')).should_be_false();
            value_of(isUndefined('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isUndefined(function () {})).should_be_false();
            value_of(isUndefined(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isUndefined({})).should_be_false();
            value_of(isUndefined({ name : 'Joe' })).should_be_false();
            value_of(isUndefined(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isUndefined([])).should_be_false();
            value_of(isUndefined([1,2,3])).should_be_false();
            value_of(isUndefined(new Array())).should_be_false();
            value_of(isUndefined(new Array(1,2,3))).should_be_false();
        }
    });
})();