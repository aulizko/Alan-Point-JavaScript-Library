AP.add('layout', function (A) {

    var T = A.TemplateEngine, L = A.Lang, $ = A.Query;
  /**
   * Main layer at the UI implementation, analog of the global object window in the client JS
   * @module ap
   * @submodule widget
   * @class Layout
   */
A.Layout = A.Widget.Layout = new (A.Class.extend({
        _components : new A.data.Map(),

        /**
         * Stub for the method which will being invocated while window resizing
         * todo: pending
         * @method onResize
         */
        onResize : function () {},
        mixins : A.util.Event.Observable,

        /**
         * Render all child components html,
         * and bind their DOM reference and event listeners
         * @method render
         * @throws Layout.initialized event
         */
        render : function () {
            this.appendHTML();
            
            this.publish('layout:htmlReady');
            
            this.initializeComponents();
            
            //this.initializeCallbacks(); // wtf? What did I mean? %)
            this.publish('layout:ready');
        },

        initializeComponents : function () {
            this._components.each(function (component) {
                component.initializeDOMReference();
            }, this);
            
            this.publish('layout:domReferencesReady');
            this._components.each(function (component) {
                component.initializeEventListeners();
            }, this);

            this.publish('layout:eventListenersReady');
            this._components.each(function (component) {
                component.initializeLogic(); // I mean: I obey you, nasty components, to initialize your business logic!
            }, this);

            this.publish('layout:businessLogicReady');
            $(A.config.win).bind('resize', this.onResize);
        },

        /**
         * Add component to the layout (assume that you should add different containers to the layout
         * and components to the particular containers)
         * @method registerChild 
         * @param {Component} component
         */
        registerChild : function (component) {
              this._components.add(component.title, component);
              // we need to subscribe layout someway to the events of the components
              component.setParent(this);
        },

        removeChild : function (component) {
            this._components.remove(component.title);
        },

        appendHTML : function () {
            var layoutHTML = new A.StringBuffer(''), containerRegex = /container/;
            this._components.each(function (component, index) {
                if (containerRegex.test(component.type) && component.target && component.target[0]) {
                    component.target.append(component.generateHTML());
                }
                if (containerRegex.test(component.type) && component.parent === this && L.isUndefined(component.target)) {
                    layoutHTML.add(component.generateHTML());
                }
                // TODO: what shall we do if meet component which hasn't parent or target?
            }, this);
            $(A.config.doc.body).append(layoutHTML.toString());
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
