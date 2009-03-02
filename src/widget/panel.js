AP.add('panel', function (A) {
    
    var $ = A.Query, O = A.Object, StringBuffer = A.StringBuffer, L = A.Lang;
    
    A.Panel = A.Widget.extend({
        init : function (o) {
            this.base(o);
            
            A.stamp(this);
            
            this.conf = {};
            
            if (o.html) {
                this.conf.html = o.html;
                this.conf.renderFromHtml = true;
            } else {
                this.conf.renderFromHtml = false;
            }
            
            this.conf.cssClass = o.cssClass || 'panel';
            
            this.parent = $(o.parent) || null;
            
            this.components = {};
            
            this.rendered = false;
            this.visible = false;
        },
        className : 'panel',
        setParent : function (el) {
            var c = $(el);
            if (c[0].nodeType == 1) {
                this.parent = c;
            } else {
                throw new Error(el + ' cannot be parent for panel');
            }
        },
        appendTo : function (el) {
            this.setParent(el);
            this.render();
        },
        setHTML : function (html) {
            this.conf.html = html;
            this.conf.renderFromHtml = true;
            this.render();
        },
        getHTML : function () {
            return this.container.html();
        },
        render : function () {
            this.removeEventListeners();
            this.removeDomReferences();
            if (this.conf.renderFromHtml) {
                this.setContainerInnerHTML(this.conf.html);
            } else {
                this.setContainerInnerHTML(this.generateHTML());
            }
            this.buildDOMReferences();
            this.initializeEventListeners();
            this.rendered = true;
            this.visible = this.container.is(':visible');
        },
        generateHTML : function () {
            var components = this.components,
                html = new StringBuffer('');
            O.each(components, function (component) {
                if (component.html) html.add(component.html);
                else html.add('<')
                        .add(component.nodeName)
                        .add((component.id) ? (' id="' + component.id + '%UNIQUE_ID%"') : '')
                        .add((component.cssClass) ? (' class="' + component.cssClass + '"') : '')
                        .add('></')
                        .add(component.nodeName)
                        .add('>');
            }, this);
            
            return html.toString().replace(this.uniqueIdRegex, this._uid);
        },
        registerComponent : function (component) {
            var c = this.components[component.title] = component;
            if (L.isValue(c.init)) c.init.call(this);
        },
        buildDOMReferences : function () {
            var components = this.components;
            O.each(components, function (component) {
                component.DOM = $('#' + component.id + this._uid);
            }, this);
        },
        initializeEventListeners : function () {
            var components = this.components;
            O.each(components, function (component) {
                O.each(component.eventListeners, function (handler, type) {
                    if (L.isFunction (handler)) {
                        component.DOM.bind(type, handler);
                    } else {
                        component.DOM.bind(type, handler.data, handler.fn);
                    }
                });
            }, this);
        },
        setContainerInnerHTML : function (source) {
            if (this.container) {
                this.container.html(source);
            } else {
                var html = new StringBuffer('<div id="panel' + this._uid + '" class="' + this.conf.cssClass + '">');
                html.add(source)
                    .add('</div>');
                
                this.parent.append(html.toString());
                
                this.container = $('#panel' + this._uid);
            }
        },
        removeEventListeners : function () {
            // todo
        },
        removeDomReferences : function () {
            // todo
        },
        destroy : function () {
            // todo
        },
        show : function (animationSpeed) {
            if (!this.rendered) {
                this.render();
            }
            if (animationSpeed) this.container.show(animationSpeed);
            else this.container.show();
            this.visible = true;
        },
        hide : function (animationSpeed) {
            if (!this.rendered) {
                this.render();
            }
            if (animationSpeed) this.container.hide(animationSpeed);
            else this.container.hide();
            this.visible = false;
        }
    });
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);