describe('lang', {
    'should exist into AP global namespace' : function () {
        value_of(!!AP.Lang).should_be_true();
        value_of(typeof AP.Lang).should_be('object');
    },
    
    'should have isUndefined method' : function () {
        value_of(!!AP.Lang.isUndefined).should_be_true();
        value_of(typeof AP.Lang.isUndefined).should_be('function');
    },
    
    'should have isNull method' : function () {
        value_of(!!AP.Lang.isNull).should_be_true();
        value_of(typeof AP.Lang.isNull).should_be('function');
    },
    
    'should have isArray method' : function () {
        value_of(!!AP.Lang.isArray).should_be_true();
        value_of(typeof AP.Lang.isArray).should_be('function');
    },
    
    'should have isBoolean method' : function () {
        value_of(!!AP.Lang.isBoolean).should_be_true();
        value_of(typeof AP.Lang.isBoolean).should_be('function');
    },
    
    'should have isFunction method' : function () {
        value_of(!!AP.Lang.isFunction).should_be_true();
        value_of(typeof AP.Lang.isFunction).should_be('function');
    },
    
    'should have isDate method' : function () {
        value_of(!!AP.Lang.isDate).should_be_true();
        value_of(typeof AP.Lang.isDate).should_be('function');
    },
    
    'should have isNumber method' : function () {
        value_of(!!AP.Lang.isNumber).should_be_true();
        value_of(typeof AP.Lang.isNumber).should_be('function');
    },
    
    'should have isObject method' : function () {
        value_of(!!AP.Lang.isObject).should_be_true();
        value_of(typeof AP.Lang.isObject).should_be('function');
    },
    
    'should have isString method' : function () {
        value_of(!!AP.Lang.isString).should_be_true();
        value_of(typeof AP.Lang.isString).should_be('function');
    },
    
    'should have isValue method' : function () {
        value_of(!!AP.Lang.isValue).should_be_true();
        value_of(typeof AP.Lang.isValue).should_be('function');
    }
});