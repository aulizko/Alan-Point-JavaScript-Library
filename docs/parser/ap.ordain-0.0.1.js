AP.add('ordain', function (A) {
    var L = A.Lang;

    A.Ordain = function () {
        // Make Ordain able been used both factory and object models
        var me = this instanceof A.Ordain ? this : new A.Ordain(),
            clickHandlers = {}, mouseOverHandlers = {}, mouseOutHandlers = {}, focusHandlers = {}, blurHandlers = {},
            keyUpHandlers = {}, keyDownHandlers = {}, keyPressHandlers = {},

            /**
             * @method process
             * @param selector {String} css selector for element
             * @param theEvent {String} type of the event
             * @param handler {Function} handler for the event
             * @param context {Object} context for the handler function (opt)
             *
             * Also, you can pass all this params as object with same field, or several object or array of objects
             */
            process = function () {
                var a = arguments[0], length = arguments.length;

                if (L.isString(a)) {
                    this.declare(arguments);
                    return this;
                }

                if (L.isArray(a)) {
                    A.Array.each(a, function (o) {
                        this.declare(o.selector, o.event, o.handler,  o.context);
                    }, this);

                    return this;
                }

                if (L.isObject(a)) {
                    // check if there is more than one object
                    if (length == 1) {
                        this.declare(a.selector, a.event, a.handler, a.context);
                        return this;
                    } else {
                        A.Array.each(arguments, function (o) {
                            this.declare(o.selector, o.event, o.handler,  o.context);
                        }, this);
                        return this;
                    }
                }
            },

            declare = function (sel, evt, handler, context) {
                var hnd = this[evt];
                if(!hnd[sel]) {hnd[sel]=[];}
                hnd.push({ handler : handler, context : context });
            },

            defineTarget = function (/* Event */evt, /*String*/condition) {
                var elem;

                if (evt.target) {
                    elem = evt.target;
                } else {
                    if (evt.srcElement) {
                        elem = evt.srcElement;
                    }
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

            delegate = function (selectionHandlers, evt) {
                var sel, target, handlers, q = A.Queue();

                for (sel in selectionHandlers) {
                    target = defineTarget(evt, sel);
                    if (target === null) { continue; }
                    handlers = selectionHandlers[sel];
                    A.Array(handlers, function (o) {
                        var c = {};
                        c.fn = function () { o.handler(target, evt); };
                        if (o.context) {
                            c.context = o.context;
                        }
                        q.add(c);
                    }, this);
                }
                q.run();
            };

        $(document).click(function (e) {delegate(clickHandlers, e);});
        $(document).mouseover(function (e) {delegate(mouseOverHandlers, e);});
        $(document).mouseout(function (e) {delegate(mouseOutHandlers, e);});
        $(document).focus(function (e) {delegate(focusHandlers, e);});
        $(document).blur(function (e) {delegate(blurHandlers, e);});
        $(document).keydown(function (e) {delegate(keyDownHandlers, e);});
        $(document).keypress(function (e) {delegate(keyPressHandlers, e);});
        $(document).keyup(function (e) {delegate(keyUpHandlers, e);});



        return process.apply(me, arguments);
    };

    A.Ordain.prototype = {
        click : function (sel, handler, context) {
            declare(sel, 'click', handler, context);
        },
        hover : function (sel, overHandler, outHandler, context) {
            declare(sel, 'mouseover', overHandler, context);
            declare(sel, 'mouseout', outHandler, context);
        },
        focus : function (sel, focusHandler, blurHandler, context) {
            declare(sel, 'focus', focusHandler, context);
            declare(sel, 'blur', blurHandler, context);
        },
        key : function (sel, downHandler, pressHandler, upHandler, context) {
            declare(sel, 'keyDown', downHandler, context);
            declare(sel, 'keyPress', pressHandler, context);
            declare(sel, 'keyUp', upHandler, context);
        }
    };
}, '0.0.1');