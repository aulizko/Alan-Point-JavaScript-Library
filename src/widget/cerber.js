AP.add('widget.editor.table', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    var unAvailableTags = {
        "ABBR":true,
        "ACRONYM":true,
        "ADDRESS":true,
        "APPLET":true,
        "AREA":true,
        "B":true,
        "BASE":true,
        "BASEFONT":true,
        "BDO":true,
        "BIG":true,
        "BODY":true,
        "BUTTON":true,
        "CAPTION":true,
        "CENTER":true,
        "CITE":true,
        "CODE":true,
        "COL":true,
        "COLGROUP":true,
        "DD":true,
        "DEL":true,
        "DIR":true,
        "DFN":true,
        "DL":true,
        "DT":true,
        "FIELDSET":true,
        "FONT":true,
        "FORM":true,
        "FRAME":true,
        "FRAMESET":true,
        "HEAD":true,
        "HR":true,
        "HTML":true,
        "I":true,
        "IFRAME":true,
        "INPUT":true,
        "INS":true,
        "ISINDEX":true,
        "KBD":true,
        "LABEL":true,
        "LEGEND":true,
        "LINK":true,
        "MAP":true,
        "MENU":true,
        "META":true,
        "NOFRAMES":true,
        "NOSCRIPT":true,
        "OBJECT":true,
        "OPTGROUP":true,
        "OPTION":true,
        "PARAM":true,
        "PRE":true,
        "Q":true,
        "S":true,
        "SAMP":true,
        "SCRIPT":true,
        "SELECT":true,
        "SMALL":true,
        "SPAN":true,
        "STRIKE":true,
        "STYLE":true,
        "SUB":true,
        "SUP":true,
        "TEXTAREA":true,
        "TITLE":true,
        "TT":true,
        "U":true,
        "VAR":true,
        "XMP":true
    };

    function prepareHTMLForSave () {
        $('*', this.workingObject).each(function () {
            var $this = $(this);
            if (this.nodeName in unAvailableTags || this.nodeType == 10 || this.nodeType == 8) {
                $this.replaceWith($this.children());
            } else {
                this.removeAttribute('style');
            }
        });
    };

    E.Formatter.subscribe('prepareHTMLForSave', prepareHTMLForSave.bind(E.Formatter));

}, '0.0.1', []);