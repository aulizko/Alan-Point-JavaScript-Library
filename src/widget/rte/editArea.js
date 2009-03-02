AP.add('editArea', function (A) {
    var $ = A.Query, 
        L = A.Lang,
        mediatorDummy = { updateState : function () {} };
    A.EditArea = A.Widget.extend({
        init : function (o) {
            this.conf = {};
            
            var t = this.conf.target = $(o.target);
            
            this.conf.iframeCssClass = o.iframeCssClass || 'textarea';
            this.conf.initialValue = (L.isValue(t[0].value)) ? t[0].value : t.html();
            this.conf.parent = t.parent();
            this.conf.height = t.height();
            this.conf.width = t.width();
            
            this.conf.mediator = o.mediator || mediatorDummy;
                
            var i = this.conf.iframe = $('<iframe class="' + this.conf.iframeCssClass + ' block" frameborder="0" height="' + this.conf.height + '" width="' + this.conf.width + '"></iframe>'),
                h = this.conf.input = $('<input type="hidden" name="editArea%UNIQUE_ID%" value=""></input>'); // create input which value we will pass through the form
            // get values from config object, replace its with defaults, if needed
            this.conf.pathToStylesheet = o.pathToStyleSheet || '/css/clicheEditor.css';
            
            t.replaceWith(i);
            t.remove();
            t = null;
            delete t;
            
            this.conf.target = null;
            delete this.conf.target;
            
            this.conf.parent.append(h);// append iframe to the root element
            
            var html = '<'+'?xml version="1.0" encoding="UTF-8"?'+'><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body>INITIAL_CONTENT</body></html>';
            var style = '<link rel="stylesheet" type="text/css" media="screen" href="' + this.conf.pathToStylesheet + '" />';

            var d = this.conf.doc = i[0].contentWindow.document;
            
            d.open();
            d.write(html
              .replace(/INITIAL_CONTENT/, this.conf.initialValue)
              .replace(/STYLE_SHEET/, style));
            d.close();
            d.contentEditable = 'true';
            
            this.conf.body = d.body;
            
            try {
                d.designMode = 'on';
            } catch ( e ) {
                // Will fail on Gecko if the editor is placed in an hidden container element
                // The design mode will be set ones the editor is focused

                $(d).focus(function() {
                    d.designMode = 'on';
                });
            }
            
            this.backupSelection = {};
            
            this.initializeBackupSelection();
            
            this.initializeEventListeners();
            
            this.focusWindowOnLoad();
        },
        focusWindowOnLoad : function () {
            var doc = this.conf.doc;
            if (A.Browser.webkit) {
                doc.getSelection().setBaseAndExtent(doc.body.firstChild, 0, doc.body.firstChild, 1);
                if (A.Browser.webkit && (A.Browser.version > 420)) {
                    doc.getSelection().collapseToStart();
                } else {
                    doc.getSelection().collapse(false);
                }
            } else {
                this.conf.iframe[0].contentWindow.focus();
            }
        },
        initializeBackupSelection : function () {
            var body = this.conf.body,
                b = this.backupSelection;
            b.startContainer = body;
            b.startOffset = 0;
            b.endContainer = body;
            b.endOffset = 0;
            b.selectionValue = '';
            b.commonAncestorContainer = body;
            b.collapsed = true;
        },
        initializeEventListeners : function () {
            var d = $(this.conf.doc), self = this;
            d.bind('mouseup keyup focus', function () {
                self.observeSelection();
            });
        },
        observeSelection : function () {
            var b = this.backupSelection,
                state = {
                    img : false,
                    link : false,
                    strong : false,
                    emphasis : false,
                    orderedList : false,
                    unOrderedList  :false,
                    heading : false,
                    text : '',
                    table : false
                };
                
            this.rememberSelection();
            if (b.selectedElement && b.selectedElement.nodeName.toLowerCase() == 'img') {
                // If we stay on the image node
                // Also, we will gain same result if we stay on the select html element, 
                // but we cannot receive it for now, so, we don't need to worry about it.
                state.img = { source : b.selectedElement.src, alternate : b.selectedElement.alt };
            } else {
                // Any other elements
                var theParentNode = b.commonAncestorContainer;
                if (theParentNode.nodeType == 3) {
                    state.text = b.selectionValue;
                    theParentNode = theParentNode.parentNode;
                }

                while (theParentNode.nodeName.toLowerCase() != 'body') {
                    var nodeName = theParentNode.nodeName.toLowerCase();
                    switch (nodeName) {
                        case 'a': 
                            $parentNode = $(theParentNode);
                            state.link = { source : $parentNode.attr("href"), text : $parentNode.text() };
                            break;
                        case 'strong':
                            state.strong = true;
                            break;
                        case 'em':
                            state.emphasis = true;
                            break;
                        case 'ol':
                            state.orderedList = true;
                            break;
                        case 'ul':
                            state.unOrderedList = true;
                            break;
                        case 'table':
                            state.table = {
                                visible : theParentNode.className != 'personTable'
                            };
                            
                            break;
                        case 'h1':
                        case 'h2':
                        case 'h3':
                            state.heading = nodeName;
                            break;
                        case 'span':
                            if (theParentNode.getAttribute("style") == "font-weight: bold;") {
                                state.strong = true;
                            }
                            else if (theParentNode.getAttribute("style") == "font-style: italic;") {
                                state.emphasis = true;
                            }
                            else if (theParentNode.getAttribute("style") == "font-weight: bold; font-style: italic;") {
                                state.strong = true;
                                state.emphasis = true;
                            }
                            else if (theParentNode.getAttribute("style") == "font-style: italic; font-weight: bold;") {
                                state.strong = true;
                                state.strong = true;
                            }
                            break;
                    }
                    theParentNode = theParentNode.parentNode;
                }
            }
            this.conf.mediator.updateState(state);
        },
        rememberSelection : function () {
            // TODO: make crossbrowser selection. 
            var b = this.backupSelection;
            var selection = b.selection = this.conf.iframe[0].contentWindow.getSelection();
            var range = b.range = this.getRange();
            
            var selectionValue = b.selectionValue = range.toString();
            var commonAncestorContainer = b.commonAncestorContainer = range.commonAncestorContainer;
            
            var startContainer = b.startContainer = range.startContainer;
            var endContainer = b.endContainer = range.endContainer;
            var startOffset = b.startOffset = range.startOffset;
            var endOffset = b.endOffset = range.endOffset;
            var collapsed = b.collapsed = ((this.startContainer == this.endContainer) && (this.startOffset == this.endOffset)) ? true : false;
            // check if current element is control, i.e. img, select and all that
            var nodeType = 'Text';
            if ( startContainer == endContainer && ( endOffset - startOffset) == 1 && startContainer.nodeType != Node.TEXT_NODE) {
                nodeType = b.nodeType = 'Control';
            }
            var selectedElement = b.selectedElement = null;
            if (nodeType == 'Control') {
                selectedElement = b.selectedElement = selection.anchorNode.childNodes[selection.anchorOffset];
            }
        },
        getRange : function () {
            var sel = this.backupSelection.selection;
            if (sel === null) {
                return null;
            }

            if (A.Browser.webkit && !sel.getRangeAt) {
                var range = this.conf.doc.createRange();
                try {
                    range.setStart(sel.anchorNode, sel.anchorOffset);
                    range.setEnd(sel.focusNode, sel.focusOffset);
                } catch (e) {
                    range = this.conf.iframe[0].contentWindow.getSelection()+'';
                }
                return range;
            }

            if (A.Browser.trident || A.Browser.presto) {
                return sel.createRange();
            }

            if (sel.rangeCount > 0) {
                return sel.getRangeAt(0);
            }
            return null;
        },
        setMediator : function (mediator) {
            this.conf.mediator = mediator;
        },
        restoreSelection : function () {
            var range = this.conf.doc.createRange(), 
                b = this.backupSelection;
                
            range.setStart(b.startContainer, (b.startOffset) );
            if (!b.endContainer || !b.endOffset) {
                range.setEnd(b.startContainer, b.startOffset);
            } else {
                range.setEnd(b.endContainer, b.endOffset);
            }
            if (b.collapse) {
                range.collapse(true);
            }
            var localSelection = this.conf.iframe[0].contentWindow.getSelection();

            localSelection.removeAllRanges();
            localSelection.addRange(range);
        }
    });
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.2' }
]);