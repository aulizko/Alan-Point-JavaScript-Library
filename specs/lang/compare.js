(function () {
    var compare = AP.Lang.compare;
    describe('compare', {
        'should return true if equal number primitives passed in' : function () {
            var i = 10;
            while(i--) {
                value_of(compare(i, i)).should_be_true();
            }
        },
        
        'should return true if equal number object passed in' : function () {
            var i = 10, t;
            while(i--) {
                t = new Number(i);
                value_of(compare(t, t)).should_be_true();
            }
        },
        
        'should return false if different number primitives passed in' : function () {
            var i = 10;
            while(i--) {
                value_of(compare(i, i + i + 1)).should_be_false();
            }
        },
        
        'should return false if different number objects passed in' : function () {
            var i = 10, t;
            while(i--) {
                t = new Number(i + i + 1);
                value_of(compare(new Number(i), t)).should_be_false();
            }
        },
        
        'should return true if equal boolean values passed in' : function () {
            value_of(compare(true, true)).should_be_true();
            value_of(compare(false, false)).should_be_true();
        },
        
        'should return true if equal boolean objects passed in' : function () {
            value_of(compare(new Boolean(false), new Boolean(false))).should_be_true();
        },
        
        'should return false if different boolean objects passed in' : function () {
            value_of(compare(new Boolean(false), new Boolean(true))).should_be_false();
        },
        
        'should return true if Date objects with equal value passed in' : function () {
            value_of(compare(new Date(), new Date())).should_be_true();
        },
        
        'should return false if passed values is Date objects with different value' : function () {
            var a = new Date();
            setTimeout(function () {
                value_of(compare(new Date(), a)).should_be_false();
            }, 2);
        },
        
        'should return true if both passed values is null' : function () {
            value_of(compare(null, null)).should_be_true();
        },
        
        'should return true if both passed values is undefined' : function () {
            var abra, cadabra;
            value_of(compare(abra, cadabra)).should_be_true();
        },
        
        'should return true if equal strings primitives passed' : function () {
            value_of(compare('aAbb', 'aAbb')).should_be_true();
        },
        
        'should return true if empty string primitives passed' : function () {
            value_of(compare('', '')).should_be_true();
        },
        
        'should return false if different string primitives passed' : function () {
            value_of(compare('ali   2u34', 'sdlfkjv@IUIUB')).should_be_false();
            value_of(compare('a', 'A')).should_be_false();
        },
        
        'should return true if equal string objects passed in' : function () {
            // value_of(compare(new String(''), new String(''))).should_be_true();
            value_of(compare(new String('aaBB'), new String('aaBB'))).should_be_true();
        },
        
        'should return true if passed string primitive and object with equal values' : function () {
            value_of(compare(new String('abracadabra'), 'abracadabra')).should_be_true();
            value_of(compare(new String(''), '')).should_be_true();
        },
        
        'should_return true if passed number primitive and object with equal values' : function () {
            value_of(compare(new Number(1), 1)).should_be_true();
            value_of(compare(new Number(10), 10)).should_be_true();
        },
        
        'should return true if equal functions passed in' : function () {
            value_of(compare(function () {}, function () {})).should_be_true();
        },
        
        'should return false if different functions passed in' : function () {
            value_of(compare(function () {}, function () {return 12;})).should_be_false();
        },
        
        'should return true if empty arrays passed in' : function () {
            value_of(compare([], [])).should_be_true();
            value_of(compare(new Array(), new Array ()));
        },
        
        'should return true if plain arrays with equal elements passed in' : function () {
            value_of(compare([1, 2, 3], [1, 2, 3])).should_be_true();
            value_of(compare([1, 'arb', 3], [1, 'arb', 3])).should_be_true();
            value_of(compare(new Array(1, 2, 3), new Array(1, 2, 3))).should_be_true();
            value_of(compare(new Array(1, 'arb', 3), new Array(1, 'arb', 3))).should_be_true();
        },
        
        'should return true if plain arrays with different elements passed in' : function () {
            value_of(compare([1], [])).should_be_false();
            value_of(compare([1], ['abra'])).should_be_false();
            value_of(compare(new Array(1), new Array())).should_be_false();
            value_of(compare(new Array(1, 2, 3), new Array('a', 'b', 'c'))).should_be_false();
        },
        
        'should return false if plain arrays with different number of elements passed in' : function () {
            value_of(compare([1], [1, 2, 3])).should_be_false();
            value_of(compare(new Array('arb'), new Array('1', 'a', 'c'))).should_be_false();
        },
        
        'should return true if multidimensional arrays with equal elements passed in' : function () {
            value_of(compare([1, [2, 3], 3], [1, [2, 3], 3])).should_be_true();
            value_of(compare(new Array('arb', [1, 2], new Array ('arb', 2)), new Array('arb', [1, 2], new Array ('arb', 2)))).should_be_true();
        },
        
        'should return true if empty literal objects passed in' : function () {
            value_of(compare({}, {})).should_be_true();
        },
        
        'should return true if empty objects passed in' : function () {
            value_of(compare(new Object(), new Object())).should_be_true();
        },
        
        'should return true if passed objects with equal keys and values' : function () {
            value_of(compare({ name : 'john', surname: 'doe' }, { name : 'john', surname: 'doe' })).should_be_true();
        },
        
        'should return false if passed objects with different number of keys' : function () {
            value_of(compare({ name : 'john', surname: 'doe' }, { name : 'john' })).should_be_false();
        },
        
        'should return true if passed objects with properties as equal objects passed in' : function () {
            value_of(compare({ name : 'john', surname : 'doe', passport : { seria : 1988, number : 100035 }}, 
                { name : 'john', surname : 'doe', passport : { seria : 1988, number : 100035 }})).should_be_true();
        },
        
        'should return false if objects with different objects as subproperties passed in' : function () {
            value_of(compare({ name : 'john', surname : 'doe', passport : { seria : 1988, number : 100035 }}, 
                { name : 'john', surname : 'doe', passport : { seria : 1980, number : 100035 }})).should_be_false();
        },
        
        'should return false if primitives compared with objects' : function () {
            value_of(compare(1, {})).should_be_false();
            value_of(compare(1, [])).should_be_false();
            value_of(compare('1', {})).should_be_false();
            value_of(compare('1', [])).should_be_false();
            value_of(compare(true, {})).should_be_false();
            value_of(compare(true, [])).should_be_false();
            value_of(compare(new Date(), 1)).should_be_false();
            value_of(compare(new Date(), '1')).should_be_false();
            value_of(compare(new Date(), true)).should_be_false();
            value_of(compare(function () {return false;}, 1)).should_be_false();
            value_of(compare(function () {return false;}, '1')).should_be_false();
            value_of(compare(function () {return false;}, true)).should_be_false();
            
        },
        
        'should return false if object of different types passed in' : function () {
            value_of(compare(new Date(), {})).should_be_false();
            value_of(compare(new Date(), [])).should_be_false();
            value_of(compare(new Date(), function () {return false;})).should_be_false();
            value_of(compare(function () {return false;}, {})).should_be_false();
            value_of(compare(function () {return false;}, [])).should_be_false();
            value_of(compare([], {})).should_be_false();
        }
    });
})();