AP.add('domManipulation', function (A) {
    A.DomManipulation = A.DomManipulation || {};
    
    var D = A.DomManipulation;
    
    var ie6 = A.Browser.trident == 6;
    
    var purge = function(d) {
        var a = d.attributes, i, l, n;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                purge(d.childNodes[i]);
            }
        }
    };
    
    var replaceHTML = (ie6) ?
        function (el, html) {
            el.innerHTML = html;
            return el;
        } :
        function (el, html) {
            var newEl = el.cloneNode(false);
            newEl.innerHTML = html;
            el.parentNode.replaceChild(newEl, el);
            /* Since we just removed the old element from the DOM, return a reference
            to the new element, which can be used to restore variable references. */
            return newEl;
        }
    
    D.setInnerHTML = (ie6) ?
        function (el, html, unsafe) {
            if (unsafe) {
                replaceHTML(el, html);
            } else {
                // prevent memory leaks - remove cycling links
                (function (o) {

                    var a = o.attributes, i, l, n, c;
                    if (a) {
                        l = a.length;
                        for (i = 0; i < l; i += 1) {
                            n = a[i].name;
                            if (typeof o[n] === 'function') {
                                o[n] = null;
                            }
                        }
                    }

                    a = o.childNodes;

                    if (a) {
                        l = a.length;
                        for (i = 0; i < l; i += 1) {
                            c = o.childNodes[i];

                            // delete child nodes
                            arguments.callee(c);

                            // remove event handlers
                            purge(c);
                        }
                    }

                })(el);

                // Удаляем все скрипты из HTML-строки и выставляем свойство innerHTML
                return replaceHTML(el, html.replace(/<script[^>]*>[\S\s]*?<\/script[^>]*>/ig, ""));
            }
        } :
        function (el, html) {
            return replaceHTML(el, html);
        };
    
    D.empty = (ie6) ?
        function (el, unsafe) {
            if (unsafe) {
                return D.setInnerHTML(el, '', 1);
            } else {
                return D.setInnerHTML(el, '');
            }
        } :
        function (el) {
            return D.setInnerHTML(el, '');
        };
    
}, '0.0.1', [
    { name : 'browser', minVersion : '0.0.2' }
]);