/**
 * Fast string concatenation
 * @module ap
 * @submodule stringBuffer
 */
AP.add('stringBuffer', function (A) {
    var ie6 = A.Browser.trident == 6;
    
    /**
     * Fast string buffer utility - usefull for robust string concatenation
     * @class StringBuffer
     * @constructor
     * @param strings* {String} any number of strings to concatenate
     */
    A.StringBuffer = (ie6) ?
        function () {
            this.buffer = [];
            
            this.index = 0;
            
            var i = 0, arg;
            while (arg = arguments[i++]) {
                this.buffer[this.index++] = arg;
            }
        } :
        function () {
            this.buffer = '';
            
            var i = 0, arg;
            while (arg = arguments[i++]) {
                this.buffer += arg;
            }
        };
    
    
    /**
     * Add string snippet to stringbuffer. As method returns stringBuffer object itself, it is possible to chain methods
     * @method add
     * @param e {String}
     * @public
     * @return {StringBuffer}
     */
    A.StringBuffer.prototype.add = (ie6) ?
        function(e) {
            this.buffer[this.index++] = e;
            return this;
        } :
        function (e) {
            this.buffer += e;
        };
    
    /**
     * Return stored string snippets as one concatenated string
     * @method toString
     * @public
     * @return {String}
     */
    A.StringBuffer.prototype.toString = (ie6) ?
        function () {
            return this.buffer.join('');
        } :
        function () {
            return this.buffer;
        };
    
    /**
     * Clear stored string snippets
     * @method empty
     * @public
     */
    A.StringBuffer.prototype.empty = (ie6) ?
        function () {
            this.buffer.length = 0;
            this.index = 0;
        } :
        function () {
            this.buffer = '';
        };
    
}, '1.0.3', [
    { name : 'browser', minVersion : '0.0.2' }
]);