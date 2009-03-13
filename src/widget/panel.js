AP.add('widget-panel', function (A) {
    
    // todo review: does panel need ability "render by html code"?
    var $ = A.Query, 
        O = A.Object, 
        StringBuffer = A.StringBuffer, 
        L = A.Lang,
        PANEL_CSS_CLASS = 'panel',
        DEFAULT_PANEL_TEMPLATE = {
            name : 'container:panel',
            body : '<div class="%{cssClass}" id="%{title}:%{uniqueId}">%{content}</div>'
        };

//    A.Widget.Panel = A.Widget.extend({
//        init : function (o) {
//            this.base(o);
//            
//            A.stamp(this);
//            this.cssClass = o.cssClass || PANEL_CSS_CLASS;
//            
//            this.items = {};
//            var items = o.items;
//            O.each(items, function (item, index) {
//                this.items[item.title]
//            }, this);
//        },
//        rendered : false,
//        visible : false,
//        className : 'panel',
//        render : function () {
//            // 1. generate template for the items
//            // 2. if there with the help of the templateEngine render html
//            // 3. initialize dom references to the correspond items
//            // 4. activate event listeners
//            // 5. ?????
//            // 6. PROFIT
//            
//            this.generateTemplate();
//            this.processTemplate();
//            this.buildDOMReferences();
//            this.initializeEventListeners();
//            this.rendered = true;
//            this.visible = this.container.is(':visible');
//        },
//        generateTemplate : function () {
//            var items = this.items,
//                html = new StringBuffer('');
//            O.each(items, function (item, index) {
//                
//            }, this);
//            O.each(components, function (component) {
//                if (component.html) { html.add(component.html);}
//                /*else html.add('<')
//                        .add(component.nodeName)
//                        .add((component.id) ? (' id="' + component.id + '%UNIQUE_ID%"') : '')
//                        .add((component.cssClass) ? (' class="' + component.cssClass + '"') : '')
//                        .add('></')
//                        .add(component.nodeName)
//                        .add('>');*/
//            }, this);
//            
//            return html.toString().replace(this.uniqueIdRegex, this._uid);
//        },
//        buildDOMReferences : function () {
//            var components = this.components;
//            O.each(components, function (component) {
//                component.DOM = $('#' + component.id + this._uid);
//            }, this);
//        },
//        initializeEventListeners : function () {
//            var components = this.components, self = this;
//            O.each(components, function (component) {
//                O.each(component.eventListeners, function (handler, type) {
//                    if (L.isFunction (handler)) {
//                        component.DOM.bind(type, function (e) {
//                            handler.call(self, e);
//                        });
//                    } else {
//                        component.DOM.bind(type, handler.data, function (e) {
//                            handler.fn.call(self.e);
//                        });
//                    }
//                });
//            }, this);
//        },
//        setContainerInnerHTML : function (source) {
//            if (this.container) {
//                this.container.html(source);
//            } else {
//                var html = new StringBuffer('<div id="panel' + this._uid + '" class="' + this.conf.cssClass + '">');
//                html.add(source)
//                    .add('</div>');
//                
//                this.parent.append(html.toString());
//                
//                this.container = $('#panel' + this._uid);
//            }
//        },
//        removeEventListeners : function () {
//            // todo
//        },
//        removeDomReferences : function () {
//            // todo
//        },
//        destroy : function () {
//            // todo
//        },
//        show : function (animationSpeed) {
//            if (!this.rendered) {
//                this.render();
//            }
//            if (animationSpeed) this.container.show(animationSpeed);
//            else this.container.show();
//            this.visible = true;
//        },
//        hide : function (animationSpeed) {
//            if (!this.rendered) {
//                this.render();
//            }
//            if (animationSpeed) this.container.hide(animationSpeed);
//            else this.container.hide();
//            this.visible = false;
//        },
//        setToolBar : function (toolbar) { // todo: remove
//            this.toolbar = toolbar;
//        }
//    });

    A.Widget.Panel = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_PANEL_TEMPLATE;
            this.base(o);
            this.type = 'container:panel';
            this.dataForTemplate = [A.OOP.mix(this.dataForTemplate[0], {
                cssClass : ((o.cssClass) ? o.cssClass : PANEL_CSS_CLASS)
            })];
        },
        className : 'panel'
    });

}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'widget-container', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' },
    { name : 'widget', minVersion : '0.0.1' }
]);
