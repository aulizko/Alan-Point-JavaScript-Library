AP.add('widget.container', function (A) {
    var T = A.TemplateEngine,
        Ar = A.Array,
        CONTAINER_TEMPLATE = { 
            name : 'container:default',
            body : '<div class="container" id="%{title}:%{uniqueId}">%{content}</div>'
        };

    A.Widget.Container = A.Widget.Component.extend({
        init : function (o) {
            this.children = new AP.data.Map();
            this.template = ((this.template) ? this.template : (o.template || CONTAINER_TEMPLATE));

            if (o.target) {
                this.target = o.target;
            }
            this.base(o);
            this.type = 'container:general';
            if (o.items) {
                var items = Ar.clean(Ar(o.items));
                Ar.each(items, function (item) {
                    this.registerChild(item);
                }, this);
            }
        },

        registerChild : function (child) {
            this.children.add(child.title, child);
            A.Layout.registerTemplateForCompilation(child);
            child.setParent(this);
        },

        removeChild : function (child) {
            var title = child.title || child, childComponent = this.children.get(title);
            if (childComponent) {
                this.children.remove(title);
                if (childComponent.setParent) childComponent.setParent(null);
            }
        },

        clear : function () {
            var keys = this.children.keys(), i;
            for (i = 0; i < keys.length; i ++) {

            }
            if (this.DOM) {
                this.DOM.empty();
            }
        },

        accept : function(children) {
            A.each(children, function (child) {
                this.addAndRenderChild(child);
            }, this);
        },

        generateHTML : function () {
            var innerHTML = new A.StringBuffer('');
            this.children.each(function (child) {
                innerHTML.add(child.generateHTML());
            }, this);
            this.supplyDataForTemplatesWithValues({
                content : innerHTML.toString()
            });
            return T.processTemplate(this.template.name, this.dataForTemplate);
        },

        setTarget : function (el) {
            this.target = $(el);
        },

        remove : function () {
            this.children.each(function (child) {
                child.removeEventListeners();
            });

            this.base();
        },
        
        addAndRenderChild : function (child) {
            this.registerChild(child);

            child.render();
        },
        
        hideAndRemoveChild : function(child) {
            this.removeChild(child);

            child.remove();
        },

        initializeLogic : function () {
            this.children.each(function (child) {
                child.initializeLogic();
            }, this);
            
            this.base();
        },

        mixins : A.util.Event.Observable,
        className : 'container'

    });
}, '0.0.1', [
    { name : 'array', minVersion : '0.0.1' },
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1' },
    { name : 'map', minVersion : '0.0.1' },
    { name : 'layout', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '0.0.1' }
]);
