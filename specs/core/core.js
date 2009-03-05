describe('core', {
    'shoule exists as singleton object into global namespace' : function () {
        value_of(window.AP).should_not_be_undefined();
        value_of(window.AP).should_not_be_null();
        value_of(typeof window.AP).should_be('function');
    },
    
    'should have method namespace' : function () {
        value_of(AP.namespace).should_not_be_undefined();
        value_of(AP.namespace).should_not_be_null();
        value_of(typeof AP.namespace).should_be('function');
    },
    
    'should allow create packages and sub-packages with namespace method' : function () {
        AP.namespace('test');
        value_of(!!AP.test).should_be_true();
        value_of(typeof AP.test).should_be('object');
    },

    'should create subpackage for the project name passed in' : function () {
        
        AP.project('Test');
        value_of(AP.Project.Test).should_not_be_undefined();
        value_of(AP.Project.Test).should_not_be_null();
        value_of(typeof AP.Project.Test).should_be('object');
    
        // test that AP.Project.Test should be empty
        for (var prop in AP.Project.Test) {}
        value_of(prop).should_be(undefined);
        
        // test sub-packages
        AP.project('Test.SubPackage');
        value_of(AP.Project.Test.SubPackage).should_not_be_undefined();
        value_of(AP.Project.Test.SubPackage).should_not_be_null();
        value_of(typeof AP.Project.Test.SubPackage).should_be('object');
        // package Test should have exactly one property
        var count = 0;
        for (prop in AP.Project.Test) {
            count++;
        }
        value_of(count).should_be(1);
        
        prop = null;

        // test that AP.Project.Test should be empty
        for (prop in AP.Project.Test.SubPackage) {}
        value_of(prop).should_be_null;
        
        // test that AP.project('Test.AnotherOneSubPackage')
        // should not override existing package
        AP.project('Test.AnotherOneSubPackage');
        count = 0;
        for (prop in AP.Project.Test) {
            count++;
        }
        value_of(count).should_be(2);
        value_of(AP.Project.Test).should_include('AnotherOneSubPackage');
        value_of(AP.Project.Test).should_include('SubPackage');
    },
    
    'should have lambda function' : function () {
        value_of(AP.lambda).should_not_be_undefined();
        value_of(AP.lambda).should_not_be_null();
        value_of(typeof AP.lambda).should_be('function');
    },
    
    'if a function is passed in lambda, function should be returned': function(){
		var fn = function(a,b){ return a; };
		value_of(AP.lambda(fn)).should_be(fn);
	},

	'lambda should return a function that returns the value passed when called': function(){
		value_of(AP.lambda('hello world!')()).should_be('hello world!');
	},
	
	'should have log method' : function () {
	    value_of(AP.log).should_not_be_undefined();
        value_of(AP.log).should_not_be_null();
        value_of(typeof AP.log).should_be('function');
	},
	
	'should have generateUID method' : function () {
	    value_of(AP.generateUID).should_not_be_undefined();
        value_of(AP.generateUID).should_not_be_null();
        value_of(typeof AP.generateUID).should_be('function');
	},
	
	'generateUID should return unique value based on incremental uidIndex value' : function () {
	    var uids = [], i = 5;
	    while(i--) {
	        uids.push(AP.generateUID());
	    }
	    value_of(uids).should_have(5, 'items');
	    for (i = 0; i < 5; i++) {
	        value_of(uids).should_include('ap-' + i);
	    }	    
	},
	
	'generateUID can take custom prefix argument and return new UID based on it' : function () {
	    value_of(AP.generateUID('customPrefix')).should_be('customPrefix-5');
	},
	
	'should have stamp method' : function () {
	    value_of(AP.stamp).should_not_be_undefined();
        value_of(AP.stamp).should_not_be_null();
        value_of(typeof AP.stamp).should_be('function');
	},
	
	'stamp should create _uid property on the passed object, if it has no one yet' : function () {
	    var obj = {};
	    AP.stamp(obj);
	    value_of(obj).should_include('_uid');
	    value_of(obj._uid).should_be('ap-6');
	    AP.stamp(obj);
	    value_of(obj).should_include('_uid');
	    value_of(obj._uid).should_be('ap-6');
	},
	
	'should have add method' : function () {
	    value_of(AP.add).should_not_be_undefined();
        value_of(AP.add).should_not_be_null();
        value_of(typeof AP.add).should_be('function');
	},
	
	'add method should add module name into AP.config.envinronment.modules object' : function () {
	    AP.add('briteModule', function () {}, '0.0.1');
	    value_of(AP.config.envinronment.modules).should_include('briteModule');
	    value_of(typeof AP.config.envinronment.modules.briteModule).should_be('object');
	},
	
	'add method should expand string version into version object' : function () {
	    var m = AP.config.envinronment.modules;
	    AP.add('anotherOneModule', function () {}, '1.2.3');
	    value_of(typeof m.anotherOneModule).should_be('object');
	    value_of(m.anotherOneModule).should_include('version');
	    value_of(m.anotherOneModule.version).should_include('major');
	    value_of(m.anotherOneModule.version.major).should_be('1');
	    value_of(m.anotherOneModule.version).should_include('minor');
	    value_of(m.anotherOneModule.version.minor).should_be('2');
	    value_of(m.anotherOneModule.version).should_include('micro');
	    value_of(m.anotherOneModule.version.micro).should_be('3');
	},
	
	'add method should check requirements and will throw error if there is no present required module name' : function () {
	    var m = AP.config.envinronment.modules;
	    try {
	        AP.add('secondModule', function () {}, '1.2.3', [{ name : 'firstModule' }]);
	    } catch (error) {
	        value_of(error.message)
	            .should_be('Module registration failure: module secondModule requires module firstModule');
	    }
	},
	
	'add method should check requirements and will throw error if specified version is less then present' : function () {
	    AP.add('firstModule', function () {}, '0.0.1');
	    try {
	        AP.add('secondModule', function () {}, '1.2.3', [{ name : 'firstModule', minVersion : '1.3.3' }]);
	    } catch (error) {
	        value_of(error.message)
	            .should_be('Module registration failure: module secondModule requires module firstModule version at least 1.3.3');
	    }
	},
	
	'add method should check requirements and will throw error if specified version is more then present' : function () {
	    AP.add('thirdModule', function () {}, '2.0.1');
	    try {
	        AP.add('fourthModule', function () {}, '1.2.3', [{ name : 'thirdModule', maxVersion : '1.3.3' }]);
	    } catch (error) {
	        value_of(error.message)
	            .should_be('Module registration failure: module fourthModule requires module thirdModule version no greater than 1.3.3');
	    }
	},
	
	'add method should check requirements and will differentiate major, minor, micro number in version requirement' : function () {
	    var m = AP.config.envinronment.modules;
	    AP.add('fifthModule', function () {}, '1.2.3');
	    value_of(m).should_include('fifthModule');
	    
	    AP.add('sixsModule', function () {}, '1.2.3', [{ name : 'fifthModule', minVersion : '1' }]);
	    value_of(m).should_include('sixsModule');
	    AP.add('sevensModule', function () {}, '1.2.3', [{ name : 'fifthModule', minVersion : '1.2' }]);
	    value_of(m).should_include('sevensModule');
	    
	    try {
	        AP.add('eightsModule', function () {}, '1.2.3', [{ name : 'fifthModule', minVersion : '2' }]);
	    } catch (error) {
	        value_of(error.message)
	            .should_be('Module registration failure: module eightsModule requires module fifthModule version at least 2');
	    }
	    
	    AP.add('ninesModule', function () {}, '1.2.3', [{ name : 'fifthModule', maxVersion : '1' }]);
	    value_of(m).should_include('ninesModule');
	    AP.add('tensModule', function () {}, '1.2.3', [{ name : 'fifthModule', maxVersion : '1.2' }]);
	    value_of(m).should_include('tensModule');
	    
	    try {
	        AP.add('elevensModule', function () {}, '1.2.3', [{ name : 'fifthModule', maxVersion : '1.1' }]);
	    } catch (error) {
	        value_of(error.message)
	            .should_be('Module registration failure: module elevensModule requires module fifthModule version no greater than 1.1');
	    }
	},
	
	'add method should do nothing if module with present name already exist with same or greater version' : function () {
	    var m = AP.config.envinronment.modules;
	    AP.add('moduleWithSameName', function () {}, '1.2.3');
	    value_of(m).should_include('moduleWithSameName');
	    value_of(m.moduleWithSameName.version).should_be({major: 1, minor: 2, micro: 3});
	    
	    AP.add('moduleWithSameName', function () {}, '1.2.3');
	    value_of(m).should_include('moduleWithSameName');
	    value_of(m.moduleWithSameName.version).should_be({major: 1, minor: 2, micro: 3});
	    
	    AP.add('moduleWithSameName', function () {}, '0.0.1');
	    value_of(m).should_include('moduleWithSameName');
	    value_of(m.moduleWithSameName.version).should_be({major: 1, minor: 2, micro: 3});
	},
	
	'add method should register module with same name, if provided version is more than existing' : function () {
	    var m = AP.config.envinronment.modules;
	    AP.add('moduleWithSameName', function () {}, '1.2.3');
	    value_of(m).should_include('moduleWithSameName');
	    value_of(m.moduleWithSameName.version).should_be({major: 1, minor: 2, micro: 3});
	    
	    AP.add('moduleWithSameName', function () {}, '2.13.256');
	    value_of(m).should_include('moduleWithSameName');
	    value_of(m.moduleWithSameName.version).should_be({major: 2, minor: 13, micro: 256});
	},
	
	'add method should pass AP instance into module binding function' : function () {
	    value_of(AP.WOW).should_be_undefined();
	    AP.add('wow', function (A) { A.WOW = A.WOW || {}; }, '1.2.3');
	    value_of(typeof AP.WOW).should_be('object');
	}
});
