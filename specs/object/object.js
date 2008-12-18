(function () {
    describe('object', {
        'should exist into the global namespace' : function () {
            value_of(!!AP.Object).should_be_true();
            value_of(typeof AP.Object).should_be('function');
        },
        
        // AP.Object()
        
        'should create new object based on supplied object' : function () {
            var person = function (name, surname) {
                this.name = name;
                this.surname = surname;
            };
            
            person.prototype.talk = function() {
                return 'abracadabra';
            };
            
            
            var temp = new person('Adam', 'Moore');
            var talkingPerson = AP.Object(temp);
            
            value_of(talkingPerson.talk()).should_be('abracadabra');
            value_of(talkingPerson === temp).should_be_false();
            value_of(talkingPerson instanceof person).should_be_true();
        },
        
        // AP.Object.keys
        
        'should return array contains public properties of the object' : function () {
            var hash = {
                name : 'Adam',
                surname : 'Moore'
            };
            
            value_of(AP.Object.keys(hash)).should_be(['name', 'surname']);
        },
        
        // AP.Object.each
        
        'should iterate throush the public properties of the object' : function () {
            var res = [], hash = {
                name : 'Adam',
                surname : 'Moore'
            };
            AP.Object.each(hash, function (item) {res.push(item);});
            value_of(res).should_be(['Adam', 'Moore']);
        },
        
        // AP.Object.filter
        
        'should return only objects passed through the filter' : function () {
            var Person = {
                name : 'Adam',
                surname : 'Moore',
                doe : 'Google',
                weight : 123,
                height : 321,
                born : new Date()
            };
            
            value_of(AP.Object.filter(Person, function (prop) { return AP.Lang.isNumber(prop);})).should_be({
                weight : 123,
                height : 321
            });
        },
        
        // AP.Object.clean
        
        'should delete each properties with which value is null or undefined from passed in object' : function () {
            var dirtyObject = {
                name : 'Ards',
                surname : 'boo',
                street : undefined,
                home : null
            };
            var obj = AP.Object.clean(dirtyObject);
            
            value_of(obj).should_be({
                name : 'Ards',
                surname : 'boo'
            });
        },
        
        // AP.Object.map
        
        'should a mapping of the object' : function () {
            var less = {
                a : 1,
                b : 2,
                c : 3
            };
            
            var more = AP.Object.map(less, function (item) { return item * item; });
            value_of(more).should_be({
                a : 1,
                b : 4,
                c : 9
            });
        },
        
        // AP.Object.some
        
        'should return true if some of the values match the comparator, otherwise false' : function () {
            var less = {
                a : 1,
                b : 2,
                c : 3
            };
            
            value_of(AP.Object.some(less, function (item) { return item == 3; })).should_be_true();
            value_of(AP.Object.some(less, function (item) { return item == 'a'; })).should_be_false();
        },
        
        // AP.Object.every
        
        'should return true if every properties values match comparator, otherwise, false' : function () {
            var obj = {
                a : 1,
                b : 2,
                c : 3
            };
            
            value_of(AP.Object.every(obj, function (item) { return AP.Lang.isNumber(item); })).should_be_true();
            value_of(AP.Object.every(obj, function (item) { return item == 3; })).should_be_false();
        },
        
        // AP.Object.indexOf
        
        'should return the key of the value or null if not found' : function () {
            var obj = {
                a : 1,
                b : 2,
                c : 3
            };
            
            value_of(AP.Object.indexOf(obj, 1)).should_be('a');
            value_of(AP.Object.indexOf(obj, 'abracadabra')).should_be_null();
        }
    });
})();