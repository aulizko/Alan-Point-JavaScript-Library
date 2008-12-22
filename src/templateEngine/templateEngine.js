AP.add('templateEngine', function (A) {
    /**
     * Render specified data with appropriate template
     * @class Renderer
     * @for MagericShop
     */
    A.TemplateEngine = A.TemplateEngine || function () {
        var

        /**
         * Configuration data for different entities
         * Contains:<ul>
         * <li>template: HTML code template</li>
         * <li>container: target HTML element used as container for rendered data</li>
         * <li>templateTokensHash: hash of template tokens(variables). Ex.: { id: _id_ }</li></ul>
         * @field conf
         * @for Renderer
         */
        conf = {}, L = AP.Lang,

        /**
         * Produce templateTokensHash from specified template.
         * @method getTemplateTokensHash
         * @param template {String} specified template
         * @return {Hash} hash of template tokens(variables). Ex.: { id: _id_ }
         * @private
         */
        getTemplateTokensHash = function(/* String */template) {
            var tokensPattern = /_[^_]+_/gm, cycleTokensPattern = /%{([^}]+):([^}]+):([^}]+)}/gm,
                templateTokens = A.Array.unique(template.match(tokensPattern)),
                cycleTokens = A.Array.unique(template.match(cycleTokensPattern)),
                tokensHash = [], i = 0, cycleTokensHash = [];


            A.Array.each(templateTokens, function (templateToken, index) {
                templateToken = (templateToken.replace(/_/g, '')).split('.');
                tokensHash[index] = templateToken;
            });

            A.Array.each(cycleTokens, function (cycleToken, index) {
                var output = {};
                cycleToken = cycleToken.replace(/%{}/g, '');
                cycleToken.replace(/(\w+):(\w+):([\w\.]+)/, function (m, entityName, dataName, wrapper) {
                    output.entityName = entityName;
                    output.dataName = dataName;
                    output.wrapper = wrapper;
                });
                cycleTokensHash[index] = output;
            });

            return { plain : tokensHash, cycle : cycleTokensHash};
        },


        generateHTMLFromTemplate = function (item, entityName, rawTemplate) {
            var tokenHash = conf[entityName].templateTokensHash.plain,
                length = tokenHash.length, i, j, propertyPath, limit, subProperty, subPropertyValue;

            for (i = 0; i < length; i++) {
                propertyPath = tokenHash[i];
                limit = propertyPath.length;
                subProperty = propertyPath[0];
                subPropertyValue = item[subProperty];

                for (j = 1; j < limit, (L.isObject(subPropertyValue) && !L.isUndefined(subPropertyValue)); j++) {
                    subPropertyValue = subPropertyValue[propertyPath[j]];
                }

                if (!L.isUndefined(subPropertyValue)) {
                    var propertyPattern = new RegExp('_' + propertyPath.join('.') + '_', "g");
                    rawTemplate = rawTemplate.replace(propertyPattern, subPropertyValue);
                }
            }
            return rawTemplate.replace(/_[^_]+_/gm, '');
        },

        renderHierarchicObject = function (data, entityName) {
            // process cyclic templates
            var cyclicTokenHash = conf[entityName].templateTokensHash.cycle, tokenHash,
                rawTemplate, cyclicRawHTML;
            
            if (!!data.active && data.active) {
                if (!!conf[entityName].activeTemplate) {
                    rawTemplate = conf[entityName].activeTemplate;
                }
            } else {
                rawTemplate = conf[entityName].template;
            }

            if (!!cyclicTokenHash) {
                var i = 0;
                while (tokenHash = cyclicTokenHash[i++]) {
                    var wrapper = tokenHash.wrapper, nestedEntityName = tokenHash.entityName, nestedDataName = tokenHash.dataName;

                    cyclicRawHTML = AP.TemplateEngine['generateHtmlFor' + nestedEntityName](data[nestedDataName]);
                    if (wrapper) {

                        // try to get class
                        var el = wrapper.split('.');
                        var claz = el[1];
                        el = el[0];
                        cyclicRawHTML = '<' + el + ((!!claz) ? (' class="' + claz + '"') : '') + '>' + cyclicRawHTML + '</' + el + '>';
                    }
                    var replaceString = '%{' + nestedEntityName + ':' + nestedDataName + ((wrapper) ? (':' + wrapper) : '') + '}';
                    rawTemplate = rawTemplate.replace(replaceString, cyclicRawHTML);
                }
                rawTemplate = rawTemplate.replace(/%{([^}]+):([^}]+):([^}]+)}/gm, '');

            }

            return generateHTMLFromTemplate(data, entityName, rawTemplate);
        };



        return {
            configure : function (templateElementSelector, entityName, activeTemplateElementSelector) {
                if (!templateElementSelector) return;

                conf[entityName] = {};

                var templateElement = $(templateElementSelector);
                if (!templateElement.get(0) || !templateElement.get(0)) {
                    return;
                }

                conf[entityName].template = (A.String.unescapeHTML(A.String.trim(templateElement.html()))).replace('<tbody>', '').replace('</tbody>', '');
                conf[entityName].templateTokensHash = getTemplateTokensHash(conf[entityName].template);
                if (!!activeTemplateElementSelector) {
                    var activeTemplateTokenElement = $(activeTemplateElementSelector);
                    if (activeTemplateTokenElement.length != 0) {
                        conf[entityName].activeTemplate = A.String.unescapeHTML(A.String.trim(activeTemplateTokenElement.html()));
                    }
                }


                /**
                 * Render data of specified entity into HTML
                 * @method generateHtmlFor
                 * @param data {Object}
                 */
                this['generateHtmlFor' + entityName] = function (data) {
                    var renderedHtml = [], item, i = 0;
                    if (L.isString(data)) {
                        renderedHtml = data;
                    } else if (L.isArray(data)) {
                        while (item = data[i]) {
                            renderedHtml[i++] = renderHierarchicObject(item, entityName);
                        }

                        renderedHtml = renderedHtml.join('');
                    } else if (L.isObject(data) && !L.isFunction(data)) {
                        for (item in data) {
                            renderedHtml[i++] = renderHierarchicObject(data[item], entityName);
                        }

                        renderedHtml = renderedHtml.join('');
                    } else {
                        return;
                    }
                    return renderedHtml;
                };
            }
        };
    }();
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.2' },
    { name : 'string', minVersion : '0.0.1' },
    { name : 'array', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' }
]);

