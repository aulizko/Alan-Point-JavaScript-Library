AP.add('widget.editor.editArea', function (A) {

    /* Constants and quick references */
    var E = A.namespace('Widget.Editor'),
        L = A.Lang,
        $ = A.Query,
        TEXT_NODE_TYPE = 3,
        ELEMENT_NODE_TYPE = 1,
        Formatter = A.Widget.Editor.Formatter,
        T = A.TemplateEngine;

    /* Iframe and designMode-related templates */
    var editAreaTemplate = {
            name : 'editArea:iframe',
            body : '<iframe class="%{cssClass}" frameborder="0" height="%{height}" width="%{width}"></iframe>'
        },
        cssLinkTemplate = {
            name : 'cssLink',
            body : '<link rel="stylesheet" type="text/css" media="screen" href="%{pathToStylesheet}" />'
        },
        initialHTMLTemplate = {
            name : 'editArea:initialHTML',
            body : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><'+'?xml version="1.0" encoding="UTF-8"?'+'><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">%{%include cssLink, pathToStylesheet}</head><body class="editArea">%{content}</body></html>'
        };
    
    T.compileTemplate(editAreaTemplate.body, editAreaTemplate.name);
    T.compileTemplate(initialHTMLTemplate.body, initialHTMLTemplate.name);
    T.compileTemplate(cssLinkTemplate.body, cssLinkTemplate.name);

    /* navigation and meta keys */
    var KEYS = {
        /* arrows */
        37 : true,
        38 : true,
        39 : true,
        40 : true,
        /* home */
        36 : true,
        /* end */
        35 : true,
        /* pageUp/down */
        33 : true,
        /* meta */
        16 : true,
        17 : true,
        18 : true,
        19 : true,
        20 : true,
        224 : true,
        91 : true,
        92 : true,
        144 : true /* numlock*/,
        145 : true /* scrolllock */,
        45 : true /*insert */,
        9 : true /* tab */,
        27 : true /* esc */,
        /* functional keys */
        112 : true,
        113 : true,
        114 : true,
        115 : true,
        116 : true,
        117 : true,
        118 : true,
        119 : true,
        120 : true,
        121 : true,
        122 : true,
        123 : true
    };


    E.EditArea = A.Class.extend({
        mixins : [
            A.Interface.Options,
            A.util.Event.Observable
        ],

        dirty : false,

        options : {
            target : 'textarea',
            iframeCssClass : 'editedBlock',
            excludes: [],
            pathToStylesheet : [
                {
                    pathToStylesheet : '/css/main-1.css'
                },
                {
                    pathToStylesheet : '/css/clicheEditor-1.css'
                }
            ],
            markupRole : false,
            height : false,
            width : false
        },

        state : null,

        /**
         * Constructor of the edit area
         * @method init
         * @param conf {Object} hash which contains a number of params:
         * <ul>
         * <li>target {HTMLDOMElement|String} div or textarea which we want to transorm or css-selector to grab it with A.Query. You don't need to warry about it - it should be hided from your sight for a while, but it should be returned back. Default css selector is 'textarea' (yeah, all textareas shoul became iframes)</li>
         * <li>iframeCssClass {String} css class which should be applyed to the iframe. Default to "textarea"</li>
         * <li>exclude {Array} array of css-selectors of elements which should be excluded from orgiginal DOM element and should not been transmitted into new iframe. Should not been applyed if textarea provided</li>
         * <li>height {Number} height of the newly created editArea. Default to 80% of the clinent desktop height.</li>
         * <li>width {Number} width of the newly created editArea. Defaults equal to the with of the replaced DOM element.</li>
         * <li>pathToStyleSheet {String} path to iframe's inner css class</li>
         * <li>markupRole {Boolean} has user markup role or note. From it depends, should wysiwyg turn html to "designMode = on" surrogate, or not. Default to false</li>
         * </ul>
         */
        init : function (conf) {
            A.stamp(this);

            this.setOptions(conf);

            this.targetElement = $(this.options.target);

            this.parent = this.targetElement.parent();

            this.definePlaceHolderType();

            this.getInitialValue();

            /* Define height and width of the newly created edit area */
            this.options.height = (this.options.height) ? this.options.height : Math.round(($(A.config.win).height() * 80) / 100);
            this.options.width = (this.options.width) ? this.options.width : this.targetElement.width();

            /* build iframe with provided params */
            this.iframe = $(T.processTemplate(editAreaTemplate.name, [{
                cssClass : this.options.iframeCssClass,
                height : this.options.height,
                width : this.options.width
            }]));

            this.iframe.insertBefore(this.targetElement);
            /* and hide target */
            this.targetElement.hide();

            var html = T.processTemplate(initialHTMLTemplate.name, [{
                pathToStylesheet : this.options.pathToStylesheet,
                content : this.value
            }]);

            var theDocument = this.doc = (this.iframe[0].contentDocument || this.iframe[0].contentWindow.document);

            this.win = this.iframe[0].contentWindow;

            theDocument.open();
            theDocument.write(html);
            theDocument.close();
            theDocument.contentEditable = 'true';

            this.body = theDocument.body;

            try {
                theDocument.designMode = 'on';
            } catch ( e ) {
                // Will fail on Gecko if the editor is placed in an hidden container element
                // The design mode will be set ones the editor is focused

                $(theDocument).focus(function() {
                    theDocument.designMode = 'on';
                });
            }
            
            try {
                theDocument.execCommand("styleWithCSS", 0, false);
            } catch (e) {
                theDocument.execCommand("useCSS", false, true);
            }
            // Set various midas options in Gecko (Taken directly from tinyMCE/Editor.js)
            try {theDocument.execCommand('enableInlineTableEditing', false, false);} catch (ex) {}
            try {theDocument.execCommand('enableObjectResizing', false, false);} catch (ex) {}

            this.initializeEventListeners();

            this.focus();


        },

        /**
         * Check placeholder type to define current size of the images pasted inside edit area
         * @method definePlaceHolderType
         */
        definePlaceHolderType : function () {
            var placeHolder,
                placeHolderClassName;


            placeHolder = this.targetElement.parents('.placeholder');
            placeHolderClassName = (placeHolder.length) ? placeHolder[0].className : 'center';

            // check if we are on the inner or main page:
            this.placeHolderType = {
                main : (!$('.leftAndCenterPlaceholders .innerPageCenterPlaceholderWrapper').length),
                domain : location.pathname == '/5' || location.pathname == '/3' || location.pathname == '/2',
                orientation : (/left/i.test(placeHolderClassName)) ? 'left' : (/right/i.test(placeHolderClassName) ? 'right' : 'center' ) || 'center'
            };
        },
        /**
         * Get initial value from the target element, strip all excludes dom elements from it and convert text nodes to paragraphs (todo: move last option to the formatter)
         * @method getInitialValue
         */
        getInitialValue : function () {
            var children;
            if (L.isValue(this.targetElement[0].value)) {
                var helperNode = AP.config.doc.createElement('div');
                helperNode.innerHTML = this.targetElement.val();

                children = A.Array(helperNode.childNodes, null, true);

            } else {
                children = A.Array(this.targetElement[0].childNodes, null, true);
            }



            var result = [],
                excludesSelector;

            if ('0' in this.options.excludes || 0 in this.options.excludes) {
                var i = 0, exclude, excludesProxyObject = [];
                while (exclude = this.options.excludes[i++]) {
                    excludesProxyObject.push(exclude);
                }

                this.options.excludes = excludesProxyObject;
            }


            excludesSelector = (this.options.excludes.length) ? ':not(' + this.options.excludes.join(', ') + ')' : 0;
            
            A.Array.each(children, function (node) {
                if (!node) { return; }

                if (node.nodeType == TEXT_NODE_TYPE) {

                    if (!A.String.trim(node.nodeValue)) {
                        node.parentNode.removeChild(node);
                    } else {
                        // wrap node with "p" tag
                        var tempNode = A.config.doc.createElement('p');

                        node.parentNode.replaceChild(tempNode, node);

                        tempNode.appendChild(node);

                        node = tempNode;

                        delete tempNode;
                    }
                }

                var $node = $(node);

                if (excludesSelector && !$node.is(excludesSelector)) { return; }

                result.push($node.remove()[0]);
            }, this);

            var helper = A.config.doc.createElement('div');

            A.Array.each(result, function (node) {
                helper.appendChild(node);
            }, this);

            this.value = (this.options.markupRole) ? helper.innerHTML : Formatter.prepareHTMLForEditing(helper.innerHTML); // todo rename formatter method name;
        },

        focus : function () {
            this.iframe[0].contentWindow.focus();
        },

        /**
         * Bind event listeners to the iframe (in current version, all that we need - mouseup, keyup, focus.
         * @method initializeEventListeners
         */
        initializeEventListeners : function () {
            var boundedCheckState = this.checkState.bind(this),
                boundedRunFixes = this.runFixes.bind(this);
            
            $(this.doc).bind('mouseup keyup focus', function (e) {
                boundedCheckState(e);
                boundedRunFixes(e);
            });
        },
        /**
         * Get start, end and root container of text selection (adopted from article "пишем правильлный визивиг", http://xpoint.ru/know-how/WYSIWYG/TrueJavaScriptEditor?comments#comments
         * @method getSelectionBounds
         */
        getSelectionBounds : (A.Browser.trident) ?
            function () {} :
            function () {
                var range,
                    root,
                    start,
                    end,
                    collapsed,
                    result = {
                        root : this.doc,
                        start : this.doc,
                        end : null,
                        currentNode : this.doc
                    },
                    selection = this.win.getSelection();

                range = selection.getRangeAt(0);

                start = result.start = range.startContainer;
                end = result.end = range.endContainer;
                collapsed = result.collapsed = range.collapsed;

                result.startOffset = range.startOffset;
                result.endOffset = range.endOffset;
                root = result.root = range.commonAncestorContainer;

                var currentNode = root;

                if (start.nodeName.toLowerCase() == "body") { return null; };
                // если узлы текстовые, берем их родителей
                if (start.nodeName == "#text") { start = start.parentNode; }
                if (end.nodeName == "#text") { end = end.parentNode; }

                if (start == end) { root = start; }

                // handle image node selection or other control-like element, such as anchors
                // "inspired" from tinyMCE version 2009-03-04 20:45:44Z Selection.js line 691
                if (!collapsed) {
                    if (A.Browser.webkit && selection.anchorNode && selection.anchorNode.nodeType == ELEMENT_NODE_TYPE) {
                        currentNode = selection.anchorNode.childNodes[selection.anchorOffset];
                    }

                    if (start == end && (result.endOffset - result.startOffset < 2) && start.hasChildNodes()) {
                        currentNode = start.childNodes[result.startOffset];

                    }
                }

                // get text of the selection
                result.text = range.toString() || '';

                if (currentNode && currentNode.nodeType === 3) {
                    currentNode = currentNode.parentNode;
                }

                result.currentNode = currentNode;

                return this.selectionBounds = result;
            },

        checkState : function (/* Event */e) {
            this.getSelectionBounds();
            var workingState = A.Reflection.deepCopy(E.StateChecker.defaultState);

            var node = this.selectionBounds.currentNode,
                nodeName; // todo: check if start (or end) container is better suite our purposes

            workingState.text = this.selectionBounds.text;

            while (node && (nodeName = node.nodeName.toLowerCase()) && nodeName != 'body' && nodeName != '#document') {
                workingState = A.extend(workingState, E.StateChecker.runChecks(node));
                node = node.parentNode;
            }

            // check if current state difference from cached state and if true, publish "stateChanged" event
            if (!L.compare(this.state, workingState)) {
                this.state = workingState;
                this.dirty = true;
            }

            if (e.type == 'keyup') {
                this.checkTyping(e.which);
            }

            if (this.dirty) {
                this.publish('stateChanged', [this.state]);
                this.dirty = false;
            }
        },

        checkTyping : (A.Browser.trident) ?
            function () {} :
            function (keyCode) {
                // todo: rewrite to the execCommand unlink/insertLink
                // check if user pressed non-functional, esc or caret position (home, arrow, etc.) key
                if (KEYS[keyCode]) { return; }

                A.Object.each(E.EditArea.typingChecks, function (check) {
                    check.call(this);
                }, this);
            },
        
        
        
        indent : function () {
            if (this.state.orderedList || this.state.unOrderedList) {
                this.doc.execCommand('indent', false, []);
            }

            setTimeout(this.fixIndex.bind(this), 0);

            this.focus();
        },

        outdent : function () {
            if (this.state.orderedList || this.state.unOrderedList) {
                this.doc.execCommand('outdent', false, []);
            }

            setTimeout(this.fixIndex.bind(this), 0);

            this.focus();
        },

        fixIndex : function () {
            var self = this;
            $('blockquote > ol', this.doc).each(function () {
                var $this = $(this),
                    blockquote = $this.parents('blockquote');

                blockquote.replaceWith($this);

                var selection = self.win.getSelection();
                var range = self.doc.createRange();

                range.setStart($this[0].firstChild, 0);
                range.setEnd($this[0].lastChild, 0);

                selection.removeAllRanges();
                selection.addRange(range);
            });

            $('blockquote > ul', this.doc).each(function () {
                var $this = $(this),
                    blockquote = $this.parents('blockquote');

                blockquote.replaceWith($this);

                var selection = self.win.getSelection();
                var range = self.doc.createRange();

                range.setStart($this[0].firstChild, 0);
                range.setEnd($this[0].lastChild, 0);

                selection.removeAllRanges();
                selection.addRange(range);
            });
        },

        save : function(callback) {
            $.post('/rest/sanitize', { source : AP.Widget.Editor.Formatter.prepareHTMLForSave(this.body.innerHTML) }, function (result) {
                if (result.error) {
                    callback(result);
                } else {
                    var resultHTml = result.entity;

                    this.targetElement.append(resultHTml);

                    this.iframe.remove();
                    this.targetElement.show();
                    this.value = resultHTml;
                    callback(resultHTml);
                }
            }.bind(this),
            'json');
        },
        /**
         * Run fixes which we adopted from appropriate method earlier
         * @method runFixes
         */
        runFixes : function () {
            A.Object.each(E.EditArea.fixesList, function (fix) {
                fix.call(this);
            }, this);
        }

    });


    /**
     * add fix function to the fix list, which wil be used to fix some designMode strange allutions
     * @method adoptFix
     * @static
     * @param o {Object} hash which contains following params:
     * <ul><li>name {String} name of the fix (just in case)</li>
     * <li>fn {Function} function which will run through dom (it shall receive EditArea as "this")</li></ul>
     */
    E.EditArea.adoptFix = function (o) {
        if (!this.fixesList[o.name]) {
            this.fixesList[o.name] = o.fn;
        }
    };

    E.EditArea.adoptTypingCheck = function (o) {
        if (!this.typingChecks[o.name]) {
            this.typingChecks[o.name] = o.fn;
        }
    };

    E.EditArea.fixesList = {};

    E.EditArea.typingChecks = {};

}, '2.0.1', [
    { name : 'browser', minVersion : '0.0.3' },
    { name : 'array', minVersion : '1.1.0' },
    { name : 'string', minVersion : '0.0.2' },
    { name : 'templateEngine', minVersion : '0.0.2'},
    { name : 'query', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.2' },
    { name : 'interface.options', minVersion : '0.0.1' },
    { name : 'widget.editor.formatter', minVersion : '0.0.1' }
]);