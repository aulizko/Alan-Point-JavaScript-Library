/**
 * AP observer pattern implementation
 * @module ap
 * @submodule  observable
 */
AP.add("observable", function (A) {
    var eventNamespace = A.namespace('util.Event'), L = A.Lang, Ar = A.Array, O = A.Object;

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
             eventName = eventName + '-' + this._uid; // make event name unique - used if different objects publish event with similar names
         },
         /**
          * Subscribe function as event listener
          * @method subscribe
          * @param eventName {String} name of the event to subscribe (@TODO: implement namespace support)
          * @param method {Function} function to invoke
          * @param context {Mixed} context which from event should be invoked
          */
         subscribe : function (eventName, handler, context) {
             eventName = this.__makeEventNameUnique(eventName);
             if (L.isArray(handler)) {
                 var i = handler.length;
                 while(i--) {
                     this.__subscribe(eventName, handler[i], context);
                 }
             } else if (L.isFunction(handler)) {
                 this.__subscribe(eventName, handler, context);
             }
         },

         __subscribe : (AP.config.doc.addEventListener) ?
             function (eventName, handler, context) {
                 AP.config.doc.addEventListener(eventName, function(e) {
                     // execute the callback
                     handler.call(context || AP.config.win, e);
                 }, false);
             } :
             ((AP.config.doc.attachEvent) ? function (eventName, handler, context) {
                 AP.config.doc.documentElement[eventName] = 0; // an expando property

                 AP.config.doc.documentElement.attachEvent("onpropertychange", function (event) {
                     if (event.propertyName == eventName) {
                         // execute the callback
                         handler.call(context || AP.config.win, event);
                     }
                 });
             } : function () {}),
         /**
          * Call every event listener which register on that event
          * @method publish
          * @param eventName {String} name of the event
          * @param data {Mixed} data which should be passed as the parameter into event listener
          */
         publish : function (eventName, data) {
             this.__dispatchEvent(this.__makeEventNameUnique(eventName), data);
         },

         __dispatchEvent : (AP.config.doc.addEventListener) ? 
             function (eventName, data) {
                 var fakeEvent = AP.config.doc.createEvent("UIEvents");
                 fakeEvent.initEvent(eventName, false, false);
                 AP.config.doc.dispatchEvent(fakeEvent);
             } : 
             ((AP.config.doc.attachEvent) ? function (eventName, data) {
                 AP.config.doc.documentElement.eventName++;
             } : function () {})
     };
    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'array', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' }
]);
