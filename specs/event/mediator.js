(function () {
    
    describe('mediator', {
        'should exist at the util namespace' : function () {
            value_of(!!AP.util.Mediator()).should_be_true();
            value_of(typeof AP.util.Mediator()).should_be('object');
        },

        'should exists on the global AP namespace' : function () {
            value_of(!!AP.Mediator()).should_be_true();
        },

        'should exist as singleton' : function () {
            var a = AP.Mediator(), b = AP.Mediator();
            value_of(a === b).should_be_true();
            value_of(a === AP.Mediator()).should_be_true();
        },

        /* register as publisher */

        'should allow register as publisher' : function () {},

        'should allow subscribe on the topic' : function () {},

        'should a' : function () {}
    });    
})();
