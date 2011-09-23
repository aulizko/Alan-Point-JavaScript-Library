AP.add('widget.editor.unOrderedList', function (A) {
    var E = A.namespace('Widget.Editor'),
        $ = AP.Query;

    // add state checker
    E.StateChecker.adoptStateChecker({
        name : 'unOrderedList',
        defaultValue : false,
        checker : function (node) {
            return node.nodeName.toLowerCase() == 'ul' && node.className == '';
        }
    });


    /**
     * Insert(remove) ordered list around selection
     * @method toggleUnOrderedList
     */
    E.EditArea.prototype.toggleUnOrderedList = function () {
        this.doc.execCommand('insertunorderedlist', false, null);
        this.win.focus();
    };

    // handle intend/outdent problems
    function prepareHTMLForSave() {
        $('ul', $(this.workingObject)).each(function () {
            var $this = $(this);

            if ($this.parents('ul').length) {
                var li = $this.prev('li:first');
                $this.remove().appendTo(li);
            }
        });
    };

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));

}, '0.0.1', []);