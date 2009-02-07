(function () {
    var S = AP.Specification;
    
    describe('specification', {
        'should exist at the AP namespace' : function () {
            value_of(!!S).should_be(true);
            value_of(typeof S).should_be('object');
        },
    
        // check with object. required
    
        'should throw error if required attribute missed' : function () {
            try {
                var test = function (conf) {
                    S.check({
                        name : {
                            required : true
                        }
                    });
                };
                test();
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('name argument is mandatory');
            }
        },
        
        // check with object. type
        
        'should throw error if attribute type mismatch required' : function () {
            try {
                var test = function (conf) {
                    S.check({
                        name : {
                            type : 'string'
                        }
                    });
                };
                test({
                    name : 123
                });
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('name argument type must be "string"');
            }
        },
        
        // check with old school arguments / array. required
        
        'should throw error if required argument missed' : function () {
            try {
                var test = function (conf) {
                    S.check({
                        required : true
                    }, {
                        required : false
                    });
                };
                test();
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('1 argument is mandatory');
            }
            
            try {
                var test = function (conf) {
                    S.check([{
                        required : true
                    }, {
                        required : false
                    }]);
                };
                test();
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('1 argument is mandatory');
            }
        },
        
        // check with old school arguments / array. type

        'should throw error if attribute type mismatch required' : function () {
            try {
                var test = function (conf) {
                    S.check({
                        type : 'function'
                    }, {
                        type : 'number'
                    });
                };
                test(function () {}, new Date());
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('2 argument type must be "number"');
            }

            try {
                var test = function (conf) {
                    S.check([{
                        type : 'function'
                    }, {
                        type : 'number'
                    }]);
                };
                test(function () {}, new Date());
                value_of(this).should_fail('must throw an error!');
            } catch (e) {
                value_of(e.message).should_be('2 argument type must be "number"');
            }
        },
        
        // augment 
        
        'should call method, if arguments match contract' : function () {
            var person = {
                name : 'John Doe',
                sayWords : function (message) { return message.words; },
                sayMessage : function (message) { return message; }
            };
            
            S.augment('sayWords', {
                words : {
                    required : true
                }
            }, person);
            
            value_of(person.sayWords({words : 'different words' })).should_be('different words');
            
            S.augment('sayMessage', [ { required : true } ], person);
            
            value_of(person.sayMessage('All that moments will be lost in time')).should_be('All that moments will be lost in time');
        },
        
        'should call check method before original method invocation and throw error if contract check failed' : function () {
            var person = {
                name : 'John Doe',
                sayWords : function (message) { return message.words; },
                sayMessage : function (message) { return message; }
            };
            S.augment('sayWords', {
                words : {
                    required : true,
                    type : 'string'
                }
            }, person);
            
            try {
                person.sayWords();
                value_of(this).should_fail('specification must throw an error');
            } catch (e) {
                value_of(e.message).should_be('words argument is mandatory');
            }
            
            try {
                person.sayWords({ words : { something : 'bo!' } });
                value_of(this).should_fail('specification must throw an error');
            } catch (e) {
                value_of(e.message).should_be('words argument type must be "string"');
            }
        }
    });
})();