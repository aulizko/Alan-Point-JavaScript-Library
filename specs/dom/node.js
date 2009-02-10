(function () {
    var $ = AP.Node;
    
    describe('node', {
        before : function () {
            var temp = document.createElement('div');
            temp.id = 'testDiv';
            temp.appendChild(document.createElement('div'));
            document.body.appendChild(temp);
        },
        
        after : function () {
            var temp = document.getElementById('testDiv');
            temp.parentNode.removeChild(temp);
            temp = null;
        },
        
        'should exist at the AP namespace' : function () {
            value_of(!!AP.Node).should_be_true();
            value_of(typeof AP.Node).should_be('function');
        },
        
        // node element (s) access
        
        'should provide direct access to the node elements' : function () {
            var p = $('#testDiv div')[0];
            value_of(p.nodeName.toLowerCase()).should_be('div');
            value_of(p.parentNode.id).should_be('testDiv');
        },
        
        'should pass node as first param and its index at collection as second param at the each function callback' : function () {
            var p = $('#testDiv div');
            p.each(function (node, index) {
                value_of(!!node.nodeType).should_be_true();
            }, this);
        }
    });
})();