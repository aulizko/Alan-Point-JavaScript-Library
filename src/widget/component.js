AP.add('component', function (A) {

    var $ = A.Query,
        T = A.TemplateEngine,
        COMPONENT_TEMPLATE = '<div id="%{title}%{uniqueId}" class="%{cssClass}"></div>',
        COMPONENT_CSS_CLASS = 'component',
        TOOLBAR_COMPONENT_CSS_CLASS = 'toolbarItem',
        HOVER_CSS_CLASS = 'hover',
        DEFAULT_TYPE = 'general',
        INPUT_CONTAINER_CSS_CLASS = 'settingsInput', 
        INPUT_COMPONENT_CSS_CLASS = 'settingInput',
        defineTemplateForCorrespondType = { 
            general : '<div id="%{title}%{uniqueId}" class="%{cssClass}"></div>', 
            toolbarButton : '<div id="${title}%{uniqueId}" class="%{cssClass}"><div class="panelIcon ${title}Icon"></div></div>'
        },
        OOP = A.OOP;

    T.compileTemplate(COMPONENT_TEMPLATE, 'COMPONENT_TEMPLATE');
    
    AP.Widget.Component = AP.Widget.extend({
        init : function (o) {
            this.base(o);
            
            A.stamp(this);
            this.rendered = false;
            
            this.parent = (o.parent) ? $(o.parent) : $(A.config.win.document.body);
            this.title = o.title;

            this.cssClass = o.cssClass || COMPONENT_CSS_CLASS;
            this.hoverCssClass = o.hoverCssClass || HOVER_CSS_CLASS;
            
            this.type = o.type || DEFAULT_TYPE;
            
            this.template = o.template || defineTemplateForCorrespondType[this.type];
            this.dataForTemplate = {
                title : this.title,
                cssClass : this.cssClass,
                uniqueId : this._uid
            };
            
            this.handlers = o.handlers || {};
        },
        className : 'component',
        render : function () {
            var html = this.generateHTML();
            this.parent.append(html);
            this.initializeDOMReference();
            this.initializeEventListeners();
            this.rendered = true;
        },
        setParent : function (el) {
            el = $(el);
            if (el[0].nodeName) {
                this.parent = el;
            }
        },
        setTemplate : function (name, source) {
            if (!T.templates[name]) {
                T.compileTemplate(souce, name);
            }
            this.template = name;
        },
        generateHTML : function () {
            return T.processTemplate(this.template, this.dataForTemplate);
        },
        initializeDOMReference : function () {
            this.DOM = $('#' + this.title + this._uid);
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
        }
    });

    A.Widget.ToolbarButton = A.Widget.Component.extend({
        init : function (o) {
            var conf = OOP.mix(o, {
                type : 'ToolbarButton',
                cssClass : ((o.cssClass) ? o.cssClass : TOOLBAR_COMPONENT_CSS_CLASS)
            }); 
           
            this.base(o); 
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
    { name : 'string', minVersion : '0.0.1' },
    { name : 'templateEngine', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' } 
]);
