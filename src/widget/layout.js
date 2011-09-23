AP.add('layout', function (A) {

    var T = A.TemplateEngine, L = A.Lang, $ = A.Query;
  /**
   * Main layer at the UI implementation, analog of the global object window in the client JS
   * @module ap
   * @submodule widget
   * @class Layout
   */
A.Layout = A.Widget.Layout = new (A.Class.extend({
        body : null,
        children : new A.data.Map(),

        mixins : A.util.Event.Observable,

        renderAllAtOnce : false,

        componentsToRenderFirst : [],

        setComponentsToRenderFirst : function (o) {
            if (L.isString(o)) {
                this.componentsToRenderFirst = [o];
            } else {
                this.componentsToRenderFirst = o;
            }
        },

        /**
         * Render all child components html,
         * and bind their DOM reference and event listeners
         * @method render
         */
        render : function () {
            if (this.renderAllAtOnce) {
                this.appendHTML();
                this.publish('layout:htmlReady');

                this.initializeComponents();
                this.publish('layout:ready');
            } else {
                A.each(this.children, function (child, title) {
                    if (A.Array.indexOf(this.componentsToRenderFirst, title) != -1) {
                        child.render();
                    }
                }, this);
                this.publish('layout:htmlReady');
                this.publish('layout:ready');
            }
        },

        initializeComponents : function () {
            this.children.each(function (component) {
                component.initializeDOMReference();
            }, this);
            
            this.publish('layout:domReferencesReady');
            this.children.each(function (component) {
                component.initializeEventListeners();
            }, this);

            this.publish('layout:eventListenersReady');
            this.children.each(function (component) {
                component.initializeLogic();
            }, this);

            this.publish('layout:businessLogicReady');
        },

        /**
         * Add component to the layout (assume that you should add different containers to the layout
         * and components to the particular containers)
         * @method registerChild 
         * @param component
         */
        registerChild : function (component) {
              this.children.add(component.title, component);
              // we need to subscribe layout someway to the events of the components
              component.setParent(this);
        },

        removeChild : function (component) {
            this.children.remove(component.title);
        },

        getBody : function () {
            if (!this.body) {
                this.body = $(A.config.doc.body);
            }

            return this.body;
        },

        appendHTML : function () {
            var layoutHTML = new A.StringBuffer(''), containerRegex = /container/;
            this.children.each(function (component) {
                if (containerRegex.test(component.type) && component.target && component.target[0]) {
                    component.target.append(component.generateHTML());
                }
                
                if (containerRegex.test(component.type) && component.parent === this && L.isUndefined(component.target)) {
                    layoutHTML.add(component.generateHTML());
                }
            }, this);
            this.getBody().append(layoutHTML.toString());
        },

        registerTemplateForCompilation : function (component) {
            if (L.isValue(T.templates[component.template.name])) { return; }
            T.compileTemplate(component.template.body, component.template.name);
        }
    }))();

}, '0.0.1', [
    { name : 'stringBuffer', minVersion : '0.0.1' },
    { name : 'widget', minVersion: '0.0.1' },
    { name : 'map', minVersion : '0.0.1' }
]);
