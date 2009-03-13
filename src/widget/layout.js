AP.add('layout', function (A) {

    var T = A.TemplateEngine, L = A.Lang;
  /**
   * Main layer at the UI implementation, analog of the global object window in the client JS
   * @module ap
   * @submodule widget
   * @class Layout
   */
    A.Layout = A.Widget.Layout = {
        _components : new A.data.Map(),

        /**
         * Stub for the method which will being invocated while window resizing
         * todo: pending
         * @method onResize
         */
        onResize : function () {},
        /**
         * Add component to the layout (assume that you should add different containers to the layout
         * and components to the particular containers)
         * @method add
         * @param {Component} component
         */
        add : function (component) {
          this._components.add(component.name, component);
          // we need to subscribe layout someway to the events of the components
          component.setParent(this);
        },

        mixins : A.util.Event.Mediator,

        /**
         * Render all child components html,
         * and bind their DOM reference and event listeners
         * @method render
         * @throws Layout.initialized event
         */
        render : function () {
            this.collectTemplates();
            this.initializeComponents();
            this.initializeCallbacks();
        },

        registerTemplateForCompilation : function (component) {
            if (L.isValue(T.templates[component.template.name])) { return; }

            T.compileTemplate(component.template.body, component.template.name);
        }
    };

}, '0.0.1', [
    { name : 'widget', minVersion: '0.0.1' },
    { name : 'map', minVersion : '0.0.1' }
]);
