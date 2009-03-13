AP.add('widget', function (A) {
    var O = A.Object;
    A.Widget = A.Class.extend({
        init : function (o) {
            this.rendered = false;
            this.conf = o;
        },
        plugins : {},
        className : 'widget',
        toString : function () {
            return this.className;
        },
        plug : function (plugin) {
            if (this.plugins[plugin.name]) return;
            var p = this.plugins[plugin.name] = {};
            p.version = plugin.version;
            p.init = plugin.init;
            p.init.apply(this, this.conf);
        },
        render : function () {
            this.rendered = true;
        }
    });
}, '0.0.1', [
    { name : 'class', minVersion : '0.0.2' },
    { name : 'object', minVersion : '0.0.1' }
]);
