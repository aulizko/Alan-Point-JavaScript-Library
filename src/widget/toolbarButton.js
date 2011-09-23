AP.add('widget.toolbarButton', function (A) {
    var TOOLBAR_COMPONENT_CSS_CLASS = 'toolbarItem',
        DEFAULT_TYPE_PREFIX = 'component',
        DEFAULT_TOOLBAR_BUTTON_TEMPLATE = { 
            name : 'component:toolbarButton',
            body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelIcon %{title}Icon"></div></div>'
        },
        DEFAULT_CSS_PRESSED = 'activeButton';

    A.Widget.ToolbarButton = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_TOOLBAR_BUTTON_TEMPLATE;
            this.css = {
                pressed : (o.css) ? ((o.css.pressed) ? o.css.pressed : DEFAULT_CSS_PRESSED) : DEFAULT_CSS_PRESSED
            };
            
            o.handlers = A.extend({
                click : function () {
                    if (!this.pressed) {
                        this.press();
                        this.publish('activate');
                    } else {
                        this.release();
                        this.publish('deactivate');
                    }
                }.bind(this)
            }, (o.handlers) ? o.handlers : {});
            
            this.base(A.extend({
                type : ((o.type) ? (DEFAULT_TYPE_PREFIX + ':' + o.type) : (DEFAULT_TYPE_PREFIX + ':toolbarButton')),
                cssClass : ((o.cssClass) ? o.cssClass : TOOLBAR_COMPONENT_CSS_CLASS)
            }, o));

            if (o.humanizedTitle) {
                this.supplyDataForTemplatesWithValues({
                    humanizedTitle : o.humanizedTitle
                });
            }
        },
        setParent : function (parent) {
            this.base(parent);
        },
        representState : function () {
            for (var prop in this.state) {
                if (this.state[prop]) { this.DOM.addClass(prop); }
                else { this.DOM.removeClass(prop); }
            }
        },
        /**
         * Make toolbar button active - set inner variable 'active' to true and change state to 'pressed' (and also call 'represent state method')
         * @method press
         */
        press : function () {
            if (this.DOM) {
                this.DOM.addClass(this.css.pressed);
            }
            this.pressed = true;
            this.active = true;
        },
        /**
         * Make toolbar button inactive - set inner variable 'active' to false and change state to 'pressed' (and also call 'represent state method')
         * @method release
         */
        release : function () {
            if (this.DOM) {
                this.DOM.removeClass(this.css.pressed);
            }
            this.pressed = false;
            this.active = false;
        },
        active : false,
        pressed : false,
        className : 'toolbarButton'
    });

}, '0.0.1', [{ name : 'widget.component', minVersion : '0.0.1' }]);
