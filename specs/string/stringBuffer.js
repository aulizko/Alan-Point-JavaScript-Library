describe('stringBuffer', {
    'should exist into AP namespace' : function () {
        value_of(!!AP.StringBuffer).should_be_true();
        value_of(typeof AP.StringBuffer).should_be('function');
    },
    
    'should concatenate passed in strings' : function () {
        var stringBuffer = new AP.StringBuffer();
        stringBuffer.add('abra');
        stringBuffer.add('cadabra');
        value_of(stringBuffer.toString()).should_be('abracadabra');
    },
    
    'should clear stringBuffer for future use' : function () {
        var stringBuffer = new AP.StringBuffer();
        stringBuffer.add('abra');
        stringBuffer.add('slerkjt');
        stringBuffer.empty();
        value_of(stringBuffer.toString()).should_be('');
    },
    
    'should concatenate any number of strings, passed into constructor' : function () {
        var stringBuffer = new AP.StringBuffer('abra', 'cadabra');
        value_of(stringBuffer.toString()).should_be('abracadabra');
    },
    
    'should support chaining' : function () {
        var stringBuffer = new AP.StringBuffer();
        stringBuffer
            .add('abra')
            .add('cadabra');
        value_of(stringBuffer.toString()).should_be('abracadabra');
    }
});