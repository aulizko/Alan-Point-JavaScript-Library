AP.add('widget.editor.orderedList', function (A) {
    var E = A.namespace('Widget.Editor'),
        $ = AP.Query;

    // add state checker
    E.StateChecker.adoptStateChecker({
        name : 'orderedList',
        defaultValue : false,
        checker : function (node) {
            return node.nodeName.toLowerCase() == 'ol';
        }
    });


    /**
     * Insert(remove) unOrdered list around selection
     * @method toggleOrderedList
     */
    E.EditArea.prototype.toggleOrderedList = function () {
        this.doc.execCommand('insertorderedlist', false, null);
        this.win.focus();
    };

    // handle intend/outdent problems
    function prepareHTMLForSave() {
        $('ol', $(this.workingObject)).each(function () {
            var $this = $(this);

            if ($this.parents('ol').length) {
                var li = $this.prev('li:first');
                $this.remove().appendTo(li);
            }
        });
    };

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));

}, '0.0.1', []);