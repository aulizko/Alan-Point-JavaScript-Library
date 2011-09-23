/**
 * OOP utils.  If included, the best OOP helpers will be available at the AP.OOPP namespace
 * @module ap
 * @submodule oop
 */
AP.add('oop', function (A) {
    /**
     * Utils collection
     * @class AP~OOP
     */
    A.OOP = A.OOP || {};

    var O = A.OOP,
        OP = Object.prototype,
        IEF = ["toString", "valueOf"],
        PROTO = 'prototype',
        L = A.Lang,

    /**
     * IE will not enumerate native functions in a derived object even if the
     * function was overridden.  This is a workaround for specific functions
     * we care about on the Object prototype.
     * @property _iefix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param w a whitelist object (the keys are the valid items to reference)
     * @private
     * @for YUI
     */
    _iefix = (A.Browser && A.Browser.ie) ?
        function(r, s, w) {
            for (var i=0, a=IEF; i<a.length; i=i+1) {
                var n = a[i], f = s[n];
                if (L.isFunction(f) && f != OP[n]) {
                    if (!w || (n in w)) {
                        r[n]=f;
                    }
                }
            }
        } : function() {};

    /**
     * Returns a new object containing all of the properties of
     * all the supplied objects.  The properties from later objects
     * will overwrite those in earlier objects.  Passing in a
     * single object will create a shallow copy of it.  For a deep
     * copy, use clone.
     * @method merge
     * @param arguments {Object*} the objects to merge
     * @return {object} the new merged object
     */
    O.merge = function() {
        // var o={}, a=arguments;
        // for (var i=0, l=a.length; i<l; i=i+1) {
        //var a=arguments, o=Y.Object(a[0]);
        var a=arguments, o={};
        for (var i=0, l=a.length; i<l; i=i+1) {
            O.mix(o, a[i], true);
        }
        return o;
    };

    /**
     * Applies the supplier's properties to the receiver.  By default
     * all prototype and static propertes on the supplier are applied
     * to the corresponding spot on the receiver.  By default all
     * properties are applied, and a property that is already on the
     * reciever will not be overwritten.  The default behavior can
     * be modified by supplying the appropriate parameters.
     *
     * @method mix
     * @param {Function} r  the object to receive the augmentation
     * @param {Function} s  the object that supplies the properties to augment
     * @param ov {boolean} if true, properties already on the receiver
     * will be overwritten if found on the supplier.
     * @param wl {string[]} a whitelist.  If supplied, only properties in
     * this list will be applied to the receiver.
     * @param {int} mode what should be copies, and to where
     *        default(0): object to object
     *        1: prototype to prototype (old augment)
     *        2: prototype to prototype and object props (new augment)
     *        3: prototype to object
     *        4: object to prototype
     * @param merge {boolean} merge objects instead of overwriting/ignoring
     * Used by Y.aggregate
     * @return {object} the augmented object
     * @TODO review for PR2
     */
    O.mix =  function(r, s, ov, wl, mode, merge) {

         if (!s||!r) {
             return A;
         }

         var w = (wl && wl.length) ? A.hash(wl) : null, m = merge,

             f = function(fr, fs, proto, iwl) {

                 var arr = m && L.isArray(fr);

                 for (var i in fs) {

                     if (fs.hasOwnProperty(i)) {

                         // We never want to overwrite the prototype
                         // if (PROTO === i) {
                         if (PROTO === i || '_uid' === i) {
                             continue;
                         }

                         // @TODO deal with the hasownprop issue

                         // check white list if it was supplied
                         if (!w || iwl || (i in w)) {
                             // if the receiver has this property, it is an object,
                             // and merge is specified, merge the two objects.
                             if (m && L.isObject(fr[i], true)) {
                                 // @TODO recursive or no?
                                 // Y.mix(fr[i], fs[i]); // not recursive
                                 f(fr[i], fs[i], proto, true); // recursive
                             // otherwise apply the property only if overwrite
                             // is specified or the receiver doesn't have one.
                             // @TODO make sure the 'arr' check isn't desructive
                             } else if (!arr && (ov || !(i in fr))) {
                                 fr[i] = fs[i];
                             // if merge is specified and the receiver is an array,
                             // append the array item
                             } else if (arr) {
                                 // @TODO probably will need to remove dups
                                 fr.push(fs[i]);
                             }
                         }
                     }
                 }

                 _iefix(fr, fs, w);
             };

         var rp = r.prototype, sp = s.prototype;

         switch (mode) {
             case 1: // proto to proto
                 f(rp, sp, true);
                 break;
             case 2: // object to object and proto to proto
                 f(r, s);
                 f(rp, sp, true);
                 break;
             case 3: // proto to static
                 f(r, sp, true);
                 break;
             case 4: // static to proto
                 f(rp, s);
                 break;
             default:  // object to object
                 f(r, s);
         }

         return r;
     };

     /**
      * Applies prototype properties from the supplier to the receiver.
      * The receiver can be a constructor or an instance.
      * @method augment
      * @param {Function} r  the object to receive the augmentation
      * @param {Function} s  the object that supplies the properties to augment
      * @param ov {boolean} if true, properties already on the receiver
      * will be overwritten if found on the supplier.
      * @param wl {string[]} a whitelist.  If supplied, only properties in
      * this list will be applied to the receiver.
      * @param args {Array | Any} arg or arguments to apply to the supplier
      * constructor when initializing.
      * @return {object} the augmented object
      */
     O.augment = function(r, s, ov, wl, args) {

         var sProto = s.prototype, newProto = null, construct = s,
             a = (args) ? A.Array(args) : [], rProto = r.prototype,
             target =  rProto || r, applyConstructor = false;

         // working on a class, so apply constructor infrastructure
         if (rProto && construct) {


             // Y.Do.before(r, construct);

             var sequestered = {}, replacements = {};
             newProto = {};

             // sequester all of the functions in the supplier and replace with
             // one that will restore all of them.
             A.Object.each(sProto, function(v, k) {


                 // var initialized = false;

                 replacements[k] = function() {

                     var me = this;


                     // overwrite the prototype with all of the sequestered functions,
                     // but only if it hasn't been overridden
                     for (var i in sequestered) {
                         if (sequestered.hasOwnProperty(i) && (me[i] === replacements[i])) {
                             me[i] = sequestered[i];
                         }
                     }

                     // apply the constructor
                     construct.apply(me, a);

                     // apply the original sequestered function
                     return sequestered[k].apply(me, arguments);

                 };

                 if ((!wl || (k in wl)) && (ov || !(k in this))) {


                     if (L.isFunction(v)) {

                         // sequester the function
                         sequestered[k] = v;

                         // replace the sequestered function with a function that will
                         // restore all sequestered functions and exectue the constructor.
                         this[k] = replacements[k];

                     } else {


                         this[k] = v;
                     }

                 }

             }, newProto, true);

         // augmenting an instance, so apply the constructor immediately
         } else {
             applyConstructor = true;
         }

         this.mix(target, newProto || sProto, ov, wl);

         if (applyConstructor) {
             s.apply(target, a);
         }

         return r;
     };

     /**
      * Utility to set up the prototype, constructor and superclass properties to
      * support an inheritance strategy that can chain constructors and methods.
      * Static members will not be inherited.
      *
      * @method extend
      * @param {Function} r   the object to modify
      * @param {Function} s the object to inherit
      * @param {Object} px prototype properties to add/override
      * @param {Object} sx static properties to add/override
      * @return {AP} new class
      */
     O.extend = function(r, s, px, sx) {
         var sp = s.prototype, rp=A.Object(sp);
         r.prototype=rp;

         rp.constructor=r;
         r.superclass=sp;

         // If the superclass doesn't have a standard constructor,
         // define one so that Super() works
         if (s != Object && sp.constructor == OP.constructor) {
             sp.constructor=s;
         }

         // Add object properties too
         // TODO: removed for now because it isn't that useful and
         // has caused a few issues overwriting things that should
         // not be.  You can do this manually if needed.  Revisit
         // if this is something that really is needed for some
         // reason.
         // A.mix(r, s);

         // Add superclass convienience functions
         // TODO: revisit when we have something that works
         // A.augment(r, Ext);

         // Add prototype overrides
         if (px) {
             O.mix(rp, px, true);
         }

         // Add object overrides
         if (sx) {
             O.mix(r, sx, true);
         }

         return r;
     };
}, '0.0.1', [
    { name : 'array', minVersion : '1.0.0' },
    { name : 'lang', minVersion : '0.0.2' },
    { name : 'browser', minVersion : '0.0.1'},
    { name : 'object', minVersion : '0.0.1' }
]);