(function () {
    var Panel = new AP.Class({
        className : 'panel',
        inherit : AP.Widget,
        attributes : {
            backgroundColor : {
                value : 'white'
            }
        },
        initialize : function (o) {
            this.conf.backgroundColor = o.backgroundColor;
        },
        host : function (o) {
            this.hostedObject.push(o);
        }
    }),
    L = AP.Lang;
    
    describe('widget', {
        'should exists in the AP namespace' : function () {
            value_of(!!AP.Widget).should_be_true();
            value_of(typeof AP.Widget).should_be('function');
        },
        
        // attributes
        
        'should have height and width attributes' : function () {
            var panel = new Panel({
                backgroundColor : 'white'
            });
            value_of(!!panel.setHeight).should_be_true();
            value_of(!!panel.setWidth).should_be_true();
        },
        
        'should have visible attribute' : function () {
            var panel = new Panel();
            value_of(L.isValue(panel.visible)).should_be_true();
        },
        
        // methods
        
        'should have render method' : function () {
            var panel = new Panel();
            value_of(!!panel.render).should_be_true();
            value_of(L.isFunction(panel.render)).should_be_true();
        },
        
        'should have plug method as Plugin Hoster' : function () {
            var panel = new Panel();
            value_of(!!panel.plug).should_be_true();
            value_of(L.isFunction(panel.plug)).should_be_true();
        }
    });
})();