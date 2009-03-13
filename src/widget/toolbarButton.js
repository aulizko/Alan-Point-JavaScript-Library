AP.add('widget-toolbarButton', function (A) {
    var $ = A.Query,
        T = A.TemplateEngine,
        TOOLBAR_COMPONENT_CSS_CLASS = 'toolbarItem',
        DEFAULT_TYPE_PREFIX = 'component',
        DEFAULT_TOOLBAR_BUTTON_TEMPLATE = { 
            name : 'component:toolbarButton',
            body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelIcon %{title}Icon"></div></div>'
        },
        OOP = A.OOP,
        L = A.Lang;

    A.Widget.ToolbarButton = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_TOOLBAR_BUTTON_TEMPLATE;
            this.base(OOP.mix(o, {
                type : DEFAULT_TYPE_PREFIX + ':toolbarButton',
                cssClass : ((o.cssClass) ? o.cssClass : TOOLBAR_COMPONENT_CSS_CLASS)
            })); 
        },
        active : false,
        handlers : {
            click : function () {
                if (!this.active) {
                    this.publish(this.title + '.activate');
                } else {
                    this.publish(this.title + '.deactivate');
                }
            }
        },
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
        }
    });

}, '0.0.1', [{ name : 'widget-component', minVersion : '0.0.1' }]);
