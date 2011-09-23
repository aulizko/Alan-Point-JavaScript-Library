AP.add('widget.window', function (A) {
    var $ = AP.Query;
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
    DEFAULT_HIDDEN_CSS_CLASS = 'hidden',
    Ar = A.Array;

    A.TemplateEngine.compileTemplate(DEFAULT_WINDOW_TEMPLATE.body, DEFAULT_WINDOW_TEMPLATE.name);

    A.Widget.Window = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_WINDOW_TEMPLATE;
            this.base(o);
            this.supplyDataForTemplatesWithValues({
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE,
                closeButtonTitle : o.closeButtonTitle || DEFAULT_CLOSE_BUTTON_TITLE
            });
            
            if (o.hidden) {
                var cssClasses = this.cssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CSS_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CSS_CLASS; }, this)) {
                        
                    cssClasses.push(DEFAULT_HIDDEN_CSS_CLASS);
                    this.cssClass = cssClasses.join(' ');
                    this.dataForTemplate[0].cssClass = this.cssClass;
                }
            }
            this.type = 'container:window';
        },
        initializeLogic : function () {
            this.base();
            var self = this;
            this.closeButton = this.DOM.find('.windowClose');
            
            this.closeButton.click(function (e) {
                self.close();

                if (e.preventDefault) { e.preventDefault(); }
                return false;
            });
        },
        close : function () {
            $('.cover').hide(1000).remove();
            this.DOM.hide();
        },
        addAndRenderChild : function (child) {
            this.registerChild(child);
            if (this.DOM) {
                this.DOM.find('.windowElements').append(child.generateHTML());
                child.initializeLogic();
            }

        },
        clear : function () {
            A.each(this.children, function (child) {
                this.removeChild(child);
                if (child.removeEventListener) {
                    child.removeEventListener();
                }
            }, this);

            if (this.DOM) {
                this.DOM.find('.windowElements').empty();
            }
        },
        show : function () {
            if (!this.rendered) { this.render(); }
            var d = this.DOM, $document = $(document);

            $('<div></div>').css({opacity: 0, width: $document.width(), height: $document.height()})
                    .addClass('cover').fadeTo(1000, 0.3).prependTo('body');

            var $d = $(d);
            $d.css({
                'left' : ($(document).width() - $d.width()) / 2,
                'top' : '20%'
            });

            $d.removeClass(DEFAULT_HIDDEN_CSS_CLASS);
            $d.show();

            this.publish('showed');
        },
        className : 'container:window'
    });
    
    
    
}, '0.0.1', [
    { name : 'widget.container', minVersion : '0.0.1' }
]);