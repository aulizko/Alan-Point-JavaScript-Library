AP.add('widget.editor.objectIcon', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query,
        objectWithIConClassNames = {
            mailIcon : true,
            phoneIcon : true,
            squareIcon : true,
            historyDateIcon : true,
            populationIcon : true,
            celebrationIcon : true
        };

    var objectIconTemplate = {
        body : '<div class="%{cssClass}"><span id="%{uniqueID}">Вставьте текст</span></div>',
        name : 'objectIcon'
    };

    A.TemplateEngine.compileTemplate(objectIconTemplate.body, objectIconTemplate.name);

    E.StateChecker.adoptStateChecker({
        name : 'objectIcon',
        defaultValue : false,
        checker : function (node) {
            var nodeName = node.nodeName.toLowerCase();


            if ((nodeName == 'div' || nodeName == 'a') && node.className in objectWithIConClassNames) {
                return AP.String.trim(node.className);
            }

            return false;

        }
    });

    E.EditArea.prototype.addObject = function (type) {
        var uniqueID = A.generateUID();
        var html = A.TemplateEngine.processTemplate(objectIconTemplate.name, [{
            cssClass : type,
            uniqueID : uniqueID
        }]);

        this.doc.execCommand('insertHTML', false, html);

        // place user caret at the right place
        var tempElement = this.doc.getElementById(uniqueID),
            children = tempElement.childNodes,
            target;

        for (var i = 0, length = children.length; i < length; i++) {
            var node = children[i];
            if (node.nodeType && node.nodeType == 3 && node.nodeValue && A.String.trim(node.nodeValue.toString()).length) {
                target = node;
                break;
            }
        }

        if (target) {
            tempElement.parentNode.replaceChild(target, tempElement);
            delete tempElement;
            
            var range = this.doc.createRange();

            range.setStart(target, 0);
            range.setEnd(target, target.nodeValue.length);

            var selection = this.win.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            this.runFixes();
        }

        this.focus();
    };

    E.EditArea.prototype.deleteObject = function () {
        var node = $(this.selectionBounds.currentNode);

        if (!node.is('div')) {
            node = node.parent('div');
        }

        if (node.attr('className') in objectWithIConClassNames) {

            try {
                var range, selection;

                range = this.doc.createRange();
                if (node) {
                    range.selectNode(node[0]);
                }

                selection = this.win.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                range.deleteContents();

                this.focus();
            } catch (e) { /* ignore right now */ };
        }
    };

    function prepareHTMLForSave () {
        // removing fixing br's from div
        if (AP.Browser.gecko) {
            $('div', $(this.workingObject)).each(function () {
                // remove last inner br
                var $this = $(this), neighbore;
                $this.children('br:last').remove();

                // remove next br (we don't need it on production mode, cause div is block element);
                neighbore = $this.next();

                if (neighbore.is('br')) {
                    neighbore.remove();
                }
                neighbore = $this.prev();

                if (neighbore.is('br')) {
                    neighbore.remove();
                }
            });
        }
    };

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));

}, '0.0.1', []);