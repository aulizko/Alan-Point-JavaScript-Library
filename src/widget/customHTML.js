AP.add('widget-customHTML', function (A) {
    var TEMPLATE = {
        name : 'component:customHTML',
        body : ' %{content} '
    }, OOP = A.OOP;
    
    A.Widget.CustomHTML = A.Widget.Component.extend({
        /**
         * render custom html
         * @method init
         * @param html {String}
         */
        init : function (o) {
            this.template = o.template || TEMPLATE;
            this.type = 'component:customHTML';
            this.base(o);
            this.dataForTemplate = [OOP.mix(this.dataForTemplate[0], {
                content : o.html
            })];
        }
    });
    
}, '0.0.1', []);