AP.add('widget', function (A) {
    A.Widget = new A.Class({
        className : 'widget',
        attributes : {
            height : {
                value : 0
            },
            width : {
                value : 0
            },
            visible : {
                value : false
            }
        },
        initialize : function (o) {
            this.height = o.height || 0;
            this.width = o.width || 0;
            this.visible = false;
        },
        render : function () {
            // abstract function, must be overriden into the descendant class
        }
    });
}, '0.0.1', [
    { name : 'class', minVersion : '0.0.1' }
]);