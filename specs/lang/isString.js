(function () {
    var isString = AP.Lang.isString;
    describe('isString', {
        'should return false if passed value is NaN' : function () {
            value_of(isString((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isString(abracadabra)).should_be_false();
            value_of(isString(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isString(null)).should_be_false();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isString(new Date())).should_be_false();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isString(new Number(0))).should_be_false();
        },

        'should return false if passed value is number primitive' : function () {
            value_of(isString(1)).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isString(true)).should_be_false();
            value_of(isString(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isString(new Boolean(true))).should_be_false();
            value_of(isString(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isString(new String('abracadabra'))).should_be_false();
        },

        'should return true if passed value is string primitive' : function () {
            value_of(isString('abracadabra')).should_be_true();
            value_of(isString('')).should_be_true();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isString(function () {})).should_be_false();
            value_of(isString(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isString({})).should_be_false();
            value_of(isString({ name : 'Joe' })).should_be_false();
            value_of(isString(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isString([])).should_be_false();
            value_of(isString([1,2,3])).should_be_false();
            value_of(isString(new Array())).should_be_false();
            value_of(isString(new Array(1,2,3))).should_be_false();
        }
    });
})();