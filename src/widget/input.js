AP.add('widget-input', function (A) {

    var $ = A.Query,
        T = A.TemplateEngine,
        DEFAULT_TYPE_PREFIX = 'component',
        INPUT_CONTAINER_CSS_CLASS = 'settingsInput', 
        INPUT_COMPONENT_CSS_CLASS = 'settingInput',
        DEFAULT_INPUT_TEMPLATE = {
            name : 'component:input:text',
            body : '<div class="%{containerCssClass}" id="%{title}:%{uniqueId}">\
                        <div class="settingsInputLabel">%{humanizedTitle}</div>\
                        <input value="%{defaultValue}"/>\
                    </div>'
        },
        OOP = A.OOP,
        L = A.Lang,
        DEFAULT_HUMANIZED_TITLE = 'Инпут',
        DEFAULT_TYPE_PREFIX = 'component:input:',
        DEFAULT_TYPE = 'text';

    A.Widget.Input = A.Widget.Component.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_INPUT_TEMPLATE;
            this.base(OOP.mix(o, {
                cssClass : ((o.cssClass) ? o.cssClass : INPUT_COMPONENT_CSS_CLASS)
            }));
            
            this.containerCssClass = ((o.containerCssClass) ? o.containerCssClass : INPUT_CONTAINER_CSS_CLASS);
            this.defaultValue = ((o.defaultValue) ? o.defaultValue : '');
            
            
            this.dataForTemplate = [OOP.mix(this.dataForTemplate[0], {
                containerCssClass : this.containerCssClass,
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE,
                containerCssClass : this.containerCssClass
            })];
            
            this.type = (o.type) ? (DEFAULT_TYPE_PREFIX + o.type) : (DEFAULT_TYPE_PREFIX + DEFAULT_TYPE);
            
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
