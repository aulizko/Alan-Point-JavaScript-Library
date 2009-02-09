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
            inherit = conf.inherit, 
            mixins = (conf.mixins) ? A.Array(conf.mixins) : [],
            initialize = conf.initialize || function () {}, // provide way to chain initializers and destructors
            destructor = conf.destructor || function () {},
            attrs = conf.attrs || {};
        
        // todo : try to replace that ugly piece of code with Object filter method (if any)
        delete conf.className;
        delete conf.inherit;
        delete conf.mixins;
        delete conf.initialize;
        delete conf.destructor;
        delete conf.attrs;
        
        var klass = function () {
            klass.superclass.constructor.apply(this, arguments);
            this.__NAME__ = name;
            var initializeSpecs = {};
            for (var attr in attrs) {
                var spec = attrs[attr];
                
                if (L.isValue(spec.value) && spec.readonly) {
                    // we need to create readonly attribute, so that we need to create getter which should return value
                    this['get' + camelize(attr)] = function () { return spec.value; };
                } else {
                    this[attr] = spec.value || defaultValues[attrs[attr].type || 'object'];
                    
                    var setterName = 'set' + camelize(attr), getterName = 'get' + camelize(attr);

                    if (spec.deep) {
                        this[getterName] = function () {
                            return deepCopy(this[attr]);
                        };
                        
                        this[setterName] = function (n) {
                            this[attr] = deepCopy(n);
                        };
                    } else {
                        this[getterName] = function () {
                            return this[attr];
                        };
                        this[setterName] = function (n) {
                            this[attr] = n;
                        };
                    }
                    
                    if (spec.type) S.augment(setterName, [{ required : true, type : spec.type }], this);
                    else S.augment(setterName, [{ required : true }], this);
                    
                    if (spec.required || !!spec.validator) {
                        initializeSpecs[attr] = spec;
                    }
                }    
            }
            
            S.augment('initialize', initializeSpecs, this);
            
            this.initialize.apply(this, arguments);
            
            A.stamp(this);
            
            A.OOP.mix(klass.prototype, conf, true);
            
            return this;
        };
        
        if (inherit) {
            AP.OOP.extend(klass, inherit);
        } else {
            AP.OOP.extend(klass, root);
        }
        
        if (mixins.length) { // todo: test if it should work in IE 6
            var mixin, i = 0, aggr = {};
            
            while (mixin = mixins[i++]) {
                var c = mixin;
                while (c && c.prototype) {
                    for (var prop in c.prototype) {
                        if (prop != 'initialize' && prop != 'getClassName' && prop != 'toString' && prop != 'constructor') {
                            aggr[prop] = c.prototype[prop];
                        }
                    }
                    c = c.superclass ? c.superclass.constructor : null;
                }
            }
            A.OOP.mix(klass.prototype, aggr, true);
        }
        
        klass.prototype.constructor = klass;
        
        return klass;
    };
    
    var root = function () {
        this.initialize();
    };
    
    root.__NAME__ = 'class';
    
    root.prototype = {
        getClassName : function () {
            return this.__NAME__;
        },
        initialize : function () {
            
        },
        toString : function () {
            return this.getClassName() + '[' + this._uid + ']';
        }
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
    { name : 'oop', minVersion : '0.0.1' },
    { name : 'array', minVersion : '1.0.0' }
]);