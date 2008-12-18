describe('oo', {
    'should exist in the AP namespace' : function () {
        value_of(!!AP.OO).should_be_true();
        value_of(typeof AP.OO).should_be('object');
    },
    
    // OO.merge
    
    'should create new object from passed in, same properties should be overriden' : function () {
        var set1 = { foo : "foo" };
        var set2 = { foo : "BAR", bar : "bar" };
        var set3 = { foo : "FOO", baz : "BAZ" };
        value_of(AP.OO.merge(set1, set2, set3)).should_be({
            foo : 'FOO',
            bar : 'bar',
            baz : 'BAZ'
        });
    },
    
    // OO.mix
    
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
        
        AP.OO.mix(person, logger);
        value_of(!!person.myNameIs).should_be_true();
    },
    
    // OO.augment
    
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
            console.log(a);
            messageBoard.push(a);
        };
        
        AP.OO.augment(person, logger);
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
            console.log(a);
            messageBoard.push(a);
        };
        
        AP.OO.augment(person, logger);
        var Adam = new person('Adam', 'Moore');
        
        value_of(Adam instanceof person).should_be_true();
        value_of(Adam instanceof logger).should_be_false();
    }
    
    // OO.extend
    
    
    
    
    
    
    
    
    
    // OO.clone
    
    
    // OO.aggregate
});