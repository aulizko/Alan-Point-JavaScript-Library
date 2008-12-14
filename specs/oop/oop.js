/**
 * OOP utils.  If included, the OOP methods are added to the AP.OOP instance
 * @module ap
 * @submodule oop
 */
AP.add('oop', function (A) {
    /**
     * Utils collection
     * @class AP~OOP
     */
    A.OOP = A.OOP || {};
    
    var O = A.OOP;
    
    /**
     * Applies the supplier's properties to the receiver.  By default
     * all prototype and static propertes on the supplier are applied
     * to the corresponding spot on the receiver.  By default all
     * properties are applied, and a property that is already on the
     * reciever will not be overwritten.  The default behavior can
     * be modified by supplying the appropriate parameters.
     *
     * @TODO add constants for the modes
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
                         if (PROTO === i || '_yuid' === i) {
                             continue;
                         }

                         // @TODO deal with the hasownprop issue

                         // check white list if it was supplied
                         if (!w || iwl || (i in w)) {
                             // if the receiver has this property, it is an object,
                             // and merge is specified, merge the two objects.
                             if (m && L.isObject(fr[i], true)) {
                                 // console.log('aggregate RECURSE: ' + i);
                                 // @TODO recursive or no?
                                 // Y.mix(fr[i], fs[i]); // not recursive
                                 f(fr[i], fs[i], proto, true); // recursive
                             // otherwise apply the property only if overwrite
                             // is specified or the receiver doesn't have one.
                             // @TODO make sure the 'arr' check isn't desructive
                             } else if (!arr && (ov || !(i in fr))) {
                                 // console.log('hash: ' + i);
                                 fr[i] = fs[i];
                             // if merge is specified and the receiver is an array,
                             // append the array item
                             } else if (arr) {
                                 // console.log('array: ' + i);
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
}, '0.0.1', [
    { name : 'array', minVersion : '0.0.1' },
    { name : 'lang', minVersion : '0.0.2' }
]);