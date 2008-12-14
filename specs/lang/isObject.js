(function () {
    var isObject = AP.Lang.isObject;
    describe('isObject', {
        'should return false if passed value is NaN' : function () {
            value_of(isObject((new Number('abracadabra')).valueOf())).should_be_false();
        },
        
        'should return false if passed value is undefined' : function () {
            var abracadabra;
            value_of(isObject(abracadabra)).should_be_false();
            value_of(isObject(undefined)).should_be_false();
        },

        'should return false if passed value is null' : function () {
            value_of(isObject(null)).should_be_false();
        },

        'should return true if passed value is Date Object' : function () {
            value_of(isObject(new Date())).should_be_true();
        },

        'should return true if passed value is Number object' : function () {
            value_of(isObject(new Number(0))).should_be_true();
        },

        'should return false if passed value is number primitive' : function () {
            value_of(isObject(1)).should_be_false();
        },
        
        'should return false if passed value is boolean primitive' : function () {
            value_of(isObject(true)).should_be_false();
            value_of(isObject(false)).should_be_false();
        },
        
        'should return true if passed value is Boolean Object' : function () {
            value_of(isObject(new Boolean(true))).should_be_true();
            value_of(isObject(new Boolean(false))).should_be_true();
        },

        'should return true if passed value is String object' : function () {
            value_of(isObject(new String('abracadabra'))).should_be_true();
        },

        'should return false if passed value is string primitive' : function () {
            value_of(isObject('abracadabra')).should_be_false();
            value_of(isObject('')).should_be_false();
        },

        'should return true if passed value is Function Object' : function () {
            value_of(isObject(function () {})).should_be_true();
            value_of(isObject(new Function('a', 'return true;'))).should_be_true();
        },

        'should return true if passed value is Object' : function () {
            value_of(isObject({})).should_be_true();
            value_of(isObject({ name : 'Joe' })).should_be_true();
            value_of(isObject(new Object())).should_be_true();
        },

        'should return true if passed value is Array' : function () {
            value_of(isObject([])).should_be_true();
            value_of(isObject([1,2,3])).should_be_true();
            value_of(isObject(new Array())).should_be_true();
            value_of(isObject(new Array(1,2,3))).should_be_true();
        }
    });
})();