AP.add('widget-input', function (A) {

    var $ = A.Query,
        T = A.TemplateEngine,
        DEFAULT_TYPE_PREFIX = 'component',
        INPUT_CONTAINER_CSS_CLASS = 'settingsInput', 
        INPUT_COMPONENT_CSS_CLASS = 'settingInput',
        DEFAULT_INPUT_TEMPLATE = { 
            name : 'component:input',
            body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelIcon %{title}Icon"></div></div>'
        },
        OOP = A.OOP,
        L = A.Lang,
        DEFAULT_HUMANIZED_TITLE = 'Инпут';

    A.Widget.Input = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_INPUT_TEMPLATE;
            this.base(OOP.mix(o, {
                type : ((/Input/ig.test(o.type)) ? (o.type) : (o.type + ':input')),
                cssClass : ((o.cssClass) ? o.cssClass : INPUT_COMPONENT_CSS_CLASS),
                defaultValue : ((o.defaultValue) ? o.defaultValue : ''),
                containerCssClass : ((o.containerCssClass) ? o.containerCssClass : INPUT_CONTAINER_CSS_CLASS)
            }));
            
            this.dataForTemplate = [OOP.mix(this.dataForTemplate[0], {
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE
            })];
            
            this.defaultValue = o.defaultValue || '';
        },
        handlers : {
            focus : function () {
                // todo: remove validation output
                if (this.DOM.val() === this.defaultValue) {this.DOM.val('');}
            },
            blur : function () {
                // todo: run validation
                if (this.DOM.val() === '') {this.DOM.val(this.defaultValue);}
            }
        }
    });
}, '0.0.1', [ { name : 'widget-component', minVersion : '0.0.1' } ]);
