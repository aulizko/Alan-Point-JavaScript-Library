// 1 создаем html для тулбара и edit area с учетом плагинов (хотя это скорее к toolbar)
// 2 замещаем этим html-ом элемент, который нам показали. 
// 3 инициализируем ссылки на dom - т.е. на всякие там iframe и прочее. Делаем это за счет того, что на этапе генерации html уже дали каждому нужному элементу уникальный id вида clicheEditorIframe__UNIQUE_ID__
// 4 вставляем в iframe изначальный текст
// 5 инициализируем event listeners
// 6 человек работает с информацией
// 7 после нажатия сохранить, прогоняем всю эту бодягу через валидаторы и делаем валидный (x)html код
// 8 отдаем нужный текст

AP.add('rte', function (A) {
    var $ = A.Query;
    A.Widget.RTE = A.Widget.extend({
        init : function (o) {
            this.base(o);
            this.conf.uniqueId = (new Date()).valueOf() + '_' + Math.floor(Math.random()*1000);
            this.conf.uniqueIdRegex = /%UNIQUE_ID%/g;
        },
        editArea : {},
        render : function () {
            var conf = this.conf;
            // build inner html for the future editor
            var html = new A.StringBuffer('<div id="clicheEditorContainer%UNIQUE_ID%" class="' + conf.containerClass + '">'); // begin of the container block
            html.add(this.generateHTMLForToolbar())
                .add(this.generateHTMLForEditArea())
                .add('</div>');
            
            $(this.conf.targetElement).replaceWith(html);
            delete this.conf.targetElement;
            
            this.initializeDOMReferences();
            this.initializeEditArea();
            this.initializeEventListeners();
        },
        initializeEditArea : function (o) {            
            var t = this.editArea.textarea = $('textarea.' + o.textareaClass).hide().get(0), // remember textarea have been replaced with iframe.
            c = this.container = $('<div class="' + o.containerClass + '"></div>').appendTo(t.parentNode).get(0),
            i = this.editArea.iframe = $('<iframe class="' + o.iframeClass + '" frameborder="0"></iframe>').get(0),
            h = this.editArea.input = $('<input type="hidden" name="' + t.name + '" value="' + o.value + '"></input>').get(0), // create input which value we will pass through the form
            e = this.editArea.extraInput = $('<input type="hidden" name="' + t.name + 'ClicheEditor" value="true"></input>').get(0); // create an extra input to determine if the submitted data is from the normal textarea or from the clicheEditor

            // get values from config object, replace its with defaults, if needed
            var pathToStylesheet = o.pathToStyleSheet || '/css/clicheEditor.css';

            $(t).replaceWith(c);
            $(c).append(i).append(h).append(e);// append iframe to the root element
            
            // remember initial content of the textarea for future use
            var initial_content = t.value;

            // remove textarea from the DOM
            $(t).remove();
            this.editArea.textArea = null;
            delete this.editArea.textArea; // remove textarea property from the EditArea object

            // fill iframe with old textarea value
            var html = '<'+'?xml version="1.0" encoding="UTF-8"?'+'><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body>INITIAL_CONTENT</body></html>';
            var style = '<link rel="stylesheet" type="text/css" media="screen" href="' + pathToStylesheet + '" />';
            
            var d = this.editArea.doc = i.contentWindow.document;
            
            d.open();
            d.write(html
              .replace(/INITIAL_CONTENT/, initial_content)
              .replace(/STYLE_SHEET/, style));
            d.close();
            d.contentEditable = 'true';
            
            this.editArea.body = d.body;
            
            try {
                d.designMode = 'on';
            } catch ( e ) {
                // Will fail on Gecko if the editor is placed in an hidden container element
                // The design mode will be set ones the editor is focused

                $(d).focus(function() {
                    d.designMode = 'on';
                });
            }
            
            // EditArea.fn.defineMaxAndMinHeight();
            // EditArea.fn.initializeHeigthPoints();
            
            // EditArea.fn.initializeBackupSelection();
            
            // EditArea.fn.initializeEvents();
            
            // EditArea.fn.initializeObservers();
            
            // EditArea.fn.focusWindowOnLoad();
        },
        generateHTMLForToolbar : function () {
            // get code for the toolbar container
        }
    });
}, '0.0.1', [
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);