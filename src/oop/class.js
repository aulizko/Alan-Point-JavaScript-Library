/**
 * Class module. Provide class-based OOP realization first introduced by SIMULA-67.
 * Realization inspired by YUI Base class, Mootools Class (and from both Prototype and Base2, indirectly)
 * Also, some knowledges taken from Douglas Crockford "Classical inheritance in JavaScript" article http://javascript.crockford.com/inheritance.html
 * @module ap
 * @submodule class
 */
AP.add('class', function (A) {
    var S = A.Specification, L = A.Lang;
    
    /** 
     * Root node of the class the hierarchy
     * and class builder itself
     * @class AP~class
     */
    A.Class = function (conf) {
        S.check({
            // todo: write valid specification
        });
        
        conf = conf || {};
        
        var name = (conf.className || 'class').toLowerCase(),
            extend = conf.extend, 
            mixin = conf.mixin || [],
            initialize = conf.initialize || function () {}, // provide way to chain initializers and destructors
            destructor = conf.destructor || function () {},
            attrs = conf.attrs || {};
        
        // todo : try to replace that ugly piece of code with Object filter method (if any)
        delete conf.className;
        delete conf.extend;
        delete conf.mixin;
        delete conf.initialize;
        delete conf.destructor;
        delete conf.attrs;
        
        var klass = function () {
            this.constructor.superclass.constructor.call(this, arguments);
            this.__NAME__ = name;
            for (var attr in attrs) {
                var spec = attrs[attr];
                this[attr] = spec.value || defaultValues[attrs[attr].type || 'object'];
                
                this['get' + camelize(attr)] = (spec.deep) ?
                    function () {
                        return deepCopy(this[attr]);
                    } :
                    function () {
                        return this[attr];
                    };
                
                var setterName = 'set' + camelize(attr);
                
                this[setterName] = (spec.deep) ? 
                    function (n) {
                        this[attr] = deepCopy(n);
                    } :
                    function (n) {
                        this[attr] = n;
                    };
                
                if (spec.type) S.augment(setterName, [{ required : true, type : spec.type }], this);
                else S.augment(setterName, [{ required : true }], this);
            }
            initialize.apply(this, arguments);
        };
        
        klass.prototype = conf;
        A.OOP.extend(klass, root);
        
        return klass;
    };
    
    var root = function () {
        this.__NAME__ = 'class';
    };
    
    root.prototype.getClassName = function () {
        return this.__NAME__;
    };
    
    var camelize = function (str) {
        return str[0].toUpperCase() + str.substring(1, str.length);
    };
    
    var defaultValues = {
        'string' : '',
        'number' : 0, 
        'date' : new Date(),
        'boolean' : false,
        'function' : new Function (),
        'object' : {},
        'array' : []
    };
    
    var deepCopy = function (p) {
        var defineCopyMethodByType = {
            'primitive' : function (p) { return p; },
            'object' : function (p) {
                var o = {};
                for (var prop in p) {
                    o[prop] = p[prop];
                }
                return o;
            },
            'date' : function (p) {
                return new Date(p.toString());
            },
            'array' : function (p) {
                var o = [], i = o.length = p.length;
                while(i--) {
                    o[i] = deepCopy(p[i]);
                }
                return i;
            },
            'function' : function (p) {
                return new Function (p.name, p.toString());
            }
        },
        type = 'object';
        
        if (L.isArray(p)) type = 'array';
        if (L.isNumber(p) || L.isString(p) || L.isBoolean(p)) {
            type = 'primitive';
            if (p.valueOf) {
                p = p.valueOf();
            }
        }
        if (L.isDate(p)) type = 'date';
        if (L.isFunction(p)) type = 'function';
        
        return defineCopyMethodByType[type](p);
    };
    
    
}, '0.0.1', [ 
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'specification', minVersion: '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' }
]);