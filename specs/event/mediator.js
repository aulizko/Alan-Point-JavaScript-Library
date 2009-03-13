(function () {
    
    var Publisher = AP.Class.extend({
        init : function () {
            this._subscribers = {};
            AP.stamp(this);
        },

        mixins : AP.util.Event.Observable
    }), 
    L = AP.Lang;


    describe('mediator', {
        'should exist at the util namespace' : function () {
            console.log(AP);
            value_of(!!AP.util.Event.Mediator()).should_be_true();
            value_of(typeof AP.util.Event.Mediator()).should_be('object');
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

        'should allow register as publisher' : function () {
            var m = AP.Mediator(), dump = 1,
                publisher = new Publisher();
            function updateTrigger () {
                dump *= 3;
            };
            function renderView () {
                dump *= 5;
            };
            m.registerEvent('customEvent', publisher);
            m.addEventListener('customEvent', [ updateTrigger, renderView ]);

            publisher.publish('customEvent');
            value_of(dump).should_be(15);
        }
    });    
})();
