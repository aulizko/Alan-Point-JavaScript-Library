AP.add('component', function (A){

    var $ = A.Query,
        T = A.TemplateEngine,
        COMPONENT_CSS_CLASS = 'component',
        TOOLBAR_COMPONENT_CSS_CLASS = 'toolbarItem',
        HOVER_CSS_CLASS = 'hover',
        DEFAULT_TYPE = 'general',
        DEFAULT_TYPE_PREFIX = 'component',
        INPUT_CONTAINER_CSS_CLASS = 'settingsInput', 
        INPUT_COMPONENT_CSS_CLASS = 'settingInput',
        defineTemplateForCorrespondType = { 
            'component:general' : {
                name : 'component:general',
                body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"></div>'
            }, 
            'component:toolbarButton' : {
                name : 'component:toolbarButton',
                body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelIcon %{title}Icon"></div></div>'
            }
        },
        OOP = A.OOP,
        L = A.Lang;

    AP.Widget.Component = AP.Widget.extend({
        init : function (o) {
            this.base(o);
            
            A.stamp(this);
            this.rendered = false;
            this.title = o.title;

            this.cssClass = o.cssClass || COMPONENT_CSS_CLASS;
            this.hoverCssClass = o.hoverCssClass || HOVER_CSS_CLASS;
            
            this.type = o.type || DEFAULT_TYPE_PREFIX + ':' + DEFAULT_TYPE;
            this.template = ((this.template) ? this.template : (o.template || defineTemplateForCorrespondType[this.type]));
            this.dataForTemplate = [{
                title : this.title,
                cssClass : this.cssClass,
                uniqueId : this._uid
            }];

            if (L.isValue(this.parent) && !L.isValue(this.target)) {
                this.parent.registerChild(this);
            }

            // define parent
            var parent = o.parent || A.Layout;
            parent.registerChild(this);

            this.handlers = o.handlers || {};
            A.Layout.registerTemplateForCompilation(this);
        },
        className : 'component',
        render : function () {
            var html = this.generateHTML();
            this.parent.append(html);
            this.initializeDOMReference();
            this.initializeEventListeners();
            this.rendered = true;
            this.publish('component.rendered.' + this.title);
        },
        setParent : function (/* Component */parent) {
            if (L.isValue(this.parent)) { 
                this.parent.removeChild(this); this.unsubscribe('component.rendered' + this.title, parent);
            }
            this.parent = parent;
            this.subscribe('component.rendered' + this.title, parent);
        },

        

        initializeDOMReference : function () {
            this.DOM = $('#' + this.title + this._uid);
        },
        generateHTML : function () {
            return T.processTemplate(this.type, this.dataForTemplate);
        },
        initializeEventListeners : function () {
            var d = this.DOM, h = this.handlers, self = this;
            this.handlers.mouseover = (this.handlers.mouseover) ? this.handlers.mouseover : function (e) {
                $(this).addClass(self.hoverCssClass);
            };
            this.handlers.mouseout = (this.handlers.mouseout) ? this.handlers.mouseout : function (e) {
                $(this).addClass(self.hoverCssClass);
            };
             
            for (var type in h) {
                var handler = h[type];
                if (L.isFunction(handler)) {
                    d.bind(type, handler);
                } else {
                    d.bind(type, handler.data, handler.fn);
                }
            }
        },
        mixins : A.util.Event.Observable
    });

    A.Widget.ToolbarButton = A.Widget.Component.extend({
        init : function (o) {
            var conf = OOP.mix(o, {
                type : DEFAULT_TYPE_PREFIX + ':toolbarButton',
                cssClass : ((o.cssClass) ? o.cssClass : TOOLBAR_COMPONENT_CSS_CLASS)
            }); 
           
            this.base(o); 
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

    A.Widget.Input = A.Widget.Component.extend({
        init : function (o) {
            var conf = OOP.mix(o, {
                type : ((/Input/ig.test(o.type)) ? (o.type) : (o.type + 'Input')),
                cssClass : ((o.cssClass) ? o.cssClass : INPUT_COMPONENT_CSS_CLASS),
                defaultValue : ((o.defaultValue) ? o.defaultValue : ''),
                containerCssClass : ((o.containerCssClass) ? o.containerCssClass : INPUT_CONTAINER_CSS_CLASS)
            });
            this.base(conf);
            this.defaultValue = this.conf.defaultValue;
        },
        handlers : {
            focus : function () {
                // todo: remove validation output
                if (this.DOM.val() === this.defaultValue) {this.DOM.val('');}
            },
            blur : function () {
                // todo: run validation
                if (this.DOM.val() === '') {this.DOM.val(this.defaultValue);}
            }
        }
    });
    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.1' },
    { name : 'string', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1', },
    { name : 'templateEngine', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' } 
]);
