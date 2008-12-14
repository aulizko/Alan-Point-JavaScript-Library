(function () {
    var isNumber = AP.Lang.isNumber;
    describe('isNumber', {
        'should return false if passed value is NaN' : function () {
            value_of(isNumber((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isNumber(abracadabra)).should_be_false();
            value_of(isNumber(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isNumber(null)).should_be_false();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isNumber(new Date())).should_be_false();
        },

        'should return true if passed value is Number object' : function () {
            value_of(isNumber(new Number(0))).should_be_true();
        },

        'should return true if passed value is number primitive' : function () {
            value_of(isNumber(1)).should_be_true();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isNumber(true)).should_be_false();
            value_of(isNumber(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isNumber(new Boolean(true))).should_be_false();
            value_of(isNumber(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isNumber(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isNumber('abracadabra')).should_be_false();
            value_of(isNumber('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isNumber(function () {})).should_be_false();
            value_of(isNumber(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isNumber({})).should_be_false();
            value_of(isNumber({ name : 'Joe' })).should_be_false();
            value_of(isNumber(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isNumber([])).should_be_false();
            value_of(isNumber([1,2,3])).should_be_false();
            value_of(isNumber(new Array())).should_be_false();
            value_of(isNumber(new Array(1,2,3))).should_be_false();
        }
    });
})();