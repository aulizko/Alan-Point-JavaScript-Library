/**
 * Fast string concatenation
 * @module ap
 * @submodule stringBuffer
 */
AP.add('stringBuffer', function (A) {
    /**
     * Fast string buffer utility - usefull for robust string concatenation
     * @class StringBuffer
     * @constructor
     * @param strings* {String} any number of strings to concatenate
     */
    A.StringBuffer = function () {
        /**
         * Inner array used to store string snippets
         * @property {Array} buffer
         * @private
         */
        this.buffer = [];
        /**
         * Inner index used to manage buffer indexes
         * @property {Number} index
         * @private
         */
        this.index = 0;
        var i, length = arguments.length, arg;
        for (i = 0; i < length; i++) {
            arg = arguments[i];
            if (!!arg) {
                this.buffer[this.index++] = arg;
            }
        }
    };
    /**
     * Add string snippet to stringbuffer. As method returns stringBuffer object itself, it is possible to chain methods
     * @method add
     * @param elem {String}
     * @public
     * @return {StringBuffer}
     */
    A.StringBuffer.prototype.add = function(e) {
        this.buffer[this.index++] = e;
        return this;
    };
    
    /**
     * Return stored string snippets as one concatenated string
     * @method toString
     * @public
     * @return {String}
     */
    A.StringBuffer.prototype.toString = function () {
        return this.buffer.join('');
    };
    
    /**
     * Clear stored string snippets
     * @method empty
     * @public
     */
    A.StringBuffer.prototype.empty = function() {
        this.buffer.length = 0;
        this.index = 0;
    };
    
}, '1.0.2');