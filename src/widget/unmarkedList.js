AP.add('widget.editor.unmarkedList', function (A) {
    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    // add state checker so that toolbar should be able to know that we are in specified node, not in dom mess
    E.StateChecker.adoptStateChecker({
        name : 'unmarkedList',
        defaultValue : false,
        checker : function (node) {
            return node.nodeName.toLowerCase() == 'ul' && node.className == 'linksMenu';
        }
    });

    // add action to the EditArea edit area, so that it should be able to add unmarked list
    /**
     * Insert(remove) unMarked list around selection
     * @method toggleUnmarkedList
     */
    E.EditArea.prototype.toggleUnmarkedList = function () {
        // check if we are not inside unmarked list
        if (!this.state.unmarkedList && !this.state.unOrderedList && !this.state.orderedList) {
            this.doc.execCommand('insertunorderedlist', false, null);
            this.getSelectionBounds();

            var node = $(this.selectionBounds.currentNode);

            if (!node.is('ul')) {
                node = node.parent('ul');
            }

            if (!node.length) {
                node = $(this.selectionBounds.end).parents('ul');
            }

            if (!node.length) {
                node = $(this.selectionBounds.start).parents('ul');
            }

            node.addClass('linksMenu');

        } else if (!this.state.unOrderedList && !this.state.orderedList && this.state.unmarkedList ) {
            // just remove ul node, don't pay attantion to it's class - it should gone as well
            this.doc.execCommand('insertunorderedlist', false, null);
        }

        this.win.focus();
    };


}, '0.0.1', []);