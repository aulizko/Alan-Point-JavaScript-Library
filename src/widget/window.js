AP.add('widget-window', function (A) {
    var DEFAULT_WINDOW_TEMPLATE = {
        name : 'container:window',
        body : '<div id="%{title}:%{uniqueId}" class="window %{cssClass}">\
            <div class="shadowWrapper">\
                <div class="windowHeader">\
                    <span class="windowLabel">%{humanizedTitle}</span>\
                    <a href="#" class="windowClose" title="%{closeButtonTitle}"></a>\
                </div>\
                <div class="windowContent">\
                    <div class="windowElements">\
                        %{content}\
                    </div>\
                </div>\
            </div>\
            <div class="windowBottom">\
                <div class="windowLeftCornerShadow"></div>\
                <div class="windowBottomShadow"></div>\
                <div class="windowRightCornerShadow"></div>\
            </div>\
        </div>'
    },
    DEFAULT_HUMANIZED_TITLE = /*Окно*/ '\u041E\u043A\u043D\u043E',
    DEFAULT_CLOSE_BUTTON_TITLE = /*Закрыть*/ '\u0417\u0430\u043A\u0440\u044B\u0442\u044C',
    OOP = AP.OOP,
    DEFAULT_HIDDEN_CSS_CLASS = 'hidden';
    
    A.Widget.Window = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_WINDOW_TEMPLATE;
            this.base(o);
            this.dataForTemplate = [OOP.mix(this.dataForTemplate[0], {
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE,
                closeButtonTitle : o.closeButtonTitle || DEFAULT_CLOSE_BUTTON_TITLE
            })];
            
            if (o.hidden) {
                var cssClasses = this.cssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CSS_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CSS_CLASS; }, this)) {
                        
                    cssClasses.push(DEFAULT_HIDDEN_CSS_CLASS);
                    this.cssClass = cssClasses.join(' ');
                    this.dataForTemplate[0].cssClass = this.cssClass;
                }
            }
        },
        initializeLogic : function () {
            var self = this;
            this.closeButton = this.DOM.find('.windowClose');
            
            this.closeButton.click(function () {
                self.close();
            });
        },
        close : function () {
            this.DOM.hide(300);
        },
        show : function () {
            var d = this.DOM;
            d.removeClass(DEFAULT_HIDDEN_CSS_CLASS);
            d.show(300);
        },
        className : 'container:window'
    });
    
    
    
}, '0.0.1', [
    { name : 'widget-container', minVersion : '0.0.1' }
]);