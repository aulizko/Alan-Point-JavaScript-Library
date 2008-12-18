describe('string', {
    'should exist in the AP namespace' : function () {
        value_of(!!AP.String).should_be_true();
        value_of(typeof AP.String).should_be('object');
    },
    
    // AP.String.unescapeHTML
    
    'should strip all html entities from passed in string' : function () {
        var entities = '&gt;&lt;&quot;&#39;&#160;';
        value_of(AP.String.unescapeHTML(entities)).should_be('><"\' ');
    },
    
    // AP.String.capitalize
    
    'should capitalize word or sentence passed in' : function () {
        value_of(AP.String.capitalize('sler')).should_be('Sler');
        value_of(AP.String.capitalize('This is OUR NAME')).should_be('This Is Our Name');
    },
    
    // AP.String.pluralize
    
    'should pluralize passed in string' : function () {
        var units = {
            1 : 'рубль',
            2 : 'рубля',
            5 : 'рублей'
        };
        value_of(AP.String.pluralize(1, units)).should_be('1 рубль');
        value_of(AP.String.pluralize(3, units)).should_be('3 рубля');
        value_of(AP.String.pluralize(5, units)).should_be('5 рублей');
        value_of(AP.String.pluralize(101, units)).should_be('101 рубль');
        value_of(AP.String.pluralize(11, units)).should_be('11 рублей');
    },
   
   // AP.String.trim
   
   'should delete trail and heading spaces' : function () {
       value_of(AP.String.trim('   leading space')).should_be('leading space');
       value_of(AP.String.trim('trailing spaces     ')).should_be('trailing spaces');
       value_of(AP.String.trim('    spaces everywhere!!!     ')).should_be('spaces everywhere!!!');
   }
});