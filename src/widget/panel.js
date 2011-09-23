AP.add('widget.panel', function (A) {

    var PANEL_CSS_CLASS = 'panel',
        DEFAULT_PANEL_TEMPLATE = {
            name : 'container:panel',
            body : '<div class="%{cssClass}" id="%{title}:%{uniqueId}">%{content}</div>'
        },
        DEFAULT_HIDDEN_CLASS = 'hidden'; // todo: move somewhere else


    A.Widget.Panel = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_PANEL_TEMPLATE;
            this.base(o);
            this.type = 'container:panel';
            this.supplyDataForTemplatesWithValues({
                cssClass : ((o.cssClass) ? o.cssClass : PANEL_CSS_CLASS)
            });

            if (o.humanizedTitle) { this.dataForTemplate[0].humanizedTitle = o.humanizedTitle; }
        },
        className : 'panel',
        show : function (animate) {
            var d = this.DOM;
            d.removeClass(DEFAULT_HIDDEN_CLASS);
            
            if (animate) {
                d.show(100);
            } else {
                d.show();
            }
        },
        hide : function (animate) {
            var d = this.DOM;
            d.removeClass(DEFAULT_HIDDEN_CLASS);
            
            if (animate) {
                d.hide(100);
            } else {
                d.hide();
            }
        }
    });

}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'widget.container', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' },
    { name : 'widget', minVersion : '0.0.1' }
]);
