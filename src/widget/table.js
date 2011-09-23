AP.add('widget.editor.table', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    // constants

    var DEFAULT_TEXT_OF_NEW_DOCKLET = 'Новый текст';

    E.StateChecker.adoptStateChecker({

        name : 'table',
        defaultValue : false,

        checker : function (node) {
            if (node && node.nodeName === 'TABLE') {
                var className = node.className;

                return {
                    className : (className.length) ? className : 'regular',
                    hasHeader : !!$(node).find('tr:first th').length
                };
            }
        }

    });

    E.EditArea.prototype.addTable = function (type, addHeader) {
        var rows = 2,
            cols = 2,
            dockletWidth = Math.round(100 / cols), 
            html = '<table width="100%" cellpadding="0" cellspacing="0"', i = 0, j = 0;


        // check type of the table
        switch (type) {
            case 'format' :
                html += 'class="format">';
                break;
            case 'twoColumns' :
                html += ' class="twoColumns">';
                break;
            case 'vertical' :
                html += 'class="vertical">';
                break;
            default :
                html += '>';
        }

        for (; i < rows; i++) {
            html += '<tr>';

            for (; j < cols; j++) {
                html += '<';
                if (addHeader && (i == 0)) {
                    html += 'th';
                } else {
                    html += 'td';
                }
                html += ' width="' + dockletWidth + '%">&nbsp;</td>';
            }

            html += '</tr>';
            j = 0;
        }

        html += '</table>';

        this.doc.execCommand('insertHTML', false, html);

        this.focus();
    };

    E.EditArea.prototype.deleteTable = function () {
        var el = $(this.selectionBounds.root);

        if (!el.is('table')) {
            el = el.parents('table');
        }

        if (!el.length) { return; }

        var range = this.doc.createRange();
        range.selectNode(el[0]);
        range.deleteContents();

        this.focus();
    };

    E.EditArea.prototype.defineCurrentTablePosition = function () {
        var dataCell,
            row;
        
        if (!this.state.table) { return {}; }
        // define current row and docklet index
        var el = $(this.selectionBounds.root);

        if (!el.is('td') || !el.is('th')) { // which is almost everytime true
            el = el.parents('td');
            if (el.length && el.is('td')) {
                dataCell = el;
            } else {
                el = $(this.selectionBounds.root).parents('th');
                if (el.length && el.is('th')) {
                    dataCell = el;
                }
            }
        }

        if (!el.is('tr')) {
            el = el.parents('tr');
        }

        if (el.is('tr')) {
            row = el;
        }

        if (el.length) {// assume that we are inside some row
            var table = row.parents('table'),
                rowIndex = table.find('tr').index(row[0]),
                hasHeader = table.find("tr:first th").length > 0,
                dataCellTagName = 'td',
                dataCells,
                numberOfDataCells,
                index;


            if ((rowIndex == 0) && hasHeader) {
                dataCellTagName = 'th';
            }

            dataCells = row.find(dataCellTagName);

            // define how many doclets contains current row
            numberOfDataCells = dataCells.length;

            index = dataCells.index(dataCell[0]);
        }

        return {
            docklet : dataCell,
            row : row,
            index : index,
            numberOfDocklets : numberOfDataCells,
            docklets : dataCells,
            rowIndex : rowIndex,
            hasHeader : hasHeader
        };
    };

    E.EditArea.prototype.prependRow = function () {
        var position = this.defineCurrentTablePosition();

        if (!position.row || !position.row.length) { return; }

        var temp = '<tr>',
            dockletWidth = Math.round(100 / position.numberOfDocklets),
            whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET),
            i,
            length,
            newDocklet;

        if (position.rowIndex == 0 && position.hasHeader) {
            for (i = 0, length = position.numberOfDocklets; i < length; i++) {
                temp += '<th width="' + dockletWidth + '%">&nbsp;</td>';
            }

            temp += '</tr>';


            temp = $(temp, this.doc);

            temp.insertBefore(position.row);

            position.row.html(position.row.html().replace(/<([\/]?)(th)([^>]*?)>/ig, '<$1td$3>'));

            newDocklet = temp.find('th:eq(' + position.index + ')')[0];
        } else {
            for (i = 0, length = position.numberOfDocklets; i < length; i++) {
                temp += '<td width="' + dockletWidth + '%">&nbsp;</td>';
            }

            temp += '</tr>';


            temp = $(temp, this.doc);

            temp.insertBefore(position.row);

            // make newly created row with docklet as same index new selection node
            newDocklet = temp.find('td:eq(' + position.index + ')')[0];
        }



        try {
            newDocklet.appendChild(whiteSpace);

            var selection = this.win.getSelection();
            var range = this.doc.createRange();
            range.setStart(whiteSpace, 0);
            range.setEnd(whiteSpace, 11);

            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {}

        this.focus();
    };

    E.EditArea.prototype.appendRow = function () {
        var position = this.defineCurrentTablePosition();

        if (!position.row || !position.row.length) { return; }

                // create new row with appropriate amounts of docklets
        var temp = '<tr>',
            dockletWidth = Math.round(100 / position.numberOfDocklets);

        for (var i = 0, length = position.numberOfDocklets; i < length; i++) {
            temp += '<td width="' + dockletWidth + '%">&nbsp;</td>';
        }

        temp += '</tr>';


        temp = $(temp, this.doc);

        temp.insertAfter(position.row);

        // make newly created row with docklet as same index new selection node
        var newDocklet = temp.find('td:eq(' + position.index + ')')[0],
            whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET);

        try {
            newDocklet.appendChild(whiteSpace);

            var selection = this.win.getSelection();
            var range = this.doc.createRange();
            range.setStart(whiteSpace, 0);
            range.setEnd(whiteSpace, 11);

            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {}

        this.focus();
    };

    E.EditArea.prototype.prependColumn = function () {
        var position = this.defineCurrentTablePosition(),
            target;

        if (!position.row || !position.row.length) { return; }

        // prepend to every row new docklet exactly before the docklet with same index and make new selection focused on the newly created docklet on the left

        var table = position.row.parents('table'),
            rows = table.find('tr'),
            newDockletWidth = Math.round(100 / (position.numberOfDocklets + 1));

        rows.each(function (rowIndex) {
            var row = $(this),
                dockletTagName = 'td';

            if ((rowIndex == 0) && position.hasHeader) {
                dockletTagName = 'th';
            }
            row.find(dockletTagName).each(function (index) {
                var $this = $(this);
                $this.attr('width', newDockletWidth + '%');
                if (index == position.index) {
                    $('<' + dockletTagName + ' width="' + newDockletWidth + '%">&nbsp;</td>').insertBefore($this);
                }
            });
        });

        var whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET);

        var dockletTagName = 'td';
        if (position.rowIndex == 0) {
            dockletTagName = 'th';
        }

        target = position.row.find(dockletTagName + ':eq(' + position.index + ')')[0];

        try {
            target.appendChild(whiteSpace);

            var selection = this.win.getSelection();
            var range = this.doc.createRange();
            range.setStart(whiteSpace, 0);
            range.setEnd(whiteSpace, 11);

            selection.removeAllRanges();
            selection.addRange(range);
        } catch(e) {}

        this.focus();
    };

    E.EditArea.prototype.appendColumn = function () {
        var position = this.defineCurrentTablePosition(),
            target;

        if (!position.row || !position.row.length) { return; }

        // prepend to every row new docklet exactly before the docklet with same index and make new selection focused on the newly created docklet on the left

        var table = position.row.parents('table'),
            rows = table.find('tr'),
            newDockletWidth = Math.round(100 / (position.numberOfDocklets + 1));

        rows.each(function (rowIndex) {
            var row = $(this),
                dockletTagName = 'td';

            if ((rowIndex == 0) && position.hasHeader) {
                dockletTagName = 'th';
            }
            row.find(dockletTagName).each(function (index) {
                var $this = $(this);
                $this.attr('width', newDockletWidth + '%');
                if (index == position.index) {
                    $('<' + dockletTagName + ' width="' + newDockletWidth + '%">&nbsp;</td>').insertAfter($this);
                }
            });
        });

        var whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET);

        var dockletTagName = 'td';
        if (position.rowIndex == 0) {
            dockletTagName = 'th';
        }

        target = position.row.find(dockletTagName + ':eq(' + position.index + 1 + ')')[0];

        try {
            target.appendChild(whiteSpace);

            var selection = this.win.getSelection();
            var range = this.doc.createRange();
            range.setStart(whiteSpace, 0);
            range.setEnd(whiteSpace, 11);

            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {}


        this.focus();
    };

    E.EditArea.prototype.deleteRow = function () {
        var position = this.defineCurrentTablePosition(),
            selection, range;

        if (!position.row || !position.row.length) { return; }

        // get next row as new "current row" (if there is no next row, take previous)
        var newRow = position.row.next('tr'),
            newRowIndex = position.rowIndex + 1,
            dockletTagName = 'td';

        if (!newRow.length) {
            newRow = position.row.prev('tr');
            newRowIndex = position.rowIndex - 1;
        }

        if ((newRowIndex == 0) && position.hasHeader) {
            dockletTagName = 'th';
        }



        if (newRow.length) {
            // remove target row
            position.row.remove();

            if ((position.rowIndex == 0) && position.hasHeader) {
                newRow.html(newRow.html().replace(/<([\/]?)(td)([^>]*?)>/ig, '<$1th$3>'));
            }

            // place caret on the same docklet as before into the new row
            var docklet = newRow.find(dockletTagName + ':eq(' + position.index + ')')[0];
            // check if docklet has text inside
            if (docklet) {
                if (docklet.childNodes.length) {
                    try {
                        selection = this.win.getSelection();
                        range = this.doc.createRange();
                        range.setStart(docklet.firstChild, 0);
                        range.setEnd(docklet.firstChild, 0);

                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch (e) {}
                } else {
                    var whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET);

                    try {
                        docklet.appendChild(whiteSpace);

                        selection = this.win.getSelection();
                        range = this.doc.createRange();
                        range.setStart(whiteSpace, 0);
                        range.setEnd(whiteSpace, 11);

                        selection.removeAllRanges();
                        selection.addRange(range);
                    } catch (e) {}
                }
            }


            this.focus();
        } else {
            // there is no more rows, so that we must delete table
            this.deleteTable();
        }
    };

    E.EditArea.prototype.deleteColumn = function () {
        var position = this.defineCurrentTablePosition(),
            newIndex, selection, range;

        if (!position.row || !position.row.length) { return; }

        if (position.index == (position.numberOfDocklets - 1)) { // assume that there is now next docklet, cause current docklet is last
            // try to get previous docklet
            if (position.index == 0) {
                // there is not previous docklet either. assume that there is only one column so that we need to delete table
                this.deleteTable();
                return;
            } else {
                newIndex = position.index - 1;
            }
        } else {
            newIndex = position.index + 1;
        }

        var dockletTagName = 'td';
        if ((position.row == 0) && position.hasHeader) {
            dockletTagName = 'th';
        }

        var newDockletWidth = Math.round(100 / (position.numberOfDocklets - 1)),
            newDocklet = position.row.find(dockletTagName + ':eq(' + newIndex + ')')[0];

        // delete docklet with current index from each rows
        $(position.row).parents('table').find('tr').each(function (rowIndex) {
            var dockletTagName = 'td';
            if ((rowIndex == 0) && position.hasHeader) {
                dockletTagName = 'th';
            }

            $(this).find(dockletTagName).each(function (index) {
                if (index == position.index) {
                    $(this).remove();
                }
                $(this).attr('width', newDockletWidth + '%');
            });
        });

        // place caret into new docklet
        if (newDocklet) {
            if (newDocklet.childNodes.length) {
               try {
                    selection = this.win.getSelection();
                    range = this.doc.createRange();
                    range.setStart(newDocklet.firstChild, 0);
                    range.setEnd(newDocklet.firstChild, 0);

                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (e) {}
            } else {
                var whiteSpace = this.doc.createTextNode(DEFAULT_TEXT_OF_NEW_DOCKLET);

                try {
                    newDocklet.appendChild(whiteSpace);

                    selection = this.win.getSelection();
                    range = this.doc.createRange();
                    range.setStart(whiteSpace, 0);
                    range.setEnd(whiteSpace, 11);

                    selection.removeAllRanges();
                    selection.addRange(range);
                } catch (e) {}
            }
        }


        this.focus();
    };

    function findTableByInnerElement (el) {
        if (!el.is('table')) {
            el = el.parents('table');
        }

        return (el.length) ? el : null;
    };

    E.EditArea.prototype.changeTableType = function (newClassName) {
        if (!this.state.table) { return; };

        var el = findTableByInnerElement($(this.selectionBounds.root));

        if (!el) { return; }

        el.attr('class', newClassName);
    };

    E.EditArea.prototype.toggleTableHeader = function () {
        var tableState = this.defineCurrentTablePosition(),
            el = findTableByInnerElement($(this.selectionBounds.root)),
            row,
            processingRow;

        if (!el) { return; }

        row = el.find('tr:first');
        processingRow = row.clone();

        if (tableState.hasHeader) {
            row.html(row.html().replace(/<([\/]?)(th)([^>]*?)>/ig, '<$1td$3>'));
        } else {
            row.html(row.html().replace(/<([\/]?)(td)([^>]*?)>/ig, '<$1th$3>'));
        }
    };

    E.EditArea.adoptFix({
        name : 'fixTables',
        fn : function () {
            if (AP.Browser.gecko) {

                AP.Array.each(this.doc.getElementsByTagName('table'), function (n) {
                    var pn = n.parentNode;

                    if ((E.Formatter.isBlock(pn) || pn.nodeName.toLowerCase() == 'body') && pn.lastChild == n) {

                        $(this.doc.createElement('p').appendChild(this.doc.createElement('br'))).appendTo(pn);
                    }
                }, this);
            }
        }
    });

    function prepareHTMLForEditing () {
        $('table', $(this.workingObject)).each(function () {
            var $this = $(this),
                numberOfDocklets = $this.find('tr:first td').length,
                dockletWidth = Math.round(100 / numberOfDocklets);

            $this.attr('width', '100%');

            var t = $this.clone();

            t.find('td, th').each(function () {
                var $this = $(this);

                $this.attr('width', dockletWidth + '%');
                if (AP.String.trim($this.html()).length == 0) {
                    $this.html('&nbsp;');
                }
            });

            $this.replaceWith(t);
        });
    };

    function prepareHTMLForSave() {
        $('table', $(this.workingObject)).each(function () {
            var pn = this.parentNode;

            if ((E.Formatter.isBlock(pn) || pn.nodeName.toLowerCase() == 'body') &&
                pn.lastChild && pn.lastChild.nodeName  && pn.lastChild.nodeName.toLowerCase() == 'p') {
                if ($(pn.lastChild).children().length == 1)
                $('<p><br /></p>').appendTo(pn);
            }


            var $this = $(this);

            var t = $this.clone();
            // clean spaces from the empty table docklets
            t.find('td, th').each(function () {
                var $this = $(this);

                $this.removeAttr("width"); // strip width atribute from table so that it should manage its width automatically
                if (AP.String.trim($this.html()).length == 0) {
                    $this.empty();
                }
                if (AP.String.trim($this.html()) == AP.String.trim($this.text())) { // text nodex is inside
                    $this.html(AP.String.trim($this.html()));
                }
                
            });

            $this.replaceWith(t);
        });
    };


    // add method to prepare html for editing

    E.Formatter.subscribe('prepareHTMLForEditing', prepareHTMLForEditing.bind(E.Formatter));

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));


}, '0.0.1', []);