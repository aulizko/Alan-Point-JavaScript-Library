describe('oo', {
    'should exist in the AP namespace' : function () {
        value_of(!!AP.OO).should_be_true();
        value_of(typeof AP.OO).should_be('object');
    }
});