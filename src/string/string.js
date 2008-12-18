/**
 * AP string utilites
 * @module ap
 * @submodule string
 */
AP.add('string', function (A) {
    
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
    
    /**
     * Return pluralized string
     * @method pluralize
     * @param number {Number} a number
     * @param forms {Object} object, containing three forms of the word. The three forms must be included as properties
     * with names 1, 2, 3
     * @return {String} number, space and word in the right form
     */
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
     * Returns a string without any leading or trailing whitespace.  If 
     * the input is not a string, the input will be returned untouched.
     * @method trim
     * @static
     * @param s {string} the string to trim
     * @return {string} the trimmed string
     */
    S.trim = function (s) {
        try {
            return s.replace(/^\s+|\s+$/g, "");
        } catch(e) {
            return s;
        }
    };
}, '0.0.1', [
    {
        name : 'lang',
        minVersion : '0.0.1'
    }
]);