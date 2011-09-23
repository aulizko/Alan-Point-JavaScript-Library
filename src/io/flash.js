Swiff = function () {};
    Swiff.Uploader = function () {};
    Swiff.Uploader.log = function() { if (window.console && console.info) { console.info.apply(console, arguments); }
};

AP.add('io.flash', function (A) {

    var IO = A.namespace('IO'),
        F = A.Flash,
        L = A.Lang,
        $ = AP.Query;

    IO.Flash = {
        pool : {},
        create : function (options) {
            var uploader = new Uploader(options);
            return this.pool[uploader._uid] = uploader;
        }
    };

    function Uploader (options) {
        this.options = {
            path : '/flash/Swiff.Uploader.swf',
            zIndex: 9999,

            height: 30,
            width: 100,
            callBacks: null,
            params: {
                wMode: 'opaque',
                menu: 'false',
                allowScriptAccess: 'always'
            },

            typeFilter: null,
            multiple: true,
            queued: true,
            verbose: false,

            url: null,
            method: null,
            data: null,
            mergeData: true,
            fieldName: null,

            fileSizeMin: 1,
            fileSizeMax: null, // Official limit is 100 MB for FileReference, but I tested up to 2Gb!
            allowDuplicates: false,
            timeLimit: (AP.Browser.platform.linux) ? 0 : 30,

            buttonImage: null,
            policyFile: null,

            fileListMax: 0,
            fileListSizeMax: 0,

            instantStart: false,
            appendCookieData: false,

            fileClass: null
            /*
            onLoad: $empty,
            onFail: $empty,
            onStart: $empty,
            onQueue: $empty,
            onComplete: $empty,
            onBrowse: $empty,
            onDisabledBrowse: $empty,
            onCancel: $empty,
            onSelect: $empty,
            onSelectSuccess: $empty,
            onSelectFail: $empty,

            onButtonEnter: $empty,
            onButtonLeave: $empty,
            onButtonDown: $empty,
            onButtonDisable: $empty,

            onFileStart: $empty,
            onFileStop: $empty,
            onFileRequeue: $empty,
            onFileOpen: $empty,
            onFileProgress: $empty,
            onFileComplete: $empty,
            onFileRemove: $empty,

            onBeforeStart: $empty,
            onBeforeStop: $empty,
            onBeforeRemove: $empty
            */
        };



        this.initialize(options);
    };

    Uploader.prototype = {
        initialize : function (options) {
            AP.stamp(this);

            this.subscribe('load', this.initializeFlash, this);
            this.subscribe('select', this.processFiles, this);
            this.subscribe('complete', this.update, this);
//            this.subscribe('fileRemove', this.updateFileList, this);


            this.setOptions(options);

            if (this.options.callBacks) {
                AP.Object.each(this.options.callBacks, function (fn, name) {
                    // It seems to me that "complete" as a name for callback more semanthic, but many peoples doesn't agree with me, so that I give you ability to use you both forms
                    if (/^on/.test(name)) {
                        name = name.substr(2); // strip on*
                        name = name.substr(0, 1).toLowerCase() + name.substr(1); // make first letter (like "f" at "onFileComplete") lower case 
                    }
                    this.subscribe(name, fn, this);
                }, this);
            }


            this.options.callBacks = {
                fireCallback : this.fireCallback.bind(this)
            };

            var path = this.options.path;

            if (path.indexOf('?') == -1) { path += '?noCache=' + AP.generateUID(); } // cache in IE

            // container options for Flash object
            this.options.container = this.box = $('<span class="flashUploader"></span>').appendTo(this.options.container || AP.config.doc.body);

            // target
            this.target = $(this.options.target);


            if (this.target.length) {
                this.box.css({
                    position: 'absolute',
                    visibility: 'visible',
                    zIndex: this.options.zIndex,
                    overflow: 'hidden',
                    height: 1, width: 1,
                    top: $(window).scrollTop(),
                    left: $(window).scrollLeft()
                });

                // we force wMode to transparent for the overlay effect
                this.flashObject = F.create({
                    path : this.options.path,
                    params: {
                        wMode: 'transparent',
                        menu: 'false',
                        allowScriptAccess: 'always'
                    },
                    callBacks : this.options.callBacks,
                    height: '100%',
                    width: '100%'
                });


                var self = this;
                this.target.bind('mouseenter', function () {
                    self.reposition();
                });


                // button interactions, relayed to to the target
                this.subscribe('buttonEnter', function () {
                    self.targetRelay('mouseenter');
                });

                this.subscribe('buttonLeave', function () {
                    self.targetRelay('mouseleave');
                });

                this.subscribe('buttonDown', function () {
                    self.targetRelay('mousedown');
                });

                this.subscribe('buttonDisable', function () {
                    self.targetRelay('disable');
                });


                this.reposition();

                $(window).bind('resize', function () {
                    self.reposition();
                });
            } else {
                this.flashObject = F.create({
                    path : this.options.path,
                    callBacks : this.options.callBacks
                });
            }

            this.flashObject.inject(this.box);

            this.fileList = [];

            this.size = this.uploading = this.bytesLoaded = this.percentLoaded = 0;

            if (AP.Browser.plugins.flash.version < 9) {
                this.publish('fail');
            } else {
                AP.Timer.later(1000, this, this.verifyLoad, [], false);
            }
        },
        verifyLoad : function() {
            if (this.loaded) return;

            if (!this.flashObject.toHTMLObjectElement().parentNode) {
                this.publish('fail', ['disabled']);
            } else if (this.flashObject.toHTMLObjectElement().style.display == 'none') {
                this.publish('fail', ['hidden']);
            } else if (!this.flashObject.toHTMLObjectElement().offsetWidth) {
                this.publish('fail', ['empty']);
            }
        },

        fireCallback : function(name, args) {
            // file* callbacks are relayed to the specific file
            if (name.substr(0, 4).toLowerCase() == 'file') {
                // updated queue data is the second argument
                if (args.length > 1) this.update(args[1]);
                var data = args[0];

                var file = this.findFile(data.id);
                this.publish(name, file|| data, 5);
                this.publish(name, file || data, 5);
                if (file) {
                    var fire = name.replace(/^file([A-Z])/, function($0, $1) {
                        return $1.toLowerCase();
                    });
                    file.update(data).publish(fire, [data], 10);
                }
            } else {
                this.publish(name, args, 5);
            }
        },
        update : function(data) {
            // the data is saved right to the instance

            $extend(this, data);
            this.publish('queue', [this], 10);
            return this;
        },

        findFile : function(id) {
            var file = AP.Array.filter(this.fileList, function (file) {
                return file.id == id;
            }, this)[0];

            return (file) ? file : null;
        },

        initializeFlash : function() {
            // extracted options for the swf
            this.flashObject.remote('initialize', {
                width: this.options.width,
                height: this.options.height,
                typeFilter: this.options.typeFilter,
                multiple: this.options.multiple,
                queued: this.options.queued,
                url: this.options.url,
                method: this.options.method,
                data: this.options.data,
                mergeData: this.options.mergeData,
                fieldName: this.options.fieldName,
                verbose: this.options.verbose,
                fileSizeMin: this.options.fileSizeMin,
                fileSizeMax: this.options.fileSizeMax,
                allowDuplicates: this.options.allowDuplicates,
                timeLimit: this.options.timeLimit,
                buttonImage: this.options.buttonImage,
                policyFile: this.options.policyFile
            });

            this.loaded = true;

            this.appendCookieData();
        },

        targetRelay: function(name) {
            if (this.target.length) this.target.trigger(name);
        },

        reposition : function(coords) {
            if (!coords) {
                if (this.target.length && this.target.offset().top) {

                    var targetToBoxOffset = this.target.offset();
                    // var boxToParentOffest = this.box.position();
                    // console.log('targetToBoxOffset.left + boxToParentOffest.left: %o', targetToBoxOffset.left + boxToParentOffest.left);


                    coords = {
                        left : targetToBoxOffset.left, // + boxToParentOffest.left,
                        top : targetToBoxOffset.top, // + boxToParentOffest.top,
                        width : this.target.width(),
                        height: this.target.height()
                    };

                } else {
                    coords = {top: $(window).scrollTop(), left: 0, width: 40, height: 40};
                }
            }
            this.box.css(coords);


            this.publish('reposition', [coords, this.box, this.target]);
        },

        setOptions : function (options) {
            if (options) {
                if (options.url) { options.url = AP.String.qualifyPath(options.url); }
                if (options.buttonImage) { options.buttonImage = AP.String.qualifyPath(options.buttonImage); }
                if (this.loaded) this.remote('setOptions', options);
            }
            this.oldSetOptions(options);
        },

        enable : function () {
            this.flashObject.remote('setEnabled', true);
        },

        disable : function () {
            this.flashObject.remote('setEnabled', false);
        },

        start: function() {
            this.publish('beforeStart');
            this.flashObject.remote('start');
        },

        stop: function() {
            this.publish('beforeStop');
            this.flashObject.remote('stop');
        },

        remove: function() {
            this.publish('beforeRemove');
            this.flashObject.remote('remove');
        },

        fileStart: function(file) {
            this.flashObject.remote('fileStart', file.id);
        },

        fileStop: function(file) {
            this.flashObject.remote('fileStop', file.id);
        },

        fileRemove: function(file) {
            console.log('file remove method called');
            this.flashObject.remote('fileRemove', file.id);
        },

        fileRequeue: function(file) {
            this.flashObject.remote('fileRequeue', file.id);
        },

        appendCookieData: function() {
            var append = this.options.appendCookieData;
            if (!append) return;

            var hash = {};
            AP.Object.each(document.cookie.split(/;\s*/), function(cookie) {
                cookie = cookie.split('=');
                if (cookie.length == 2) {
                    hash[decodeURIComponent(cookie[0])] = decodeURIComponent(cookie[1]);
                }
            });

            var data = this.options.data || {};
            if (L.isString(append)) { data[append] = hash; }
            else { $extend(data, hash); }

            this.oldSetOptions({data: data});
        },

        processFiles : function(eventName, successraw, failraw, queue) {
            var cls = File; // this.options.fileClass || Swiff.Uploader.File;

            var fail = [], success = [];

            if (successraw) {
                AP.Array.each(successraw, function(data) {
                    var ret = new cls(this, data);
                    if (!ret.validate()) {
                        AP.Timer.later(10, ret, ret.remove, []);
                        ret.remove.delay(10, ret);
                        fail.push(ret);
                    } else {
                        this.size += data.size;
                        this.fileList.push(ret);
                        success.push(ret);
                        ret.render();
                    }
                }, this);

                this.publish('selectSuccess', [success], 10);
            }

            if (failraw || fail.length) {
                var t = AP.Array.extend(fail, (failraw) ? AP.Array.map(failraw, function(data) {
                    return new cls(this, data);
                }, this) : []);

                AP.Array.each(t, function(file) {
                    file.invalidate().render();
                });

                this.publish('selectFail', [fail], 10);
            }

            this.update(queue);

            if (this.options.instantStart && success.length) this.start();
        }
    };

    $extend(Uploader, {
        STATUS_QUEUED: 0,
        STATUS_RUNNING: 1,
        STATUS_ERROR: 2,
        STATUS_COMPLETE: 3,
        STATUS_STOPPED: 4,


        log: function() {
            if (window.console && console.info) { console.info.apply(console, arguments); }
        },

        unitLabels: {
            b: [{min: 1, unit: '\u0411'}, {min: 1024, unit: '\u043A\u0411'}, {min: 1048576, unit: '\u041C\u0411'}, {min: 1073741824, unit: '\u0413\u0411'}],
            s: [{min: 1, unit: '\u0441'}, {min: 60, unit: '\u043C'}, {min: 3600, unit: '\u0447'}, {min: 86400, unit: '\u0434'}]
        },

        formatUnit: function(base, type, join) {
            var labels = Uploader.unitLabels[(type == 'bps') ? 'b' : type];
            var append = (type == 'bps') ? '/с' : '';
            var i, l = labels.length, value;

            if (base < 1) return '0 ' + labels[0].unit + append;

            if (type == 's') {
                var units = [];

                for (i = l - 1; i >= 0; i--) {
                    value = Math.floor(base / labels[i].min);
                    if (value) {
                        units.push(value + ' ' + labels[i].unit);
                        base -= value * labels[i].min;
                        if (!base) break;
                    }
                }

                return (join === false) ? units : units.join(join || ', ');
            }

            for (i = l - 1; i >= 0; i--) {
                value = labels[i].min;
                if (base >= value) break;
            }

            return (base / value).toFixed(1) + ' ' + labels[i].unit + append;
        }
    });

    function $extend(original, extended) {
        for (var key in (extended || {})) original[key] = extended[key];
        return original;
    };

    $extend(Uploader.prototype, A.util.Event.Observable);

    $extend(Uploader.prototype, {

        oldSetOptions : A.Interface.Options.setOptions

    });



    function File (base, data) {
        this.base = base;
        this.update(data);
    };

    File.prototype = {
        update: function(data) {
            return $extend(this, data);
        },

        validate: function() {
            var options = this.base.options;

            if (options.fileListMax && this.base.fileList.length >= options.fileListMax) {
                this.validationError = 'fileListMax';
                return false;
            }

            if (options.fileListSizeMax && (this.base.size + this.size) > options.fileListSizeMax) {
                this.validationError = 'fileListSizeMax';
                return false;
            }

            return true;
        },

        invalidate: function() {
            this.invalid = true;
            this.base.publish('fileInvalid', this, 10);

            return this.publish('invalid', this, 10);
        },

        render: function() {
            return this;
        },

        setOptions: function(options) {
            if (options) {
                if (options.url) options.url = AP.String.qualifyPath(options.url);
                this.base.flashObject.remote('fileSetOptions', this.id, options);
                this.options = AP.OOP.merge(this.options, options);
            }
            return this;
        },

        start: function() {
            this.base.fileStart(this);
            return this;
        },

        stop: function() {
            this.base.fileStop(this);
            return this;
        },

        remove: function() {
            this.base.fileRemove(this);
            return this;
        },

        requeue: function() {
            this.base.fileRequeue(this);
        }
    };

    $extend(File.prototype, A.util.Event.Observable);


    A.IO.Flash.Uploader = Uploader;

    A.IO.Flash.Uploader.File = File;

}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'string', minVersion : '0.0.1' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'oop', minVersion : '0.0.1' },
    { name : 'query', minVersion : '0.0.1' },
    { name : 'io', minVersion: '0.0.1' },
    { name : 'flash', minVersion : '0.0.1' },
    { name : 'class', minVersion : '0.0.2' },
    { name : 'interface.options', minVersion : '0.0.1' },
    { name : 'observable', minVersion : '0.0.1' }
]);