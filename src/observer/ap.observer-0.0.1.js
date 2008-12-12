/**
 * AP observer pattern implementation
 * @module ap
 * @submodule observer
 */
AP.add("Observer", function (A) {
    /**
     * Provides smooth observer pattern support via jQuery custom events
     * @class Observer
     * @static
     */
    var L = A.Lang;

    A.Observer = function () {
        var eventsPool = {},



        registerEvent = function (theEvent) {
            if (L.isUndefined(eventsPool[theEvent])) {
                eventsPool[theEvent] = new Array();
            }
        };

        return {
            subscribe : function (theEvent, method, context) {
                if (!L.isFunction(method)) { return; }
                registerEvent(theEvent);
                eventsPool[theEvent].push({ method : method, context : (context) ? context : A.config.win });
            },

            notify : function (theEvent, data) {
                var subscribers = eventsPool[theEvent], q = A.Queue();
                if (!L.isUndefined(subscribers) && (subscribers.length > 0)) {
                    A.Array.each(subscribers, function (subscriber) {
                        subscriber.method.call(subscriber.context, data);
                    }, this);
                    
                }
            }
        };
    }();
}, '0.0.1');