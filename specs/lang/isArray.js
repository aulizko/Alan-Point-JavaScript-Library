(function () {
    var isArray = AP.Lang.isArray;
    describe('isArray', {
        'should return false if passed value is NaN' : function () {
            value_of(isArray((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isArray(abracadabra)).should_be_false();
            value_of(isArray(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isArray(null)).should_be_false();
        },

        'should return false if passed value is Date Object' : function () {
            value_of(isArray(new Date())).should_be_false();
        },

        'should return false if passed value is Number object' : function () {
            value_of(isArray(new Number(0))).should_be_false();

        },

        'should return false if passed value is number primitive' : function () {
            value_of(isArray(1)).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isArray(true)).should_be_false();
            value_of(isArray(false)).should_be_false();
        },
        
        'should return false if passed value is Boolean Object' : function () {
            value_of(isArray(new Boolean(true))).should_be_false();
            value_of(isArray(new Boolean(false))).should_be_false();
        },

        'should return false if passed value is String object' : function () {
            value_of(isArray(new String('abracadabra'))).should_be_false();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isArray('abracadabra')).should_be_false();
            value_of(isArray('')).should_be_false();
        },

        'should return false if passed value is Function Object' : function () {
            value_of(isArray(function () {})).should_be_false();
            value_of(isArray(new Function('a', 'return true;'))).should_be_false();
        },

        'should return false if passed value is Object' : function () {
            value_of(isArray({})).should_be_false();
            value_of(isArray({ name : 'Joe' })).should_be_false();
            value_of(isArray(new Object())).should_be_false();
        },

        'should return true if passed value is Array' : function () {
            value_of(isArray([])).should_be_true();
            value_of(isArray([1,2,3])).should_be_true();
            value_of(isArray(new Array())).should_be_true();
            value_of(isArray(new Array(1,2,3))).should_be_true();
        }
    });
})();