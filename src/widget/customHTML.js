AP.add('widget.customHTML', function (A) {
    var TEMPLATE = {
            name : 'component:customHTML',
            body : ' %{content} '
        },
        DEFAULT_TITLE_PREFIX = 'customHTML:';
    
    A.Widget.CustomHTML = A.Widget.Component.extend({
        /**
         * render custom html
         * @method init
         * @param html {String}
         */
        init : function (o) {
            this.template = o.template || TEMPLATE;
            o.title = o.title || (DEFAULT_TITLE_PREFIX + (new Date()).getTime());
            this.base(o);
            this.type = 'component:customHTML';
            this.supplyDataForTemplatesWithValues({
                content : o.html
            });
        }
    });
    
}, '0.0.1', []);