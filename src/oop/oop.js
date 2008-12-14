describe('oop', {
    'should exist in the AP namespace' : function () {
        value_of(!!AP.OOP).should_be_true();
    },
    
    'should have mix method' : function () {
        value_of(!!AP.OOP.mix).should_be_true();
        value_of(typeof AP.OOP.mix).should_be('function');
    }
});