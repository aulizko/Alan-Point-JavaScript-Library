AP.add('templateEngine', function (A) {
    /**
     * Fast and robust template engine
     * @module AP
     * @class TemplateEngine
     */
    A.TemplateEngine = A.TemplateEngine || {
        /**
         * Inner silo, which store compiled templates
         * @field templates
         */
        templates : {}
    };
    
    var T = A.TemplateEngine, L = A.Lang, Ar = A.Array, O = A.Object;
    /**
     * Convert template from the string to the json object for fast processing
     * Register result json object as inner "template" in the templates field
     * @method compileTemplate
     * @param templateHolder {Mixed} script tag with type = 'text/html' or textarea or string. Ctags should be stripped automatically
     * @param templateName {String} name of the template. If there is template with same name, TemplateEngine shouldn't register new template
     */
    T.compileTemplate = function (templateHolder, templateName) {
        templateHolder = (templateHolder.value) ? templateHolder.value : ( (templateHolder.nodeName && templateHolder.nodeName.toLowerCase() == 'script') ? templateHolder.innerHTML : templateHolder);
        var instructionRegex = /%\{[%\s\w,'\(\)=\{\}\.]+\}/gim,
            rawTemplateText = templateHolder.replace(/<\!--\s*<\!\[CDATA\[\s*|\s*\]\]>\s*-->/gim, '').replace(/\s{2,}/gim, ' '),
            stringFragments = rawTemplateText.split(instructionRegex), 
            stringFragment, instruction,
            instructions = [], 
            index = 0,
            tree = [],
            treeIndex = 0;
        
        // try to search instructions into the raw template
        while ((processingArray = instructionRegex.exec(rawTemplateText)) != null) {
            // process instruction into the node
            var instruction = processingArray[0], node = {};
            
            var fillRegex = /([^%{}]+[\w\.]+)/, includeRegex = /%include\s+([\w]+),\s+([\w]+)/,
                evalRegex = /%eval\s+([\w\s\.%=\!\[\]']+)/, 
                conditionalRegex = /%if\s+\(([\w\s\.%=\!\[\]']+)\)\s+\{([\w\.\s']+)\}/,
                nestedConditionRegex = /%elseif\s+\(([\w\s\.%=\!\[\]']+)\)\s+\{([\w\s\.']+)\}/,
                alternateConditionalRegex = /%else\s+\{([\w\s\.=']+)\}/;
            
            // include instruction

            if (includeRegex.test(instruction)) {
                var tempArray = includeRegex.exec(instruction);
                node.type = 'include';
                node.template = tempArray[1];
                node.data = tempArray[2];
            } else if (evalRegex.test(instruction)) { // eval instruction
                var tempArray = evalRegex.exec(instruction);
                node.type = 'eval';
                node.expression = tempArray[1];
            } else if (conditionalRegex.test(instruction)) { // conditional instruction
                var tempArray = conditionalRegex.exec(instruction);
                node.type = 'if';
                node.expression = tempArray[1];
                node.positive = {};
                if (/^'[\w\W]+'$/.test(tempArray[2])) {
                    node.positive.type = 'text';
                    node.positive.value = tempArray[2].replace(/'/g, '');
                } else {
                    node.positive.type = 'fill';
                    node.positive.value = tempArray[2];
                }
                
                node.negative = {};
                
                // elseif instruction
                if (nestedConditionRegex.test(instruction)) {
                    var anotherTempArray = nestedConditionRegex.exec(instruction);
                    node.negative.type = 'if';
                    node.negative.expression = anotherTempArray[1];
                    node.negative.positive = {};
                    if (/^'[\w\W]+'$/.test(anotherTempArray[2])) {
                        node.negative.positive.type = 'text';
                        node.negative.positive.value = anotherTempArray[2].replace(/'/g, '');
                    } else {
                        node.negative.positive.type = 'fill';
                        node.negative.positive.value = anotherTempArray[2];
                    }
                    node.negative.negative = {};
                    node.negative.negative.type = 'text';
                    node.negative.negative.value = '';
                }
                
                // else instruction
                if (alternateConditionalRegex.test(instruction)) {
                    var anotherTempArray = alternateConditionalRegex.exec(instruction);
                    var nestedNode = {};
                    if (/^'[\w\W]+'$/.test(anotherTempArray[1])) {
                        nestedNode.type = 'text';
                        nestedNode.value = anotherTempArray[1].replace(/'/g, '');
                    } else {
                        nestedNode.type = 'fill';
                        nestedNode.value = anotherTempArray[1];
                    }
                    if (!!node.negative.negative) {
                        // check that elseif already here
                        node.negative.negative = nestedNode;
                    } else {
                        node.negative = nestedNode;
                    }
                } else {
                    node.negative.type = 'text';
                    node.negative.value = '';
                }
            } else if (fillRegex.test(instruction)) { // simple 'fill' instruction
                var tempArray = fillRegex.exec(instruction);
                node.type = 'fill';
                node.value = tempArray[1];
            }
            
            instructions[index++] = node;
        }
        
        // construct tree from the stringFragments and instructions
        index = 0;
        while (stringFragment = stringFragments[index]) {
            var item = {
                type : 'text',
                value : stringFragment
            };
            tree[treeIndex++] = item;
            if (instruction = instructions[index++]) {
                tree[treeIndex++] = instruction;
            }
        }
        this.templates[templateName] = tree;
    };
    
    /**
     * Build string from compiled template and data
     * @method processTemplate
     * @param name {String} name of the template
     * @param data {Object|Array} collection of data. Can be array, hash or simple object
     * @return {String}
     */
    T.processTemplate = function (name, data) {
        var result = new A.StringBuffer();
        // get compiled template 
        var template = this.templates[name];

        if ((data instanceof Object) && O.keys(data).length > 1) {

            O.each(data, function (item) {
                var node, i = 0;
                while (node = template[i++]) {
                    result.add(T.processNode(node, item));
                }
            }, A);
        } else {
            var data = Ar(data);
            Ar.each(data, function (item) {
                var node, i = 0;
                while (node = template[i++]) {
                    result.add(T.processNode(node, item));
                }
            }, A);
        }

        return result.toString();
    };
    /**
     * Process different type of nodes into the compiled template
     * @method processNode
     * @private
     * @param node {Object} node to process
     * @param data {Mixed} data to fill in node
     * return {String} result of the node processing
     */
    T.processNode = function (node, data) {
        // text node - simply return value
        switch (node.type) {
            case 'text' :
                return node.value;
            case 'fill' :
                return T.evaluateSimpleExpression(node.value, data);
            case 'include' :
                return T.processTemplate(node.template, T.evaluateSimpleExpression(node.data, data));
            case 'if' :
                if (T.evaluateToughExpression(node.expression, data)) {
                    return T.processNode(node.positive, data);
                } else {
                    return T.processNode(node.negative, data);
                }
            case 'eval' :
                return T.evaluateToughExpression(node.expression, data);
        }
        return '';
    };
    /**
     * Process eval expressions with data
     * @method evaluateSimpleExpression
     * @private
     * @param exp {String} Expression to evaluate
     * @param data {Mixed} data to fill in expression
     * @return {String} evaluated expression
     */
    T.evaluateSimpleExpression = function (exp, data) {
        if (!!data[exp]) return data[exp];
        var sExp = exp.replace(/^\w\./, '');
        if (!!data[sExp]) return data[sExp];
        var p = exp.split(/\./), result, i = 1, prop;
        if (result = data[p[0]]) {
            while (prop = p[i++]) {
                result = result[prop];
            }
            return result;
        }
        p.shift();
        if (result = data[p[0]]) {
            while (prop = p[i++]) {
                result = result[prop];
            }
            return result;
        }
        return ''; // todo: maybe better to throw error parsing expression?
    };
    /**
     * Evaluate %eval instruction
     * @method evaluateToughExpression
     * @private
     * @param exp {String} expression to evaluate
     * @param data {Mixed} data to fill in expression
     * @return {String} processed expression
     */
    T.evaluateToughExpression = function (exp, data) {
        // check if exp is javascript expression
        if (/[\W\s]+/.test(exp)) {
            // replace javascript identifiers with its values taken from data
            var pExp = exp.replace(/(^[\w$]+[\w$\.]+)\s+|\s+([\w$]+[\w$\.]+)\s+|\s+([\w$]+[\w$\.]+)$/, function (e, a, b, c) {
                var v = a || b || c || '';
                return ' ' + T.evaluateSimpleExpression(v, data) + ' ';
            });
            try{ return eval(pExp); } 
			catch (e) {
			    throw 'Cannot evaluate ' + pExp;
            }
        } else {
            return T.evaluateSimpleExpression(exp, data);
        }
    };
    /**
     * Render template into container
     * @method render
     * @param template {String} name of the compiled template
     * @param el {String} container which innerHTML should be replaced with result of template processing
     * @param data {Mixed} data to fill in template
     */
    T.render = function (template, el, data) {
        T.replaceHTML(el, T.processTemplate(template, data));
    };
}, '0.0.1', [
    { name : 'array', minVersion : '1.0.0' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);
