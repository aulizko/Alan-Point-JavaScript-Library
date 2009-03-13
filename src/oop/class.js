/**
 * Class module. Provide class-based OOP realization first introduced by SIMULA-67.
 * Realization inspired by YUI Base class, Mootools Class (and from both Prototype and Base2, indirectly)
 * Also, some knowledges taken from Douglas Crockford "Classical inheritance in JavaScript" article http://javascript.crockford.com/inheritance.html
 * @module ap
 * @submodule class
 */
AP.add('class', function(A) {
    var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\bbase\b/: /.*/, O = A.Object, L = A.Lang;
    // The base Class implementation (does nothing)
    var Class = A.Class = function () {};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var base = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // take mixin array (if it is array… uhm, whatever) from prop
        var mixins = A.Array(prop.mixins);

        // remove mixins from the prop object
        var t = {};
        for (var name in prop) {
            if (name != 'mixins') {
                t[name] = prop[name];
            }
        }
        prop = t;

        // copy mixins public properties into prototype (we should suck this from it later)

        A.Array.each(mixins, function (mixin) {
            O.each(mixin, function (value, name) {
                if (L.isUndefined(prop[name]) || !(name in prop)) { prop[name] = value; }
            }, this);
        }, this);


        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof base[name] == "function" && fnTest.test(prop[name]) ?
                (function(name, fn) {
                    return function() {
                        var tmp = this.base;

                        // Add a new .base() method that is the same method
                        // but on the super-class
                        this.base = base[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this.base = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
            this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

}, '0.0.2', [
    { name : 'lang', minVersion : '0.0.1' },
    { name : 'array', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' }
]);
