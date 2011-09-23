AP.add('widget.editor.textFormat', function(A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    // add state checker
    E.StateChecker.adoptStateChecker({
        name : 'textFormat',
        defaultValue : 'p',
        checker : function (node) {
            var headingsNodeNames = { 'h1' : true, 'h2' : true, 'h3' : true, 'h4' : true, 'h5' : true };
            var nodeName = node.nodeName.toLowerCase();

            if (nodeName in headingsNodeNames) {
                return nodeName;
            } else {
                return 'p';
            }
        }
    });

    /**
     * Place provided tag around selection
     * @method formatText
     * @param action {String} tag to place around the selection (h1-h3, p, without brackets)
     */
    E.EditArea.prototype.formatText = function (action) {
        this.doc.execCommand('formatBlock', false, action);
        this.win.focus();
    };

    

}, '0.0.1', []);