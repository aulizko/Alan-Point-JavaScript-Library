AP.add('widget-toolbarButton', function (A) {
    var $ = A.Query,
        T = A.TemplateEngine,
        TOOLBAR_COMPONENT_CSS_CLASS = 'toolbarItem',
        DEFAULT_TYPE_PREFIX = 'component',
        DEFAULT_TOOLBAR_BUTTON_TEMPLATE = { 
            name : 'component:toolbarButton',
            body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelIcon %{title}Icon"></div></div>'
        },
        DEFAULT_CSS_PRESSED = 'activeItem',
        OOP = A.OOP,
        L = A.Lang;

    A.Widget.ToolbarButton = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_TOOLBAR_BUTTON_TEMPLATE;
            this.css = {
                pressed : (o.css) ? ((o.css.pressed) ? o.css.pressed : DEFAULT_CSS_PRESSED) : DEFAULT_CSS_PRESSED
            };
            
            // todo: review
            var self = this;
            o.handlers = OOP.mix((o.handlers) ? o.handlers : {}, {
                click : {
                    context : this,
                    fn : function (e, el) {
                        if (!self.pressed) {
                            self.DOM.addClass(self.css.pressed);
                            self.pressed = true;
                        } else {
                            self.DOM.removeClass(self.css.pressed);
                            self.pressed = false;
                        }
                        if (!self.active) {
                            self.publish(self.title + '.activate');
                            self.active = true;
                        } else {
                            self.publish(self.title + '.deactivate');
                            self.active = false;
                        }
                    }
                },
                mouseout : function (e, el) {
                    $(el).removeClass(self.hoverCssClass);
                },
                mouseover : function (e, el) {
                    $(el).addClass(self.hoverCssClass);
                },
                self : this
            });
            
            this.base(OOP.mix(o, {
                type : DEFAULT_TYPE_PREFIX + ':toolbarButton',
                cssClass : ((o.cssClass) ? o.cssClass : TOOLBAR_COMPONENT_CSS_CLASS)
            })); 
        },
        active : false,
        visualState : {
            hover : false,
            visible : true,
            pressed : false
        },
        setParent : function (parent) {
            this.base(parent);
            this.subscribe(this.title + '.activate', parent);
            this.subscribe(this.title + '.deactivate', parent);
        },
        representState : function () {
            for (var prop in this.state) {
                if (this.state[prop]) { this.dom.addClass(prop); }
                else { this.dom.removeClass(prop); }
            }
        },
        /**
         * Make toolbar button active - set inner variable 'active' to true and change state to 'pressed' (and also call 'represent state method')
         * @method makeActive
         * @TODO: consider does we need it at all 
         */
        makeActive : function () {
            this.active = true;
            this.visualState.pressed = true;
            this.representState();
        },
        className : 'toolbarButton'
    });

}, '0.0.1', [{ name : 'widget-component', minVersion : '0.0.1' }]);
