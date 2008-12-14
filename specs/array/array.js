describe('array', {
    'should exist into AP global object' : function () {
        value_of(!!AP.Array).should_be_true();
        value_of(typeof AP.Array).should_be('function');
    },
    
    'should return array if passing natural array' : function () {
        value_of(AP.Lang.isArray(AP.Array([1,2,3]))).should_be_true();
    },
    
    'should return array if node collection passed in' : function () {
        var temp = document.createElement('div');
        document.body.appendChild(temp);
        temp.innerHTML = '<span>Something</span>';
        value_of(AP.Lang.isArray(AP.Array(temp.childNodes))).should_be_true();
    },
    
    'should return array if arguments object passed in' : function () {
        (function () {
            value_of(AP.Lang.isArray(AP.Array(arguments))).should_be_true();
        })(1, 2, 3);
    },
    
    'should return array containing one element if primitiv passed in' : function () {
        var temp = AP.Array(1);
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
   
        temp = AP.Array('1');
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
        
        temp = AP.Array(true);
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
    },
    
    'should return array containing one element if date object passed in' : function () {
        var temp = AP.Array(new Date());
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
    },
    
    'should return array containing one element if function object passed in' : function () {   
        var temp = AP.Array(new Function('a', 'return 12'));
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
        
        temp = AP.Array(function () {return 1231;});
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
    },
    
    'should return array containing one element if literal object passed in' : function () {
        var temp = AP.Array({ name : 'abracadabra', surname : 'aladdin' });
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
    },
    
    'should return array containing one element if object passed in' : function () {
        var temp = new Object();
        temp.name = 'John';
        temp.surname = 'Doe';
        temp = AP.Array(temp);
        value_of(AP.Lang.isArray(temp)).should_be_true();
        value_of(temp.length).should_be(1);
    },

    // test

    'should return 1 if array passed in' : function () {
        value_of(AP.Array.test([1, 2, 3])).should_be(1);
    },
    
    'should return 2 if dom node collection passed in' : function () {
        var temp = document.createElement('div');
        document.body.appendChild(temp);
        temp.innerHTML = '<span>Something</span>';
        value_of(AP.Array.test(temp.childNodes)).should_be(2);
    },
    
    'should return 2 if arguments object passed in' : function () {
        var temp = function () {
            return AP.Array.test(arguments);
        };
        
        value_of(temp(1,2,3)).should_be(2);
        value_of(temp('1', true, 3)).should_be(2);
    },
    
    'should return 2 if String object passed in' : function () {
        value_of(AP.Array.test(new String('abracadabra'))).should_be(2);
    },
    
    'should return 0 in any other cases' : function () {
        var test = AP.Array.test;
        value_of(test(1)).should_be(0);
        value_of(test('1')).should_be(0);
        value_of(test(true)).should_be(0);
        value_of(test(new Date())).should_be(0);
        value_of(test(new Number(123))).should_be(0);
        value_of(test(new Function ('nam', 'return 12;'))).should_be(0);
        value_of(test(function () {return false;})).should_be(0);
        value_of(test({})).should_be(0);
        value_of(test({name : 'abracadabra', follow : true})).should_be(0);
    },
    
	// filter

	'should filter an array': function(){
		var array = [1,2,3,0,0,0];
		value_of(AP.Array.filter(array, function (item) { return item > 0; })).should_be(array.splice(0,3));
	},

	// Array.clean

	'should clean an array from undefined and null values': function(){
		var array = [null, 1, 0, true, false, "foo", undefined];
		var arr = AP.Array.clean(array);
		value_of(arr).should_be([1, 0, true, false, "foo"]);
	},

	// Array.map

	'should return a mapping of an array': function(){
		var arr = AP.Array.map([1,2,3,0,0,0], function(item){
			return (item + 1);
		});

		value_of(arr).should_be([2,3,4,1,1,1]);
	},

	// Array.every

	'should return true if every item matches the comparator, otherwise false': function(){
	    value_of(AP.Array.every([1, 2, 3, 0, 0, 0], function (item) { return AP.Lang.isNumber(item); })).should_be_true();
        value_of(AP.Array.every(['1', 2, 3, 0], function (item) { return AP.Lang.isNumber(item); })).should_be_false();
	},

	// Array.some

	'should return true if some of the items in the array match the comparator, otherwise false': function(){
	    value_of(AP.Array.some(['1',2,3,0], function (item) { return AP.Lang.isNumber(item); })).should_be_true();
        value_of(AP.Array.some(['1','2','3','0'], function (item) { return AP.Lang.isNumber(item); })).should_be_false();
	},

	// Array.indexOf

	'should return the index of the item': function(){
        value_of(AP.Array.indexOf([1,2,3,0,0,0], 0)).should_be(3);
	},

	'should return -1 if the item is not found in the array': function(){
        value_of(AP.Array.indexOf([1,2,3,0,0,0], 'not found')).should_be(-1);
	},

	// Array.erase

	'should remove all items in the array that match the specified item': function(){
	    value_of(AP.Array.erase([1,2,3,0,0,0], 0)).should_be([1,2,3]);
	},

	// Array.hash

	'should create hash with elements of first passed array as keys and elements of second passed array as values': function(){
        value_of(AP.Array.hash(['a', 'b', 'c', 'd'], [1,2,3,0,0,0])).should_be({a:1, b:2, c:3, d:0});
	},
	
	// Array.unique
	
	'should remove duplicate elements in passed array' : function () {
	    value_of(AP.Array.unique([1, 1, 2, 3, 'abra', 'abra'])).should_be([1,2,3,'abra']);
	}

});