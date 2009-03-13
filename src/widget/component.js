AP.add('widget-component', function (A){

    var $ = A.Query,
        T = A.TemplateEngine,
        COMPONENT_CSS_CLASS = 'component',
        HOVER_CSS_CLASS = 'hover',
        DEFAULT_TYPE = 'general',
        DEFAULT_TYPE_PREFIX = 'component',
        DEFAULT_COMPONENT_TEMPLATE = { 
            name : 'component:general',
            body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"></div>'
        },
        OOP = A.OOP,
        L = A.Lang;

    AP.Widget.Component = AP.Widget.extend({
        init : function (o) {
            this.base(o);
            this._subscribers = new A.data.Map();
            A.stamp(this);
            this.rendered = false;
            this.title = o.title;

            this.cssClass = o.cssClass || COMPONENT_CSS_CLASS;
            this.hoverCssClass = o.hoverCssClass || HOVER_CSS_CLASS;
            
            this.type = o.type || DEFAULT_TYPE_PREFIX + ':' + DEFAULT_TYPE;
            this.template = ((this.template) ? this.template : (o.template || DEFAULT_COMPONENT_TEMPLATE));
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
                this.parent.removeChild(this); this.unsubscribe('component.rendered.' + this.title, parent);
            }
            this.parent = parent;
            this.subscribe('component.rendered.' + this.title, parent);
        },
        initializeDOMReference : function () {
            this.DOM = $('#' + this.title + ':' + this._uid);
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
        initializeLogic : function () {
            this.initializeDOMReference();
            this.initializeEventListeners();
        },
        mixins : A.util.Event.Observable
    });


    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.1' },
    { name : 'string', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1', },
    { name : 'templateEngine', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' } 
]);
