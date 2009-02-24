(function () {
    var PH = new AP.Class({
        className : 'PH',
        mixins : [
            AP.PluginHoster
        ]
    }), L = AP.Lang;
    
    describe('pluginHoster', {
        'should exist at the AP namespace' : function () {
            value_of(!!AP.PluginHost).should_be_true();
            value_of(typeof AP.PluginHost).should_be('function');
        },

        // attributes

        'should have plugins property' : function () {
            var pluginHoster = new PH();
            console.log(pluginHoster);
            value_of(L.isValue(pluginHoster.plugins)).should_be_true();
            value_of(L.isArray(pluginHoster.plugins)).should_be_true();
        }
    });
})();