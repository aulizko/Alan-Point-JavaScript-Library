AP.add('node', function (A) {
    var Q = A.QuerySelector;
    A.Node = function (query) {
        return new El(A.Array(Q(query)));
    };
    
    var El = function (nodes) {
        A.Array.each(nodes, function (value, index) {
            this[index] = value;
        }, this);
        return this;
    };
    
    El.prototype.each = function (fn, c) {
        return A.Array.each(this.nodes, fn, c);
    };
    
    // A.Node.prototype = {
    //     each : function (fn, c) {
    //         A.Array.each(this.nodes, fn, c);
    //     }
    // };
    
}, '0.0.1', [
    { name : 'querySelector', minVersion : '0.0.1' },
    { name : 'array', minVersion : '1.0.0' }
]);