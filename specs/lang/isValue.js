(function () {
    var isValue = AP.Lang.isValue;
    describe('isValue', {
        'should return false if passed value is NaN' : function () {
            value_of(isValue((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isValue(abracadabra)).should_be_false();
            value_of(isValue(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isValue(null)).should_be_false();
        },

        'should return true if passed value is Date Object' : function () {
            value_of(isValue(new Date())).should_be_true();
        },

        'should return true if passed value is Number object' : function () {
            value_of(isValue(new Number(0))).should_be_true();
        },
        
        'should return true if 0 passed' : function () {
            value_of(isValue(0)).should_be_true();
        },

        'should return true if passed value is number primitive' : function () {
            value_of(isValue(1)).should_be_true();
        },
        
        'should return true if passed value is boolean primitive' : function () {
            value_of(isValue(true)).should_be_true();
        },
        
        'should return true if passed false' : function () {
            value_of(isValue(false)).should_be_true();
        },
        
        'should return true if passed value is Boolean Object' : function () {
            value_of(isValue(new Boolean(true))).should_be_true();
            value_of(isValue(new Boolean(false))).should_be_true();
        },

        'should return true if passed value is String object' : function () {
            value_of(isValue(new String('abracadabra'))).should_be_true();
        },

        'should return true if passed value is string primitive' : function () {
            value_of(isValue('abracadabra')).should_be_true();
        },
        
        'should return true if passed value is empty string' : function () {
            value_of(isValue('')).should_be_true();
        },

        'should return true if passed value is Function Object' : function () {
            value_of(isValue(function () {})).should_be_true();
            value_of(isValue(new Function('a', 'return true;'))).should_be_true();
        },

        'should return true if passed value is Object' : function () {
            value_of(isValue({})).should_be_true();
            value_of(isValue({ name : 'Joe' })).should_be_true();
            value_of(isValue(new Object())).should_be_true();
        },

        'should return true if passed value is Array' : function () {
            value_of(isValue([])).should_be_true();
            value_of(isValue([1,2,3])).should_be_true();
            value_of(isValue(new Array())).should_be_true();
            value_of(isValue(new Array(1,2,3))).should_be_true();
        }
    });
})();