AP.add('dom', function (A) {
    
    A.DOM = A.DOM || function () {
        var cachTarget = null,
        
        purge = function(d) {
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
        
        return {
            /**
             * @method getMatchingTarget
             * @param e {Event}
             * @param condition {String} Css-3 compliant selector
             * @return {HTMLElement|jQuery|Null}
             */
            getMatchingTarget: function (/* Event */e, /*String*/condition) {
                // remember what is truth - target or srcElement.
                // also, stop resolve safari bug every time - if it is safari, let us know it
             
                var elem, L = A.Lang;
                
                if (cachTarget === null) {
                    if (e.target) {
                        cachTarget = 'target';
                        elem = e.target;
                    } else {
                        if (e.srcElement) {
                            cachTarget = 'srcElement';
                            elem = e.srcElement;
                        }
                    }
                } else {
                    elem = e[cachTarget];
                }
                
                // defeat Safari bug
                if (elem.nodeType == 3) {
                    elem = elem.parentNode;
                }

                if (L.isUndefined(elem)) {
                    return null;
                }

                // work with classes
                if ($(elem).is(condition)) {
                    return elem;
                } else {
                    return $(elem).parents(condition);
                }
            },
            
            /**
             * This method does exactly the same, that getMatchingTarget method, but have a huge difference:
             * It doesn't use .is method of jQuery so that it works much faster. 
             * But with this also came a limitness - cause we don't use jQuery to determine element, 
             * We also cannot use it selectors. 
             * This function is designed to use with thousands of same events - like keypress or mousemove.
             * @method getMatchingTargetFast
             * @param e {Event} dom event
             * @param type {NodeType} type of the element
             * @param class {String} style class of the element
             * @return {null|HTMLElement}
             */
            getMatchingTargetFast : function (e, elementType, className) {
                var elem, L = A.Lang;
                
                if (cachTarget === null) {
                    if (e.target) {
                        cachTarget = 'target';
                        elem = e.target;
                    } else {
                        if (e.srcElement) {
                            cachTarget = 'srcElement';
                            elem = e.srcElement;
                        }
                    }
                } else {
                    elem = e[cachTarget];
                }
                
                // defeat Safari bug
                if (elem.nodeType == 3) {
                    elem = elem.parentNode;
                }

                if (L.isUndefined(elem)) {
                    return null;
                }
                
                if ((elem.nodeName.toLowerCase() == elementType) && (elem.className == className)) {
                    return elem;
                } else {
                    return null;
                }
            },

            setInnerHTML : function (el, html) {
                if (!el || typeof html !== 'string') {
                    return null;
                }

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
                el.innerHTML = html.replace(/<script[^>]*>[\S\s]*?<\/script[^>]*>/ig, "");

                // Возвращаем ссылку на первый дочерний узел
                return el.firstChild;
            }
        };
    }();

}, '0.0.1');
