AP.add('widget.editor.strong', function (A) {
    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    // add state checker
    E.StateChecker.adoptStateChecker({
        name : 'strong',
        defaultValue : false,
        checker : function (node) {
            var nodeName = node.nodeName.toLowerCase();
            return nodeName == 'strong' || nodeName == 'b' ||
                   (nodeName == 'span' && $(node).css('font-weight') == 'bold') ||
                   (nodeName == 'p' && $(node).css('font-weight') == 'bold');
        }
    });
    // add method "toggleStrong" to the wysiwyg when
    /**
     * Convert(remove) strong tag around selection
     * @method toggleStrong
     */
    E.EditArea.prototype.toggleStrong = function () {
        this.doc.execCommand('bold', false, null);
        this.win.focus();
    };

    

    function prepareHTMLForEditing () {
        $('strong', $(this.workingObject)).each(function () {
            var $this = $(this);
            if (this) {
                var replacement = A.config.doc.createElement('b');
                replacement.innerHTML = $this.html();
                try {
                    $this.replaceWith(replacement);
                } catch (e) {};
            }
        });
    };

    function prepareHTMLForSave() {
        $('b', $(this.workingObject)).each(function () {
            var $this = $(this);
            if (this) {
                var replacement = A.config.doc.createElement('strong');
                replacement.innerHTML = $this.html();
                try {
                    $this.replaceWith(replacement);
                } catch (e) {};
            }
        });
    };



    // add method to prepare html for editing

    E.Formatter.subscribe('prepareHTMLForEditing', prepareHTMLForEditing.bind(E.Formatter));

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));


}, '0.0.1', []);