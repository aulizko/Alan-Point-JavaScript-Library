AP.add('editArea', function (A) {
    var $ = A.Query, L = A.Lang;
    A.EditArea = A.Widget.extend({
        init : function (o) {
            this.conf = {};
            var t = this.conf.target = $(o.target);
            
            this.conf.iframeCssClass = o.iframeCssClass || 'textarea';
            this.conf.initialValue = (L.isValue(t[0].value)) ? t[0].value : t.html();
            this.conf.parent = t.parent();
            this.conf.height = t.height();
            this.conf.width = t.width();
                
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
            var d = $(this.conf.doc);
            d.
            $j(EditArea.fn.doc).keypress(function (event) { raiseEvent('iframeKeyPress'); });
            $j(EditArea.fn.doc).keyup(function (event) { raiseEvent('iframeKeyUp'); });
            $j(EditArea.fn.doc).mouseup(function (event) {raiseEvent('iframeMouseUp'); });
            $j(EditArea.fn.doc).mousedown(function (event) {raiseEvent('iframeMouseDown'); });
            $j(EditArea.fn.doc).focus(function (event) { raiseEvent('iframeFocus'); });
            // TODO: think, is there way to transfer pressed key into the event
            $j(EditArea.fn.doc).keydown(function (event) { EditArea.fn.detectPaste(event); return true; });
            // TODO: check drag events handling in the jQuery framework
            if (EditArea.fn.doc.addEventListener) {
                EditArea.fn.doc.addEventListener('dragexit', function (event) { 
                    EditArea.fn.acceptableChildren(EditArea.fn.body); 
                    if ($j.browser.mozilla) { 
                        EditArea.fn.convertSPANs(); 
                    } 
                    EditArea.fn.input.value = EditArea.fn.body.innerHTML;

                    // Final cleanout for MS Word cruft
                    EditArea.fn.input.value = EditArea.fn.input.value.replace(/<\?xml[^>]*>/g, "");
                    EditArea.fn.input.value = EditArea.fn.input.value.replace(/<[^ >]+:[^>]*>/g, "");
                    EditArea.fn.input.value = EditArea.fn.input.value.replace(/<\/[^ >]+:[^>]*>/g, "");

                    EditArea.fn.doc.getElementsByTagName("body")[0].innerHTML = EditArea.fn.input.value;
                }, true);
            }
            
//                var theForm = $j(EditArea.fn.extraInput).parent('form').get(0);
            var theForm = $j(EditArea.fn.extraInput).parents('form').get(0);
            var oldOnsubmit = null;
            // TODO: extract form submition overriding to another method
            console.log(theForm);
            /* Find the parent form element */
            while (theForm.nodeName.toLowerCase() != "form") {
                theForm = theForm.parentNode;
            }

            /* Add onsubmit without overwriting existing function calls */
            oldOnsubmit = theForm.onsubmit;

            if (typeof theForm.onsubmit != "function") {
                theForm.onsubmit = function() {
                    return EditArea.fn.updateInput();
                }
            } else {
                theForm.onsubmit = function() {
                    EditArea.fn.updateInput();
                    return oldOnsubmit();           
                }
            }
        }
    });
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.2' }
]);