(function () {
    var isDate = AP.Lang.isDate;
    describe('isDate', {
        'should return false if passed value is NaN' : function () {
            value_of(isDate((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isDate(abracadabra)).should_be_false();
            value_of(isDate(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isDate(null)).should_be_false();
        },

        'should return true if passed value is Date Object' : function () {
            value_of(isDate(new Date())).should_be_true();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isDate(new Number(0))).should_be_false();

        },

        'should return false if passed value is number primitive' : function () {
            value_of(isDate(1)).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isDate(true)).should_be_false();
            value_of(isDate(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isDate(new Boolean(true))).should_be_false();
            value_of(isDate(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isDate(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isDate('abracadabra')).should_be_false();
            value_of(isDate('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isDate(function () {})).should_be_false();
            value_of(isDate(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isDate({})).should_be_false();
            value_of(isDate({ name : 'Joe' })).should_be_false();
            value_of(isDate(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isDate([])).should_be_false();
            value_of(isDate([1,2,3])).should_be_false();
            value_of(isDate(new Array())).should_be_false();
            value_of(isDate(new Array(1,2,3))).should_be_false();
        }
    });
})();