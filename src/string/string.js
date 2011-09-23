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
    var S = A.String, L = A.Lang, __link;

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
     * Realization taken from Steven Levitahn trim11 implementation http://blog.stevenlevithan.com/archives/faster-trim-javascript
     * @method trim
     * @static
     * @param s {String} the string to trim
     * @return {string} the trimmed string
     */
    S.trim = function (s) {
        var str = s.replace(/^\s\s*/, ''),
            ws = /\s/,
            i = str.length;
        while (ws.test(str.charAt(--i))) {};
        return str.slice(0, i + 1);
    };

    S.qualifyPath = function (source) {
        if (!__link) {
            __link = document.createElement('a');
        }
        __link.href = source;
        return __link.href;
    };

    S.convertHtmlEntities = function (value) {
        return value
            .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
            .replace(/&bdquo;/g, '„').replace(/&ldquo;/g, '“')
            .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&minus;/g, '−')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&lsquo;/g, '‘').replace(/&rsquo;/g, '’')
            .replace(/&nbsp;/g, ' ')
            .replace(/&trade;/g, '™').replace(/&reg;/g, '®').replace(/&copy;/g, '©')
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, '\'')
            .replace(/&[a-z]+;/ig, '');
    };

}, '0.0.2', [
    {
        name : 'lang',
        minVersion : '0.0.1'
    }
]);