(function () {
    var isNull = AP.Lang.isNull;
    describe('isNull', {
        'should return false if passed value is NaN' : function () {
            value_of(isNull((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isNull(abracadabra)).should_be_false();
            value_of(isNull(undefined)).should_be_false();
        },

        'should return true if passed value is null' : function () {
            value_of(isNull(null)).should_be_true();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isNull(new Date())).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isNull(true)).should_be_false();
            value_of(isNull(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isNull(new Boolean(true))).should_be_false();
            value_of(isNull(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isNull(new Number(0))).should_be_false();

        },

        'should return false if passed value is number primitive' : function () {
            value_of(isNull(1)).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isNull(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isNull('abracadabra')).should_be_false();
            value_of(isNull('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isNull(function () {})).should_be_false();
            value_of(isNull(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isNull({})).should_be_false();
            value_of(isNull({ name : 'Joe' })).should_be_false();
            value_of(isNull(new Object())).should_be_false();
        },

        'should return false if passed value is Array' : function () {
            value_of(isNull([])).should_be_false();
            value_of(isNull([1,2,3])).should_be_false();
            value_of(isNull(new Array())).should_be_false();
            value_of(isNull(new Array(1,2,3))).should_be_false();
        }
    });
})();