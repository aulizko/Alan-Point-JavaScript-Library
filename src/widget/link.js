AP.add('widget-link', function (A) {
    var DEFAULT_LINK_WITH_IMAGE_TEMPLATE = {
        name : 'component:linkWithImageTemplate',
        body : '<div class="%{containerCssClass}" id="%{title}:%{uniqueId}">\
    				<div class="%{cssClass}"></div><a href="#">%{humanizedTitle}</a>\
    			</div>'
        },
        DEFAULT_CONTAINER_CSS_CLASS = 'settingsPanelLinkWithImage',
        DEFAULT_HUMANIZED_TITLE = 'click me',
        DEFAULT_HIDDEN_CSS_CLASS = 'hidden',
        DEFAULT_TYPE = 'component:linkWithIcon',
        OOP = A.OOP;
        
        
    A.Widget.LinkWithIcon = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_LINK_WITH_IMAGE_TEMPLATE;
            this.base(o);
            
            this.containerCssClass = o.containerCssClass || DEFAULT_CONTAINER_CSS_CLASS;
            this.humanizedTitle = o.humanizedTitle || DEFAULT_HUMANIZED_TITLE;
            
            if (o.hidden) {
                var cssClasses = this.containerCssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CSS_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CSS_CLASS; }, this)) {
                        
                    cssClasses.push(DEFAULT_HIDDEN_CSS_CLASS);
                    this.containerCssClass = cssClasses.join(' ');
                }
                this.visible = false;
            } else {
                this.visible = true;
            }
            
            this.dataForTemplate = [OOP.mix(this.dataForTemplate[0], {
                humanizedTitle : this.humanizedTitle,
                containerCssClass : this.containerCssClass
            })];
            
            this.type = (o.type) ? o.type : DEFAULT_TYPE;
        },
        initializeLogic : function () {
            this.base();
            var d = this.DOM;
            
            link = d.find('a'), self = this;
            
            link.click(function (e) {
                self.publish(this.title + '.activate');
                e.stopPropagation();
                return false;
            });
        },
        hide : function () {
            this.DOM.hide();
            this.visible = false;
        },
        show : function () {
            this.DOM.show();
            this.visible = true;
        },
        className : 'linkWithIcon'
    });
    
}, '0.0.1', [
    { name : 'widget-component', minVersion : '0.0.1' }
]);