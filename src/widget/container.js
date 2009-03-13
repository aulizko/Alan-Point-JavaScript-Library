AP.add('widget-container', function (A) {
    var T = A.TemplateEngine,
    
        CONTAINER_TEMPLATE = { 
            name : 'container:default',
            body : '<div class="container" id="%{title}%{uniqueId}">%{content}</div>'
        };

    A.Widget.Container = A.Widget.Component.extend({
        init : function (o) {
            this.base(o);

            A.stamp(this);
            this.template = o.template || CONTAINER_TEMPLATE;
            // register parent
            if (o.parent) { this.setParent(o.parent); }
            if (o.target) { this.setTarget(o.target); }
            this.publish(this.title + '.initialized');
            A.Layout.registerTemplateForCompilation(this);
        },

        setParent : function(parent) {
            this.parent = parent;
            // subscribe parent to the events produced by container

            this.subscribe(this.title + '.initialized', parent);
        },

        registerChild : function (child) {
            this.__children.add(child.title, child);
            A.Layout.registerTemplateForCompilation(child);
            child.setParent(this);
        },

        generateHTML : function () {
            var innerHTML = new A.StringBuffer('');
            this.__children.each(function (child, title) {
                innerHTML.add(T.processTemplate(child.type, child.dataForTemplate));
            }, this); 
            this.dataForTemplate = {
                content : innerHTML.toString(),
                uniqueId : this._uid,
                title : this.title
            }; 
            return T.processTemplate(this.template.name, this.dataForTemplate);
        },

        setTarget : function (el) {
            this.target = $(el);
        }

        mixins : A.util.Event.Observable,

        __children : new A.data.Map()

    });
}, '0.0.1', [
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1' },
    { name : 'map', minVersion : '0.0.1' },
    { name : 'layout', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '0.0.1' }
]);
