describe('oop', {
    'should exist in the AP namespace' : function () {
        value_of(!!AP.OOP).should_be_true();
        value_of(typeof AP.OOP).should_be('object');
    },
    
    // OOP.merge
    
    'should create new object from passed in, same properties should be overriden' : function () {
        var set1 = { foo : "foo" };
        var set2 = { foo : "BAR", bar : "bar" };
        var set3 = { foo : "FOOP", baz : "BAZ" };
        value_of(AP.OOP.merge(set1, set2, set3)).should_be({
            foo : 'FOOP',
            bar : 'bar',
            baz : 'BAZ'
        });
    },
    
    // OOP.mix
    
    'should mix public property of one object to another one' : function () {
        var person = function () {
            var name = 'Adrian', surname = 'Pelliny';
            
            return {
                myNameIs : function () {
                    var fullName = name + ' ' + surname;
                    this.log(fullName);
                    return fullName;
                }
            };
        }();
        var logger = function () {
           return {
               log : function (a) {
                   console.log(a);
               }
           }; 
        }();
        
        AP.OOP.mix(person, logger);
        value_of(!!person.myNameIs).should_be_true();
    },
    
    // OOP.augment
    
    'should copy prototype methods of the supplier object to the resiver' : function () {
        var messageBoard = [];
        var person = function (name, surname) {
            this.name = name;
            this.surname = surname;
        };
        person.prototype.fullName = function() {
            var fullName = this.name + ' ' + this.surname;
            this.log(fullName);
            return fullName;
        };
        
        var logger = function () {};
        logger.prototype.log = function(a) {
            messageBoard.push(a);
        };
        
        AP.OOP.augment(person, logger);
        var Adam = new person('Adam', 'Moore');
        value_of(!!Adam.log).should_be_true();
        Adam.fullName();
        value_of(messageBoard).should_be(['Adam Moore']);
    },
    
    'should not override prototype chain' : function () {
        var messageBoard = [];
        var person = function (name, surname) {
            this.name = name;
            this.surname = surname;
        };
        person.prototype.fullName = function() {
            var fullName = this.name + ' ' + this.surname;
            this.log(fullName);
            return fullName;
        };
        
        var logger = function () {};
        logger.prototype.log = function(a) {
            messageBoard.push(a);
        };
        
        AP.OOP.augment(person, logger);
        var Adam = new person('Adam', 'Moore');
        
        value_of(Adam instanceof person).should_be_true();
        value_of(Adam instanceof logger).should_be_false();
    },
    
    // OOP.extend
    
    'should extend passed object' : function () {
        var Bird = function (name) {
            this.name = name;
        };
        Bird.prototype.isFlightAble = true;
        Bird.prototype.whatIsYourName = function() {
            return this.name;
        };
        var raven = new Bird('raven');
        var Chiken = function (name) {
            this.constructor.superclass.constructor.call(this, name);
        };
        AP.OOP.extend(Chiken, Bird);
        Chiken.prototype.isFlightAble = false;
        var nab = new Chiken('nab');
        value_of(nab.isFlightAble).should_be_false();
        value_of(raven.isFlightAble).should_be_true();
        value_of(nab instanceof Chiken).should_be_true();
        value_of(nab instanceof Bird).should_be_true();
    }
});