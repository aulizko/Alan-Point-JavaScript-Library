(function () {
    var Cap = new AP.Class({
        className : 'cap',
        attrs : {
            color : {
                required : true,
                type : 'string'
            },
            shape : {
                required : false,
                type : 'string'
            },
            owner : {
                required : true,
                type : 'object',
                deep : true
            }
        }
    });
    var Guitar = new AP.Class({
        className : 'GuiTar'
    });
    
    describe('class', {
        'should exist in the AP namespace' : function () {
            value_of(!!AP.Class).should_be_true();
            value_of(typeof AP.Class).should_be('function');
        },
        
        // attributes
        
        'should have lower cased className attribute' : function () {
            var cap = new Cap();
            value_of(cap.getClassName()).should_be('cap');
            var guitar = new Guitar();
            value_of(guitar.getClassName()).should_be('guitar');
        },
        
        'should create properties for every member of attributes param' : function () {
            var cap = new Cap({
                color : 'red'
            });
            
            cap.isPropertyExist = function (name) {
                return AP.Lang.isValue(this[name]);
            };
            
            value_of(cap.isPropertyExist('color')).should_be_true();
            value_of(cap.isPropertyExist('shape')).should_be_true();
        },
        
        'should automatically create getter and setters for the attributes' : function () {
            var cap = new Cap();
            cap.setColor('red');
            value_of(cap.getColor()).should_be('red');
        },
        
        'should consider setter argument as required' : function () {
            try {
                var cap = new Cap();
                cap.setColor();
                value_of(this).should_fail('must throw an error');
            } catch(e) {
                value_of(e.message).should_be('1 argument is mandatory');
            }
        },
        
        'should add type requirements of attr to setter' : function () {
            try {
                var cap = new Cap();
                cap.setColor(123);
                value_of(this).should_fail('must throw an error');
            } catch (e) {
                value_of(e.message).should_be('1 argument type must be "string"');
            }
        },
        
        'should create getters which return deep copy if specified' : function () {
            var cap = new Cap();
            var person = {
                name : 'Mark'
            };
            cap.setOwner(person);
            var copyOfPerson = cap.getOwner();
            copyOfPerson.name = 'Something!!!';
            value_of(cap.owner.name).should_be('Mark');
        },
        
        'should create setters which make deep copy before assignment if specified' : function () {
            var cap = new Cap();
            var person = {
                name : 'Mark'
            };
            
            cap.setOwner(person);
            
            person.name = 'boomer';
            
            value_of(cap.owner.name).should_be('Mark');
        },
        
        'should create readonly attributes if specified' : function () {
            
            value_of(this).should_fail('TODO');
        },
        
        'should assign value if provided' : function () {
            value_of(this).should_fail('TODO');
        },
        
        'should add required attrs to the specification of the initialize method' : function () {
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
