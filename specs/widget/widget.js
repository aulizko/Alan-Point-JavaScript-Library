(function () {
    var Panel = AP.Widget.extend({
        init : function (backgroundColor) {
            this.base();
            this.backgroundColor = backgroundColor;
        },
        className : 'panel'
    });
    
    describe('widget', {
        'should exists in the AP namespace' : function () {
            value_of(!!AP.Widget).should_be_true();
            value_of(typeof AP.Widget).should_be('function');
        },
        
        'should be instance of class' : function () {
            var p = new Panel('#ccc');
            value_of(p instanceof AP.Widget).should_be_true();
            value_of(p instanceof AP.Class).should_be_true();
        },
        
        'should return className as a result of toString method' : function () {
            var p = new Panel('#ccc');
            value_of(p).should_be('panel');
        },
        
        'should add plugin to the plugins hash when called plug method' : function () {
            var Plugin = {
                name : 'table',
                version : '0.0.1',
                init : function (o) {
                    this.createTable = function () { return 'table created!'; };
                }
            };
            var p = new Panel('#ccc');
            p.plug(Plugin);
            value_of(!!p.createTable).should_be_true();
            value_of(typeof p.createTable).should_be('function');
        },
        
        'should have abstract render method' : function () {
            var p = new Panel('#ccc');
            value_of(p.rendered).should_be_false();
            p.render();
            value_of(p.rendered).should_be_true();
        }
    });
})();