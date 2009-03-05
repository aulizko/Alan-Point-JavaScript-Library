/**
 * AP observer pattern implementation
 * @module ap
 * @submodule  observable
 */
AP.add("Observable", function (A) {
    var event = A.namespace('util.Event'), L = A.Lang, Ar = A.Array, O = A.Object, List = A.data.List;

    /**
     * Provides observable functionality to the classes. Usually used as mixin
     * @class Observable
     */
    event.Observable = {
        /**
         * Inner property which contains all subscribers
         * @prop {AP~data~List}
         */
        _subsribers : {},
        /**
         * Subscribe function as event listener
         * @method subscribe
         * @param eventName {String} name of the event to subscribe (@TODO: implement namespace support)
         * @param method {Function} function to invoke
         * @param context {Mixed} context which from event should be invoked
         */
        subscribe : function (eventName, method, context) {
            if (!L.isValue(this._subsribers[eventName])) { this._subsribers[eventName] = []; }
            method = Ar(method);

            Ar.each(method, function (m) {
                this._subsribers[eventName].push({
                    fn : m,
                    c  : ((context) ? context : A)
                });
 
            }, this);
        },
        /**
         * Call every event listener which register on that event
         * @method publish
         * @param eventName {String} name of the event
         * @param data {Mixed} data which should be passed as the parameter into event listener
         */
        publish : function (eventName, data) {
            if (!L.isValue(this._subsribers[eventName])) this._subsribers[eventName] = [];
            Ar.each(this._subsribers[eventName], function (handler) {
                handler.fn.call(handler.c, data);
            }, this);
        },

        /**
         * Unregister function as event listener
         * @method unsubscribe
         * @param eventName {String} name of the event
         * @param method {Funciton} function to unsubscribe
         */
        unsubscribe : function (eventName, method) {
            var eventListeners = this._subsribers[eventName];

            for (var i = 0, length = eventListeners.length; i < length; i++) {
                if (eventListeners[i].fn == method) {
                    this._subsribers[eventName].splice(i, 1);
                    break;
                }
            }
        }
    };
    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' }
]);
