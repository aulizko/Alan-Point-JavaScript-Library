(function () {
    // var Cap = new AP.Class({
    //     className : 'cap'
    // });
    // var Guitar = new AP.Class({
    //     className : 'GuiTar'
    // });
    
    describe('class', {
        'should exist in the AP namespace' : function () {
            value_of(!!AP.Class).should_be_true();
            value_of(typeof AP.Class).should_be('function');
        },
        
        // attributes
        
        'should have lower cased className attribute' : function () {
            var cap = new Cap();
            value_of(cap.getClassName()).should_be('cap');
            // var guitar = new Guitar();
            // value_of(guitar.getClassName()).should_be('guitar');
        },
        
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
