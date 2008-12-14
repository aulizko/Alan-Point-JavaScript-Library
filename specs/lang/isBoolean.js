(function () {
    var isBoolean = AP.Lang.isBoolean;
    describe('isBoolean', {
        'should return false if passed value is NaN' : function () {
            value_of(isBoolean((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isBoolean(abracadabra)).should_be_false();
            value_of(isBoolean(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isBoolean(null)).should_be_false();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isBoolean(new Date())).should_be_false();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isBoolean(new Number(0))).should_be_false();

        },

        'should return false if passed value is number primitive' : function () {
            value_of(isBoolean(1)).should_be_false();
        },
        
        'should return true if passed value is boolean primitive' : function () {
            value_of(isBoolean(true)).should_be_true();
            value_of(isBoolean(false)).should_be_true();
        },
        
        'should return true if passed value is Boolean Object' : function () {
            value_of(isBoolean(new Boolean(true))).should_be_true();
            value_of(isBoolean(new Boolean(false))).should_be_true();
        },

        'should return false if passed value is String object' : function () {
            value_of(isBoolean(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isBoolean('abracadabra')).should_be_false();
            value_of(isBoolean('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isBoolean(function () {})).should_be_false();
            value_of(isBoolean(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isBoolean({})).should_be_false();
            value_of(isBoolean({ name : 'Joe' })).should_be_false();
            value_of(isBoolean(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isBoolean([])).should_be_false();
            value_of(isBoolean([1,2,3])).should_be_false();
            value_of(isBoolean(new Array())).should_be_false();
            value_of(isBoolean(new Array(1,2,3))).should_be_false();
        }
    });
})();