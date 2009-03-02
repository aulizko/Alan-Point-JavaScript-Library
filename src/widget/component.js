AP.add('component', function (A) {

    var $ = A.Query,
        T = A.TemplateEngine,
        COMPONENT_TEMPLATE = '<div id="%{title}%{uniqueId}" class="%{cssClass}"></div>',
        COMPONENT_CSS_CLASS = 'component';
        
    T.compileTemplate(COMPONENT_TEMPLATE, 'COMPONENT_TEMPLATE');
    
    AP.Widget.Component = AP.Widget.extend({
        init : function (o) {
            this.base(o);
            
            A.stamp(this);
            this.rendered = false;
            
            this.parent = (o.parent) ? $(o.parent) : $(A.config.win.document.body);
            this.title = o.title;
            this.cssClass = o.cssClass || COMPONENT_CSS_CLASS;
            
            this.type = o.type;
            
            this.template = o.template || COMPONENT_TEMPLATE;
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
            var d = this.DOM, h = this.handlers;
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
    
}, '0.0.1', [
    { name : 'templateEngine', minVersion : '0.0.1' }
]);