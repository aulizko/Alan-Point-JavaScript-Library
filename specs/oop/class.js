(function () {
    var Bird = AP.Class.extend({
        className : 'bird',
        toString : function () { return this.className + ' ' + this.name; },
        init : function (name) {
            this.name = name;
        }
    }),
    Chicken = Bird.extend({
        className : 'chicken',
        init : function (name) {
            this.base(name);
        },
        canFly : function () {
            return false;
        },
        cackle : function () {
            return 'cackle';
        }
    }),
    StrangeChicken = Chicken.extend({
        className : 'strangeChiken',
        init : function (name) {
            this.base(name);
        },
        canFly : function () {
            return true;
        },
        cackle : function () {
            return 'strange ' + this.base();
        }
    });
    
    describe('class', {
        'should exist at the AP namespace' : function () {
            value_of(!!AP.Class).should_be_true();
            value_of(typeof AP.Class).should_be('function');
        },
        
        'should help to build hierarchy' : function () {
            var sc = new StrangeChicken('Garri');
            value_of(sc instanceof StrangeChicken).should_be_true();
            value_of(sc instanceof Chicken).should_be_true();
            value_of(sc instanceof Bird).should_be_true();
        },
        
        'should create prototype methods from provided configuration object' : function () {
            var sc = new StrangeChicken('Garri');
            value_of(typeof sc.canFly).should_be('function');
            value_of(sc.hasOwnProperty('canFly')).should_be_false();
        },
        
        'should allow to use base method' : function () {
            var sc = new StrangeChicken('Garri');
            value_of(sc.cackle()).should_be('strange cackle');
        }
    });
})();
