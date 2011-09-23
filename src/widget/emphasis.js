AP.add('widget.editor.emphasis', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    E.StateChecker.adoptStateChecker({
        name : 'emphasis',
        defaultValue : false,
        checker : function (node) {
            var nodeName = node.nodeName.toLowerCase();
            return nodeName == 'em' || nodeName == 'i' ||
                   (nodeName == 'span' && $(node).css('font-style') == 'italic') ||
                   (nodeName == 'p' && $(node).css('font-style') == 'italic');

        }
    });

   /**
     * Convert(remove) emphasis tag around selection
     * @method toggleEmphasis
     */
    E.EditArea.prototype.toggleEmphasis = function () {
        this.doc.execCommand('italic', false, null);
        this.win.focus();
    };

    function prepareHTMLForEditing () {
        $('em', $(this.workingObject)).each(function () {
            var $this = $(this);
            if (this) {
                var replacement = A.config.doc.createElement('i');
                replacement.innerHTML = $this.html();
                try {
                    $this.replaceWith(replacement);
                } catch (e) {};
            }
        });
    };

    function prepareHTMLForSave() {
        $('i', $(this.workingObject)).each(function () {
            var $this = $(this);
            if (this) {
                var replacement = A.config.doc.createElement('em');
                replacement.innerHTML = $this.html();
                try {
                    $this.replaceWith(replacement);
                } catch (e) {};
            }
        });
    };

    E.Formatter.subscribe('prepareHTMLForEditing', prepareHTMLForEditing.bind(E.Formatter));

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));


}, '0.0.1', []);