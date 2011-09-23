AP.add('widget.editor.quote', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query,
        Ar = A.Array,
        T = A.TemplateEngine,
        DEFAULT_MANUAL_TEXT = 'Текст Цитаты',
        QUOTES_REG_EXP = /(«|»|&laquo;|&raquo;)/gmi,
        quoteTemplate = {
            name : 'wysiwyg:quote',
            body : '<blockquote><span class="hidden">{"type":"%{type}", "source":"%{source}"}</span>%{text}</blockquote><br/>'
        };

    T.compileTemplate(quoteTemplate.body, quoteTemplate.name);

    E.StateChecker.adoptStateChecker({

        name : 'quote',
        defaultValue : false,

        checker : function (node) {
            var nodeName = node.nodeName.toLowerCase();
            return (nodeName == 'blockquote');
        }

    });

    E.EditArea.prototype.addQuote = function (mode, manualText) {
        if (mode == 'manual') {
            // just paste html and place cursor behind quotes
            var html = A.TemplateEngine.processTemplate(quoteTemplate.name, [{
                text : manualText || DEFAULT_MANUAL_TEXT,
                type : mode,
                source : 'null'
            }]);
        } else if (mode == 'machine') {
            // todo: beatify
            // place html behind quotes:
            html = A.TemplateEngine.processTemplate(quoteTemplate.name, [{
                text : AP.Layout.children.get('quoteWindow').DOM.find('.windowElements input.windowTextInput').val(),
                type : mode,
                source : $('.settingsPanel select[name=quoteSource]').val()
            }]);
        }

        this.doc.execCommand('insertHTML', false, html);
    };

    E.EditArea.prototype.deleteQuote = function () {
        var el = $(this.selectionBounds.root);

        if (!el.is('blockquote')) el = el.parents('blockquote');

        el.remove();
        this.focus();
    };

    function prepareHTMLForEditing() {
        var blockquotes = $(this.workingObject).find('blockquote');

        Ar.each(blockquotes, function (blockquote) {
            blockquote = $(blockquote);

            var text = blockquote.text(),
                params;

            text = text.substr(text.indexOf('}') + 1);

            params = { type : 'manual', source : 'null' };
            text = text.replace(QUOTES_REG_EXP, '');

            blockquote.replaceWith($(AP.TemplateEngine.processTemplate(quoteTemplate.name, [{
                text : text,
                type : params.type,
                source : params.source
            }])));
        }, this);
    };

    function prepareHTMLForSave() {
        var blockquotes = $(this.workingObject).find('blockquote');

        Ar.each(blockquotes, function (blockquote) {
            blockquote = $(blockquote);

            var text = blockquote.text();

            text = text.substr(text.indexOf('}') + 1);

            if (AP.String.trim(text).length == 0) {
                blockquote.remove();
            }
        });
    };

    E.Formatter.subscribe('prepareHTMLForEditing', prepareHTMLForEditing.bind(E.Formatter));
    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));

}, '0.0.1', [
    { name : 'widget.editor.formatter', minVersion: '1.0.1' },
    { name : 'query', minVerions : '0.0.1' },
    { name : 'array', minVersion : '1.1.0' },
    { name : 'templateEngine', minVersion : '0.0.2'}
]);