AP.add('widget.label', function (A){

    var labelTemplate = {
        body : '<span id="%{title}:%{uniqueId}" class="%{cssClass}">%{text}</span>',
        name : 'component:label'
    },
    DEFAULT_HIDDEN_CSS_CLASS = 'hidden';

    AP.TemplateEngine.compileTemplate(labelTemplate.body, labelTemplate.name);

    A.Widget.Label = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || labelTemplate;
            this.type = 'component:label';

            this.base(o);

            if (o.hidden) {
                var cssClasses = this.cssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CSS_CLASS)) ||
                  !AP.Array.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CSS_CLASS; }, this)) {

                    cssClasses.push(DEFAULT_HIDDEN_CSS_CLASS);
                    this.cssClass = cssClasses.join(' ');
                }
                this.visible = false;
            } else {
                this.visible = true;
            }

            this.supplyDataForTemplatesWithValues({
                text : o.text
            });
        }
    });

}, '0.0.1', [
    { name : 'widget.component', minVersion : '0.0.1' }
]);