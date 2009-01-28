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
                value_of(e.message).should_be('name attribute is mandatory');
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
                value_of(e.message).should_be('name attribute type must be "string"');
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
                value_of(e.message).should_be('1 attribute is mandatory');
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
                value_of(e.message).should_be('1 attribute is mandatory');
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
                value_of(e.message).should_be('2 attribute type must be "number"');
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
                value_of(e.message).should_be('2 attribute type must be "number"');
            }
        }
    });
})();