AP.add('widget.image', function (A) {
    var TEMPLATE = {
            name : 'component:image',
            body : '<img src="%{src}" class="%{cssClass}" id="%{title}:%{uniqueId}" />'
        },
        DEFAULT_TITLE_PREFIX = 'component:image:';

    A.Widget.Image = A.Widget.Component.extend({
        /**
         * render image
         * @method init
         * @param html {String}
         */
        init : function (o) {
            this.template = o.template || TEMPLATE;
            o.title = o.title || (DEFAULT_TITLE_PREFIX + (new Date()).getTime());
            this.base(o);
            this.type = 'component:image';
            this.supplyDataForTemplatesWithValues({
                src: o.src
            });
        }
    });

}, '0.0.1', []);