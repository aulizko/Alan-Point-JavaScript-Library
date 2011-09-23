/**
 * AP observer pattern implementation
 * @module ap
 * @submodule  observable
 */
AP.add("observable", function (A) {
    var eventNamespace = A.namespace('util.Event'), L = A.Lang, $ = AP.Query, reduceAPUniqueIdRegExp = /-ap-[\d]+$/;

    /**
     * Provides observable functionality to the classes. Usually used as mixin
     * @class Observable
     */
    eventNamespace.Observable = {
        /**
         * make event name unique - used if different objects publish event with similar names
         * @method __makeEventNameUnique
         * @private
         * @param eventName {String} name of the event to make unique
         * @return {String} unique per object eventName
         */
        __makeEventNameUnique : function (eventName) {
            if (!this._uid) { AP.stamp(this); }
            return eventName + '-' + this._uid; // make event name unique - used if different objects publish event with similar names
        },
        /**
         * Subscribe function as event listener
         * @method subscribe
         * @param eventName {String} name of the event to subscribe (@TODO: implement namespace support)
         * @param handler {Function} function to invoke
         * @param context {Object} context which from event should be invoked
         */
        subscribe : function (eventName, handler, context) {
            eventName = this.__makeEventNameUnique(eventName);
            this.__subscribe(eventName, handler, context);

            return this; // chain support
        },

        __subscribe : function (name, handler, context) {

            $(document).bind(name, function () {
                if (arguments.length > 1) {
                    var args = AP.Array(arguments); // convert arguments to the array

                    args.splice(0, 1); // remove first element, which is dom event
                    args = AP.Array.extend([name.replace(reduceAPUniqueIdRegExp, '')], args); // add name of the event as first param (and remove AP uniqueId from it)
                }
                // handler.apply(context || AP.config.win);
                handler.apply(context || AP.config.win, args);
            });
        },
        /**
         * Call every event listener which register on that event
         * @method publish
         * @param name {String} name of the event
         * @param data {Object|Array} data which should be passed as the parameter into event listener
         * @param delay {Number} publish an event with a delay
         */
        publish : function (name, data, delay) {
            this.__dispatchEvent(this.__makeEventNameUnique(name), data, delay);

            return this; // chain support
        },

        __dispatchEvent : function (name, data, delay) {
            var returns = function () {
                AP.Query.event.trigger(name, AP.Array(data));
            };

            if (delay) {
                setTimeout(returns, delay);
            } else {
                returns();
            }
        },

        unsubscribe : function () {}
     };





}, '0.0.2', [
    { name : 'array', minVersion : '0.0.1' },
    { name : 'query', minVersion : '0.0.1' },
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'array', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' }
]);
