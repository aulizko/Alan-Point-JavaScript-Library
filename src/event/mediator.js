AP.add('mediator', function (A) {


    var _instance, event = A.namespace('util.Event'), L = AP.Lang;

    A.Mediator = event.Mediator = function () {
        if (!L.isValue(_instance)) {
            _instance = A.OOP.merge({
                /**
                 * Register event and publisher so that anyone can subscribe on it
                 * @method registerEvent
                 * @param eventName {String} name of the function @TODO: think about namespace using
                 * @param publisher {Mixed} class which will publish event
                 */
                registerEvent : function (eventName, publisher) {
                    publisher.subscribe(eventName, this.notify, this);
                },

                /**
                 * Add as many event listeners as you want
                 * @method addEventListener
                 * @param eventName {String} name of the event
                 * @param fn {Function|Array} method or array of methods
                 * @param context {Mixed} context of function invocation
                 */
                addEventListener : function (/* String */ eventName, fn, context) {
                    this.subscribe(eventName, fn, context);
                },
                /**
                 * Notify subscribers that function are fired
                 * @method notify
                 * @param eventName {String} name of the event
                 */
                notify : function (eventName) {
                    this.publish(eventName);
                }
            }, event.Observable);
        }

        return _instance;
    };

}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'observable', minVersion : '0.0.1' }
]);
