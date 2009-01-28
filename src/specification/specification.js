/**
 * Specification module 
 * This is helpers for the "design by contract" programming style
 * @module ap
 * @submodule specification
 */
AP.add('specification', function (A) {
    
    /**
     * Creates Specification object to AP instance
     * @class AP~specification
     */
    
    A.Specification = A.Specification || {};
    
    var S = A.Specification, L = A.Lang;
    
    /**
     * Check validates arguments, passed into parent-level function (got by arguments.callee.caller.arguments chain)
     * through so-called specification which passed as argument to the check method itself
     * @method check
     * @static
     * @param specification {Array|Object} can be passed with three possible ways: 
     * <ul><li>As Object - so that every property will expect property with same name at the real-world arguments. 
     * Every property can have up to two properties:
     * <ul><li>required {Boolean} - if true, check should throw error if won't found that method at the real-world arguments</li>
     * <li>type {String} - determine which type must be paramether(todo: check spelling)</li></ul></li>
     * <li>As array - so that every property (if have true as required sub-property) expect same property at same index-based position.
     * Every property can have object-way subproperties</li>
     * <li>As regular arguments. Works same as array-like way, but beware not to left 1 argument, cause check method should consider it like object-like way</li>
     * </ul>
     */
    S.check = function (specification) {
        // take function arguments object
        var caller = arguments.callee.caller, 
            real_arguments = caller.arguments;
        
        // we can pass arguments as we usual passed into function
        if (arguments.length > 1) {
            S.__arraySpecificationCheck(A.Array(arguments), real_arguments);
            // use array-based implementation
        } else if (arguments.length == 1) {
            if (L.isArray(specification)) {
                S.__arraySpecificationCheck(specification, real_arguments);
            } else if (L.isObject(specification)) {
                // if specification is object, so that expected that first object passed at function is also last
                // assume that arguments passed in as fields of object
                S.__objectSpecificationCheck(specification, (real_arguments.length ? real_arguments[0] : {}));
            }
        }
        
        // there is no right specification passed. Let it be.
    };
    
    /**
     * Inner method which called inside check method when object-like specification passed in
     * @method __objectSpecificationCheck
     * @private
     * @param specification {Object} - specification object (@see AP~specification~check)
     * @param args {Arguments} - real-world arguments which check retreived from the parent-level function
     * @throws error about attribute (name) is mandatory or about attribute (name) type must be passed in
     */
    S.__objectSpecificationCheck = function (specification, args) {
        var propName, prop, actualProperty;

        for (propName in specification) {
            prop = specification[propName];
            actualProperty = args[propName];
            if (prop.required && !L.isValue(actualProperty)) {
                throw new Error(propName + ' attribute is mandatory');
            }
            
            if (!!actualProperty && !S.__checkType(prop.type, actualProperty)) {
                throw new Error(propName + ' attribute type must be "' + prop.type + '"');
            }
        }
    };
    
    /**
     * Inner method called inside check method when array-like specification passed in
     * @method __arraySpecificationCheck
     * @private
     * @param specification {Array} - specification object (@see AP~specification~check)
     * @param args {Arguments} - real-world arguments which check retreived from the parent-level function
     * @throws error about attribute (name) is mandatory or about attribute (name) type must be passed in
     */
    S.__arraySpecificationCheck = function (specification, args) {
        var prop, i = 0;
        for (var prop, i = 0, length = specification.length; i < length; i++) {
            prop = specification[i];
            actualProperty = args[i];
            if (prop.required && !L.isValue(actualProperty)) {
                throw new Error((i + 1) + ' attribute is mandatory');
            }
            
            if (!!actualProperty && !S.__checkType(prop.type, actualProperty)) {
                throw new Error((i + 1) + ' attribute type must be "' + prop.type + '"');
            }
        }
    };
    
    
    /**
     * Inner method called inside check method implementations which interpreur user-level type names like 'string' into
     * AP~lang module method names like 'isString' and pass property into that method
     * @method __checkType
     * @private
     * @param requiredType {String} - any-case named type. String, nUmber, Date and all that. 
     * @param property - property to check type of
     * @return {Boolean} is property match type
     */
    S.__checkType = function (requiredType, property) {
        if (L.isUndefined(requiredType)) return true;
        
        var correspondLangMethod = null;
        switch (requiredType.toLowerCase()) {
            case 'array':
                correspondLangMethod = 'isArray';
                break;
            case 'boolean':
                correspondLangMethod = 'isBoolean';
                break;
            case 'function':
                correspondLangMethod = 'isFunction';
                break;
            case 'date':
                correspondLangMethod = 'isDate';
                break;
            case 'number':
                correspondLangMethod = 'isNumber';
                break;
            case 'object':
                correspondLangMethod = 'isObject';
                break;
            case 'string':
                correspondLangMethod = 'isString';
                break;
            default:
                correspondLangMethod = 'isValue';
        }
        return L[correspondLangMethod](property);
    };
    
    
    // todo: implement value restrictions specification - for example, range for number, length for string&array and so forth
    
}, '0.0.1', [
    { name : 'lang', minversion : '0.0.3' },
    { name : 'array', minversion : '1.0.0' }
]);