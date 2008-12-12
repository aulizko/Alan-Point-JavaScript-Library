/**
 * AP string utilites
 * @module ap
 * @submodule string
 */
AP.add("string", function (A) {
    /**
     * Misc string utilites
     * @class String
     */
    A.String = A.String || {};
    var S = A.String, L = A.Lang;
    /**
     * replace escaped HTML entities such as &amp;gt; to the valid html symbols
     * @method unescapeHTML
     * @for AP~String
     * @param rawHTMLCode {String} html code with escaped symbols
     * @return {HTMLCode}
     */
    S.unescapeHTML = function(rawHTMLCode) {
        return rawHTMLCode.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"')
          .replace(/&#39;/g, '\'').replace(/&#160;/g, ' ').replace(/&/g, '&amp;');
    };

    /**
     * Change first letter to uppercase
     * @method capitalize
     * @param word {String} word to capitalize (actually, it can be not even word, but complete sentence)
     * @return {String} capitalized word
     */
    S.capitalize = function (/* String */ word) {
        if (!L.isString(word)) {
            return null;
        }
        return word.replace(/\w+/g, function(a){
           return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
        });
    };

    S.pluralize = function (number, forms) {
        var temp, safeNumber = number;
        number = Math.abs(number) %100;
        temp = number % 10;
        if (number > 10 && number < 20) return safeNumber + ' ' + forms[5];
        if (temp > 1 && temp < 5) return safeNumber + ' ' + forms[2];
        if (number == 1) return safeNumber + ' ' + forms[1];
        return safeNumber + ' ' + forms[5];
    };

    /**
     * Fast string buffer utility - usefull for robust string concatenation
     * @class StringBuffer
     * @todo think about non-singleton usage
     */
    A.StringBuffer = A.StringBuffer || function () {
        var
            /**
             * Inner array used to store string snippets
             * @property {Array} buffer
             * @private
             */
            buffer = [],
            /**
             * Inner index used to manage buffer indexes
             * @property {Number} index
             * @private
             */
            index = 0;

        return {

            /**
             * Add string snippet to stringbuffer. As method returns stringBuffer object itself, it is possible to chain methods
             * @method add
             * @param elem {String}
             * @public
             * @return {StringBuffer}
             */
            add : function (elem) {
                buffer[index++] = elem;
                return this;
            },

            /**
             * Return stored string snippets as one concatenated string
             * @method toString
             * @public
             * @return {String}
             */
            toString : function () {
                return buffer.join('');
            }
        };
    }();

}, '0.0.1');