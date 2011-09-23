AP.add('widget.component', function (A){

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
        O = A.Object,
        Ar = A.Array,
        L = A.Lang,
        DEFAULT_HIDDEN_CLASS = 'hidden';

    AP.Widget.Component = AP.Class.extend({
        className : 'component',
        boundedHandlers : {},
        mixins : A.util.Event.Observable,
        rendered : false,

        init : function (o) {
            this._subscribers = {};
            A.stamp(this);

            this.title = o.title;

            this.cssClass = o.cssClass || COMPONENT_CSS_CLASS;
            this.hoverCssClass = o.hoverCssClass || HOVER_CSS_CLASS;

            this.type = o.type || DEFAULT_TYPE_PREFIX + ':' + DEFAULT_TYPE;

            this.template = ((this.template) ? this.template : (o.template || DEFAULT_COMPONENT_TEMPLATE));
            this.supplyDataForTemplatesWithValues({
                title : this.title,
                cssClass : this.cssClass,
                uniqueId : this._uid
            });

            if (L.isValue(this.parent) && !L.isValue(this.target)) {
                this.parent.registerChild(this);
            }

            // add 'hidden css class if hidden param provided'
            var cssClasses = this.cssClass.split(' ');

            if (o.hidden && (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CLASS; }, this))) {

                    cssClasses.push(DEFAULT_HIDDEN_CLASS);
                    this.cssClass = cssClasses.join(' ');
                    this.supplyDataForTemplatesWithValues({
                        cssClass : this.cssClass
                    });
                }

            // define parent
            var parent = o.parent || A.Layout;
            parent.registerChild(this);

            this.handlers = o.handlers || {};
            A.Layout.registerTemplateForCompilation(this);
        },

        render : function () {
            this.remove();
            
            var containerRegex = containerRegex = /container/;
            if (containerRegex.test(this.type)) {
                if (this.target && this.target[0]) {
                    this.target.append(this.generateHTML());
                } else if (this.parent === AP.Layout && L.isUndefined(this.target)) {
                    AP.Layout.getBody().append(this.generateHTML());
                }
            } else {
                var html = this.generateHTML();
                if (this.target && this.target[0]) {
                    this.target.append(html);
                } else if (this.parent && this.parent.DOM && this.parent.DOM[0]) {
                    this.parent.DOM.append(html);
                }
            }

            this.initializeLogic();

            this.rendered = true;

            this.publish('rendered');
        },
        /**
         * Remove component from DOM tree, clear all event listeners and javascript references
         * @method remove
         */
        remove : function () {
            if (this.DOM && this.DOM[0]) { // say, we changed component't target and want it to redraw
                this.removeEventListeners();                
                // remove old html from DOM tree
                this.DOM.remove();
                // clear old reference
                delete this.DOM;
                
                this.rendered = false;
            }
        },
        /**
         * Remove event listeners binded to the DOM tree from components instance
         * @method removeEventListener
         */
        removeEventListeners : function () {
            if (this.DOM && this.DOM[0]) {
                A.each(this.boundedHandlers, function (handler, type) {
                    this.DOM.unbind(type, handler);
                }, this);
            }
        },

        setParent : function (/* Component */parent) {
            if (L.isValue(this.parent)) { 
                this.parent.removeChild(this);
            }
            this.parent = parent;
        },

        initializeDOMReference : function () {
            this.DOM = $('#' + this.title + '\\:' + this._uid);
        },

        generateHTML : function () {
            return T.processTemplate(this.template.name, this.dataForTemplate);
        },
        initializeEventListeners : function () {
            var d = this.DOM, h = this.handlers;
            
            O.each(h, function (handler, type) {
                var boundedFunction = AP.lambda();
                if (L.isFunction(handler)) {
                    boundedFunction = function (e) {
                        handler(e, this);
                    };
                    d[type](boundedFunction);
                    this.boundedHandlers[type] = boundedFunction;
                } else if (L.isFunction(handler.fn)) {
                    if (handler.data) {
                        boundedFunction = function (e) {
                            if (!L.isUndefined(handler.fn) && handler.fn) {
                                handler.fn(e, this);
                            }
                        };
                        d.bind(type, handler.data, boundedFunction);

                        this.boundedHandlers[type] = boundedFunction;
                    } else {
                        boundedFunction = function (e) {
                            if (!L.isUndefined(handler.fn) && handler.fn) {
                                handler.fn(e, this);
                            }
                        };
                        d.bind(type, boundedFunction);
                        this.boundedHandlers[type] = boundedFunction;
                    }
                }
            }, this);
        },

        initializeLogic : function () {
            
            this.initializeDOMReference();
            
            this.initializeEventListeners();
        },
        supplyDataForTemplatesWithValues : function (values) {
            var d = (this.dataForTemplate) ? this.dataForTemplate[0] : {};

            O.each(values, function (item, key) {
                d[key] = item;
            }, this);

            this.dataForTemplate = [d];
        },
        hide : function() {
            var wrapper = $(this.DOM).parents('.settingsInput'); // todo: wtf?!

            if (L.isUndefined(wrapper.get(0))) $(this.DOM).hide();
            else wrapper.hide();
        },
        show : function() {
            var wrapper = $(this.DOM).parents('.settingsInput');

            if (L.isUndefined(wrapper.get(0))) $(this.DOM).show();
            else wrapper.show();
        }
    });


    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'string', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1' },
    { name : 'templateEngine', minVersion : '0.0.1' } 
]);
