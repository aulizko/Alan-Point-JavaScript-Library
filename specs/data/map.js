(function () {

    var Map = AP.data.Map, L = AP.Lang;

    describe('map', {
        'should exists at the data namespace' : function () {
            value_of(!!AP.data.Map).should_be_true();
            value_of(typeof AP.data.Map).should_be('function');
        },
        'should allow to create independent instance with "new" operator' : function () {
            var a = new Map(), b = new Map();
            value_of(a != b).should_be_true();
            value_of(a !== b).should_be_true();
            a.add('abra', 'cadabra');
            b.add('john', 'doe');
            value_of(a.keys()).should_be(['abra']);
        },

        'should allow create map with initial values' : function () {
            var a = new Map({
                name : 'John',
                surName : 'Dow'
            });

            value_of(a.keys()).should_be(['name', 'surName']);
            value_of(a.get('name')).should_be('John');
        },

        /* add */

        'should add value to the appropriate key' : function () {
            var a = new Map();
            a.add('name', 'value');
            value_of(a.keys()).should_be(['name']);
            value_of(a.get('name')).should_be('value');
            var x = a.remove('name');
            value_of(a.keys()).should_be([]);
            value_of(x).should_be('value');
        },

        'should support method chaining' : function () {
            var a = new Map();
            a.add('name', 'John').add('surName', 'Doe');
            value_of(a.length).should_be(2);
            value_of(a.keys()).should_be(['name', 'surName']);
        },

        /* set */

        'shoud reassign new value to the key and return old value, or create new value and return null' : function () {
            var a = new Map({
                name : 'Joe'
            });

            value_of(a.set('name', 'Smith')).should_be('Joe');
            value_of(a.set('surName', 'Doe')).should_be(null);
        },
        
        /* remove */

        'shoud remove value and return it if exists' : function () {
            var a = new Map({
                name : 'Joe'
            });

            value_of(a.remove('name')).should_be('Joe');
            value_of(a.length).should_be(0);
            value_of(a.remove('name')).should_be(null);
        },

        /* isEmpty */

        'should be return true if empty and all that' : function () {
            var a = new Map();

            value_of(a.isEmpty()).should_be_true();
            a.add('name', 'Joe');
            value_of(a.isEmpty()).should_be_false();
        },
        
        /* empty */

        'should strip all values' : function () {
            var a = new Map({
                name : 'John',
                surName : 'Doe'
            });

            value_of(a.length).should_be(2);
            a.empty();
            value_of(a.length).should_be(0);
        },

        /* clean */

        'shoud remove all keys which values are undefined or null' : function () {
            var a = new Map({
                name : window.undefined,
                surName : null
            });

            a.clean();
            value_of(a.length).should_be(0);
            value_of(a.keys()).should_be([]);
        },

        /* get */

        'should return value if provided key exist, otherwise return null' : function () {
            var a = new Map({
                name : 'Joe'
            });

            value_of(a.get('name')).should_be('Joe');
            value_of(a.get('abracadabra')).should_be(null);
        },

        /* keys */
        'should return map of the keys' : function () {
            var a = new Map({
                name : 'Joe',
                surName : 'Smith',
                age : 23
            });

            value_of(a.keys()).should_be(['name', 'surName', 'age']);
        },

        /* length */

        'shoud return length of the map - how many elements it contains' : function () {
            var a = new Map({
                name : 'Joe',
                surName : 'Smith',
                age : 23
            });

            value_of(a.length).should_be(3);
            a.empty();
            value_of(a.length).should_be(0);
        },

        /* equal */

        'should return true if two maps contain similar keys and values map' : function () {
            var a = new Map({
                name : 'Joe',
                surName : 'Smith'
            }),
            b = new Map({
                name : 'John',
                age : 23
            });
            value_of(a.equal(b)).should_be_false();
            a.add('age', 23);
            b.set('name', 'Joe');
            b.add('surName', 'Smith');
            value_of(a.equal(b)).should_be_true();
        },

        /* toString */

        'should return pretty output to console' : function () {
            var a = new Map({
                name : 'Joe',
                surName : 'Smith'
            });
            value_of(a.toString()).should_be('{"name":"Joe","surName":"Smith"}');
        },

        /* valueOf */

        'should return something json object' : function () {
            var a = new Map({
                name : 'Joe',
                surName : 'Smith'
            });
            value_of(AP.Lang.compare(a.valueOf(), { name : 'Joe', surName : 'Smith' })).should_be_true();
        }
    });    
})();
