AP.add('flash', function (A) {

    var $ = AP.Query, L = AP.Lang;

    var F = AP.Flash = {
        create : function (options) {
            return new flashObject(options);
        },

        remote : function(obj, fn){
            var rs = obj.CallFunction('<invoke name="' + fn + '" returntype="javascript">' + __flash__argumentsToXML(arguments, 2) + '</invoke>');
            return eval(rs);
        },

        CallBacks : {}
    };

    function flashObject (o) {
        // A.stamp(this);
        this._uid = 'Swiff_' + (new Date()).getTime();

        this.options = {
            id: this._uid,
            height: 1,
            width: 1,
            path : null,
            container: null,
            properties : {},
            params: {
                quality: 'high',
                allowScriptAccess: 'always',
                wMode: 'transparent',
                swLiveConnect: true
            },
            callBacks: {},
            variables: {}
        };

        this.setOptions(o);



        var id = this.options.id,
            options = this.options;




        var container = (options.container) ? $(options.container) : null;

        A.Flash.CallBacks[this._uid] = {};

        var params = options.params,
            variables = options.variables,
            callBacks = options.callBacks,
            path = A.String.qualifyPath(options.path),
            properties = A.OOP.merge({height: options.height, width: options.width}, options.properties);



        var self = this;

        for (var callBack in callBacks) {
            A.Flash.CallBacks[this._uid][callBack] = (function(option){
                return function(){
                    return option.apply(self.object, arguments);
                };
            })(callBacks[callBack]);
            variables[callBack] = 'AP.Flash.CallBacks.' + this._uid + '.' + callBack;
        }

        params.flashVars = this.buildSearchString(variables);
        if (A.Browser.trident){
            properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
            params.path = path;
        } else {
            properties.type = 'application/x-shockwave-flash';
            properties.data = path;
        }
        var build = '<object id="' + id + '"';
        for (var property in properties) build += ' ' + property + '="' + properties[property] + '"';
        build += '>';
        for (var param in params) {
            if (params[param]) build += '<param name="' + param + '" value="' + params[param] + '" />';
        }
        build += '</object>';

        this.object = $(build).appendTo((container) ? container.empty() : $('<div></div>'))[0];
    };


    flashObject.prototype = A.OOP.merge({

        toHTMLObjectElement : function () {
            return this.object;
        },

        inject : function (el) {
            $(this.toHTMLObjectElement()).appendTo(el);
            return this;
        },

        remote: function(){
            return F.remote.apply(F, AP.Array.extend([this.toHTMLObjectElement()], arguments));
        }

    }, A.Interface.Options, A.Interface.SearchStringBuilder);

}, '0.1.0', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'array', minVersion : '1.0.0'},
    { name : 'object', minVersion : '0.0.1'},
    { name : 'browser', minVersion : '0.0.1' },
    { name : 'query', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' },
    { name : 'string', minVersion : '0.0.2' },
    { name : 'interface.options', minVersion : '0.0.1' },
    { name : 'interface.searchStringBuilder', minVersion : '0.0.1' }

]);