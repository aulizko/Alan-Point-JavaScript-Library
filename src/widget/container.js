AP.add('widget-container', function (A) {
    var T = A.TemplateEngine,
        Ar = A.Array,
        CONTAINER_TEMPLATE = { 
            name : 'container:default',
            body : '<div class="container" id="%{title}%{uniqueId}">%{content}</div>'
        };

    A.Widget.Container = A.Widget.Component.extend({
        init : function (o) {
            this.template = ((this.template) ? this.template : (o.template || CONTAINER_TEMPLATE));

            if (o.target) {
                this.target = o.target;
            }

            this.base(o);
            this.type = 'container:general';
            if (o.items) {
                var items = Ar(o.items);
                Ar.each(items, function (item) {
                    this.registerChild(item);
                }, this);
            }

            // register parent
            this.dataForTemplate = [{
                title : this.title,
                uniqueId : this._uid
            }];
        },

        registerChild : function (child) {
            this.children.add(child.title, child);
            A.Layout.registerTemplateForCompilation(child);
            child.setParent(this);
        },

        removeChild : function (child) {
            if (this.children.get(child.title)) {
                this.children.remove(child.title);
            }
        },

        generateHTML : function () {
            var innerHTML = new A.StringBuffer('');
            this.children.each(function (child, title) {
                innerHTML.add(T.processTemplate(child.template.name, child.dataForTemplate));
            }, this); 
            this.dataForTemplate = [A.OOP.mix(this.dataForTemplate[0], {
                content : innerHTML.toString()
            })];
            return T.processTemplate(this.template.name, this.dataForTemplate);
        },

        setTarget : function (el) {
            this.target = $(el);
        },

        initializeLogic : function () {
            this.children.each(function (child) {
                child.initializeLogic();
            }, this);
            this.base();
        },
        mixins : A.util.Event.Observable,
        className : 'container', 
        children : new A.data.Map()

    });
}, '0.0.1', [
    { name : 'array', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' },
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1' },
    { name : 'map', minVersion : '0.0.1' },
    { name : 'layout', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '0.0.1' }
]);
