(function () {
    var Cap = new AP.Class({
        className : 'cap',
        attributes : {
            color : {
                required : true,
                type : 'string'
            },
            shape : {
                type : 'string'
            },
            owner : {
                required : true,
                type : 'object',
                deep : true
            },
            grahalLike : {
                type : 'string',
                value : 'no',
                readonly : true
            }
        },
        initialize : function (o) {
            this.color = o.color;
            this.owner = o.owner;
        }
    }),
    
    Guitar = new AP.Class({
        className : 'GuiTar'
    }),
    
    Lamp = new AP.Class({ 
        className : 'lamp',
        attributes : {
            power : {
                type : 'number',
                required : true
            }
        },
        initialize : function (o) {
            this.power = o.power;
        },
        shine : function () {
            return 'Light';
        }
    }),
    
    Blink = new AP.Class({
        className : 'blink',
        attributes : {
            angleOfCoverage : {
                required : true,
                type : 'number'
            }
        },
        inherit : Lamp,
        initialize : function (o) {
            this.angleOfCoverage = o.angleOfCoverage;
        }
    }),
        
    L = AP.Lang;
    
    describe('class', {
        'should exist in the AP namespace' : function () {
            value_of(!!AP.Class).should_be_true();
            value_of(typeof AP.Class).should_be('function');
        },
        
        // attributes
        
        'should have lower cased className attribute' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            value_of(cap.getClassName()).should_be('cap');
            var guitar = new Guitar();
            value_of(guitar.getClassName()).should_be('guitar');
        },
                
        'should create properties for every member of attributes param' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            
            cap.isPropertyExist = function (name) {
                return AP.Lang.isValue(this[name]);
            };
            
            value_of(cap.isPropertyExist('color')).should_be_true();
            value_of(cap.isPropertyExist('shape')).should_be_true();
        },
        
        'should automatically create getter and setters for the attributes' : function () {
            var cap = new Cap({ color : 'green', owner : { name : 'bo!' } });
            cap.setColor('red');
            value_of(cap.getColor()).should_be('red');
        },
        
        'should consider setter argument as required' : function () {
            try {
                var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
                cap.setColor();
                value_of(this).should_fail('must throw an error');
            } catch(e) {
                value_of(e.message).should_be('1 argument is mandatory');
            }
        },
        
        'should add type requirements of attr to setter' : function () {
            try {
                var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
                cap.setColor(123);
                value_of(this).should_fail('must throw an error');
            } catch (e) {
                value_of(e.message).should_be('1 argument type must be "string"');
            }
        },
        
        'should create getters which return deep copy if specified' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            var person = {
                name : 'Mark'
            };
            cap.setOwner(person);
            var copyOfPerson = cap.getOwner();
            copyOfPerson.name = 'Something!!!';
            value_of(cap.getOwner().name).should_be('Mark');
        },
        
        'should create setters which make deep copy before assignment if specified' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            var person = {
                name : 'Mark'
            };
            
            cap.setOwner(person);
            
            person.name = 'boomer';
            
            value_of(cap.getOwner().name).should_be('Mark');
        },
        
        'should assign value if provided' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            value_of(cap.getGrahalLike()).should_be('no');
        },
        
        'should create readonly attributes if specified' : function () {
            var cap = new Cap({ color : 'red', owner : { name : 'bo!' } });
            // todo: check with dictionary, am I right
            value_of(L.isValue(cap.grahalLike)).should_be_false();
            value_of(L.isValue(cap.setGrahalLike)).should_be_false();
            value_of(L.isValue(cap.getGrahalLike)).should_be_true();
            value_of(cap.getGrahalLike()).should_be('no');
        },
        
        'should add required attributes to the specification of the initialize method' : function () {
            try {
                var cap = new Cap();
                value_of(this).should_fail('must throw an error');
            } catch (e) {
                value_of(e.message).should_be('color argument is mandatory');
            }
        },
        
        // extend
        
        'should receive all public methods and properties from extended classes' : function () {
            var blink = new Blink ({ angleOfCoverage : 40, power : 220 });
            
            value_of(blink.shine()).should_be('Light');
            value_of(L.isValue(blink.power)).should_be_true();
        },
        
        'should be instance of the extended classes' : function () {
            var blink = new Blink ({ angleOfCoverage : 40, power : 220 });
            
            value_of(blink instanceof Blink).should_be_true();
            value_of(blink instanceof Lamp).should_be_true();
        },
        
        // augment
        
        'should receive all public methods and properties from augment donor classes' : function () {
            var EfficientBulb = new AP.Class({
                className : 'efficientBulb',
                initialize : function (o) {
                    this.setPower(o.power * 2);
                },
                mixins : [
                    Lamp
                ]
            });
            
            var efficientBulb = new EfficientBulb({ power : 40 });
            value_of(efficientBulb.shine()).should_be('Light');
            // value_of(efficientBulb.getPower()).should_be(80);
        },

        'should not change prototype chain by augmenting' : function () {
            var EfficientBulb = new AP.Class({
                className : 'efficientBulb',
                initialize : function (o) {
                    this.setPower(o.power * 2);
                },
                mixins : [
                    Lamp
                ]
            });
            var efficientBulb = new EfficientBulb({ power : 40 });
            value_of(efficientBulb instanceof EfficientBulb).should_be_true();
            value_of(efficientBulb instanceof Lamp).should_be(false);
        }
    });
})();
