/**
 * Class module. Provide class-based OOP realization first introduced by SIMULA-67.
 * Realization inspired by YUI Base class, Mootools Class (and from both Prototype and Base2, indirectly)
 * Also, some knowledges taken from Douglas Crockford "Classical inheritance in JavaScript" article http://javascript.crockford.com/inheritance.html
 * @module ap
 * @submodule class
 */
AP.add('class', function (A) {
    
    /** 
     * Root node of the class the hierarchy
     * and class builder itself
     * @class AP~class
     */
    A.Class = A.Class || function (conf) {
        // check conf object if it has all required arguments
        
        
        n = new Function ();
        
        return n;
    };
    
    A.Class.prototype = {
        getClassName : function () {
            return this.__NAME__;
        }
    };
    
    
}, '0.0.1', [ 
    { name : 'lang', minVersion : '0.0.3' }
]);