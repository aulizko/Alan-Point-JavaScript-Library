AP.add('widget-tabPanel', function (A) {
    
    A.Widget.TabPanel = A.Widget.Container.extend({
        init : function (o) {
            this.base(o);
            this.panel = o.panel;
            this.trigger = o.trigger;
        },
        hide : function (animate) {
            // @TODO: implement
        }, 
        show : function (animate) {
            // @TODO: implement
        }
    });

}, '0.0.1', [
    { name : 'widget-container', minVersion : '0.0.1' },
    { name : 'widget', minVersion : '0.0.1' }
]);
