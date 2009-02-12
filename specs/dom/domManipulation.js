(function () {
    var D = AP.DomManipulation;
    function traverse (root) {
        if (!root.nodeType) return null;
        var node = root.firstChild, nodes = [node], i = 1;
        while(node = node.nextSibling) {
            nodes[i++] = node;
        }
        return nodes;
    };
    describe('domManipulation', {
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
            value_of(!!AP.DomManipulation).should_be_true();
            value_of(typeof AP.DomManipulation).should_be('object');
        },
        
        // setInnerHTML
        
        'should replace innerHTML with passed code' : function () {
            var p = document.getElementById('testDiv');
            p = D.setInnerHTML(p, '<span>this is span</span>');
            
            var node, nodes = traverse(p), i = nodes.length - 1;
            for (; i; i--) {
                node = nodes[i];
                if (node.nodeType != 3) {
                    nodes.splice(i, 1);
                }
            }
            value_of(nodes.length).should_be(1);
            value_of(nodes[0].nodeName.toLowerCase()).should_be('span');
        },
        
        // empty
        
        'should delete all child nodes' : function () {
            var p = document.getElementById('testDiv');
            p = D.empty(p);
            value_of(p.innerHTML).should_be('');
        }
    });
})();