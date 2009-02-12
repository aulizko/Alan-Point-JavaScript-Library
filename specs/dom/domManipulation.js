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
        },
        
        // attribute manipulation
        
        'should set arbitrary element attribute' : function () {
            var p = document.getElementById('testDiv');
            D.setAttribute(p, 'alanpoint', '3444');
            value_of(p.alanpoint).should_be('3444');
        },
        
        'should get attribute value' : function () {
            var p = document.getElementById('testDiv');
            p.alanpoint = '3444';
            value_of(D.getAttribute(p, 'alanpoint')).should_be('3444');
        },
        
        'should search inside style property if necessary in purpose to get attribute value' : function () {
            var p = document.getElementById('testDiv');
            value_of(D.getAttribute(p, 'visibility')).should_be('visible');
        },
        
        'should search inside className attribute if class attribute value asked for' : function () {
            var p = document.getElementById('testDiv');
            p.className = 'rock';
            value_of(D.getAttribute(p, 'class')).should_be('rock');
        },
        
        'should convert class attribute name to the className attribute' : function () {
            var p = document.getElementById('testDiv');
            D.setAttribute(p, 'class', 'rock');
            value_of(p.className).should_be('rock');
        },
        
        'should convert css-like attribute names into camelCase properties' : function () {
            var p = document.getElementById('testDiv');
            D.setAttribute(p, 'background-color', 'ccc');
            value_of(p.style.backgroundColor).should_be('#cccccc');
        }
    });
})();