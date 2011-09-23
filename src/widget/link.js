AP.add('widget.link', function (A) {
    var DEFAULT_LINK_WITH_IMAGE_TEMPLATE = {
        name : 'component:linkWithImageTemplate',
        body : '<div class="%{containerCssClass} %{cssClass}" id="%{title}:%{uniqueId}">\
                    <div class="%{iconCssClass}"></div><a href="#">%{humanizedTitle}</a>\
                </div>'
        },
        DEFAULT_CONTAINER_CSS_CLASS = 'panelLinkWithImage',
        DEFAULT_HUMANIZED_TITLE = 'click me',
        DEFAULT_HIDDEN_CSS_CLASS = 'hidden',
        DEFAULT_TYPE = 'component:linkWithIcon',
        DEFAULT_ICON_CSS_CLASS = '',
        Ar = A.Array;


    A.Widget.LinkWithIcon = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_LINK_WITH_IMAGE_TEMPLATE;
            this.iconCssClass = o.iconCssClass || DEFAULT_ICON_CSS_CLASS;

            this.base(o);

            this.containerCssClass = o.containerCssClass || DEFAULT_CONTAINER_CSS_CLASS;
            this.humanizedTitle = o.humanizedTitle || DEFAULT_HUMANIZED_TITLE;

            if (o.hidden) {
                var cssClasses = this.cssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CSS_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CSS_CLASS; }, this)) {

                    cssClasses.push(DEFAULT_HIDDEN_CSS_CLASS);
                    this.cssClass = cssClasses.join(' ');
                }
                this.visible = false;
            } else {
                this.visible = true;
            }

            this.supplyDataForTemplatesWithValues({
                humanizedTitle : this.humanizedTitle,
                containerCssClass : this.containerCssClass,
                iconCssClass: this.iconCssClass
            });

            this.type = (o.type) ? o.type : DEFAULT_TYPE;
            
            this.handlers = {
                click : function (ev) {
                    if (AP.Query(ev.target).is('a')) {
                        this.publish('activate');
                    }

                    ev.stopPropagation();
                    ev.preventDefault();

                    return false;
                }.bind(this)
            };
        },

        hide : function () {
            this.DOM.hide();
            this.visible = false;
        },
        show : function () {
            this.DOM.removeClass(DEFAULT_HIDDEN_CSS_CLASS);
            this.DOM.show();
            this.visible = true;
        },
        className : 'linkWithIcon'
    });
    
}, '0.0.1', [
    { name : 'widget.component', minVersion : '0.0.1' }
]);