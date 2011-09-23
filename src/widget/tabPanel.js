AP.add('widget.tabPanel', function (A) {
    var DEFAULT_PANEL_TITLE = 'defaultPanel',
        DEFAULT_TRIGGER_TITLE = 'defaultTrigger';
    
    A.Widget.TabPanel = A.Widget.Container.extend({
        init : function (o) {
            this.base(o);
            this.panel = o.panel || new A.Widget.Panel({ title : DEFAULT_PANEL_TITLE });
            this.trigger = o.trigger || new A.Widget.ToolbarButton({
                title : DEFAULT_TRIGGER_TITLE
            });
        },
        className : 'tabPanel'
    });

}, '0.0.1', [
    { name : 'widget.container', minVersion : '0.0.1' },
    { name : 'widget', minVersion : '0.0.1' }
]);
