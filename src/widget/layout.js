AP.add('layout', function (A) {

    var T = A.TemplateEngine, L = A.Lang, $ = A.Query;
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
          this._components.add(component.title, component);
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
            this.appendHTML();
            //this.initializeComponents();
            //this.initializeCallbacks();
        },

        registerChild : function (component) {
            this.add(component);
        },

        removeChild : function (component) {
            if (this._components.get(component.title)) {
                this._components.remove(component.title);
            }
        },

        appendHTML : function () {
            var layoutHTML = new A.StringBuffer(), containerRegex = /container/;
            this._components.each(function (component) {
                if (containerRegex.test(component.type) && L.isUndefined(component.parent)) {
                    var html = component.generateHTML();
                    if (component.target && component.target[0]) {
                        component.target.append(html);
                    }
                }
                if (containerRegex.test(component.type) && component.parent === this) {
                    layoutHTML.add(component.generateHTML);
                }
            }, this);
            $(A.config.doc.body).append(layoutHTML.toString());
        },

        registerTemplateForCompilation : function (component) {

            if (L.isValue(T.templates[component.template.name])) { return; }

            T.compileTemplate(component.template.body, component.template.name);
        }
    };

}, '0.0.1', [
    { name : 'stringBuffer', minVersion : '0.0.1' },
    { name : 'widget', minVersion: '0.0.1' },
    { name : 'map', minVersion : '0.0.1' }
]);
