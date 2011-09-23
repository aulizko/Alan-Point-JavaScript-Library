(function () {
    var Component = AP.Class.extend({
        init : function (o) {
            this.height = o.height;
            this.width = o.width;
            AP.stamp(this);
            this._subscribers = {};
        },

        mixins : AP.util.Event.Observable,

        className : 'component'
    }), o = {
        height : 189,
        width : 13
    }; 

    describe('observable', {
        /* misc and general */
        'should exist at the util.Event namespace' : function () {
            value_of(!!AP.util.Event.Observable).should_be_true();
            value_of(typeof AP.util.Event.Observable).should_be('object');
        },


        /* operation as mixin */
        'should allow us mixin at into the classes' : function () {
            var c = new Component(o);

            value_of(!!c.subscribe).should_be_true();
            value_of(!!c.publish).should_be_true();
            value_of(!!c._subscribers).should_be_true();
        },

        /* subscribing listeners */
        'should allow subscribing as event listeners' : function () {
            var c = new Component(o);
            var trigger = false;
            
            c.subscribe('customEvent', function () {
                trigger = true;
            }, this);

            c.publish('customEvent');

            value_of(trigger).should_be_true();
        },

        /* publish */
        'should invocate every listener' : function () {
            var c = new Component(o),

            a = function () {
                dump *= 2;
            },
            b = function () {
                dump *= 3;
            },
            d = function (e) {
                dump *= 5;
            },

            dump = 1;


            c.subscribe('customEvent', [a,b,d], this);

            c.publish('customEvent');
            
            value_of(dump).should_be(30);
        },

        /* unsubscribe */
        'should erase function from event listeners' : function () {
            var c = new Component(o),
            trigger = 1,
            a = function () {
                trigger = 2;
            };

            c.subscribe('customEvent', a);

            c.unsubscribe('customEvent', a);
            
            c.publish('customEvent');
            
            value_of(trigger).should_be(1);
        }
    });    
})();
