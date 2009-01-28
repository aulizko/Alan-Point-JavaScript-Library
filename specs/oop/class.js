(function () {
    describe('class', {
        'should exist in the AP namespace' : function () {
            value_of(!!AP.Class).should_be_true();
            value_of(typeof AP.Class).should_be('object');
        },
        
        'should have type class' : function () {
            value_of(this).should_fail('TODO');
        },
        // attributes
        
        'should create properties for every member of attributes param' : function () {
            value_of(this).should_fail('TODO');
        },
        
        'should automatically create getter and setters for the attributes' : function () {
            value_of(this).should_fail('TODO');
        },
        
        'should apply shallow copy for getters' : function () {
            value_of(this).should_fail('TODO');
        },
        
        'should create readonly attributes if specified' : function () {
            value_of(this).should_fail('TODO');
        },
        
        // extend
        
        'should receive all public methods and properties from extended classes' : function () {
            value_of(this).should_fail('TODO');
        },
        
        'should add extended class to the prototype chain' : function () {
            value_of(this).should_fail('TODO');
        },
        
        // augment
        
        'should receive all public methods and properties from augment donor classes' : function () {
            value_of(this).should_fail('TODO');
        },
        'should not change prototype chain by augmenting' : function () {
            value_of(this).should_fail('TODO');
        },
        
        // initialize method
        
        'should call initialize method from class object itself down to current object' : function () {
            value_of(this).should_fail('TODO');
        },
        
        // destructor method
        
        'should call destructor method from current object till class object itself' : function () {
            value_of(this).should_fail('TODO');
        }
    });
})();
