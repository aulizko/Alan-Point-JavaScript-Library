AP.add('supreme', function(A) {
    var L = A.Lang, q = A.Queue(), Ar = A.Array;
    /**
     * Manager of the project-related objects.
     * Each object execute initialize or destroy method depend on reason param.
     * @module supreme
     * @class Supreme
     * @constructor
     * @param subject* {Object} Any number of objects
     */
    A.Supreme = function () {
        /**
         * The callback queue
         * @property p
         * @type {Array}
         * @protected
         */
        var pool = [], setted = false;

        if (!setted) {
            $(window).unload(function () {AP.Supreme.unload();});
            setted = true;
        }
        
        // todo: remove binding to the magericshop namespace
        namespace = 'projects.MagericShop';
        
        return {
            /**
             * Add any number of subjects. Each of them have next properties:
             * <ul>
             * <li><code>reason</code> {Boolean} - is that object needed on current page.</li>
             * <li><code>obj</code> {Object | Function} - object we working with. This object must have three properties:
             * <ul><li><code>initialize</code> {Function} - function which initialize object (todo: make this opt)</li>
             * <li><code>destroy</code> {Function} - method which destroyes all cached variables, remove memory links and 
             * synchronize with server if needed</li>
             * <li><code>className</code> {String} or <code>getClassName</code> {Function} - public property or method which 
             * equal project name on the current namespace. Used to delete property from current namspace.</li></ul></li></ul>
             * @method add
             * @param subject* {Object} Any number of objects
             * @return {Supreme} the Supreme instance
             */
            add : function(){
                var subjects = Ar(arguments, 0, true);
                pool.splice.apply(pool,[pool.length,0].concat(subjects));

                return this;
            },

            /**
             * Execute initializers and destroyers of pooled objects with help of Queue object
             * This method also remove destroyed objects from current namespace and from pool.
             * @method run
             * @return {Supreme} the Supreme instance
             */
            run: function() {
                var obj, reason,
                    length = pool.length, i = 0, data;
                for (; i < length; i++) {
                    subject = pool[i];
                    obj = subject.obj;
                    reason = subject.wanted;
                    data = subject.data;
                    
                    if (reason) {
                        if (data) {
                            q.add({ fn: function () {obj.initialize(data);}, context: obj});
                        } else {
                            q.add(function () { obj.initialize(); });
                        }
                    } else {
                        if (!L.isUndefined(obj)) {
                            if (!L.isUndefined(obj.destroy) && L.isFunction(obj.destroy)) {
                                q.add(function () {obj.destroy();});
                            }

                            q.add({ fn: function() {
                                delete AP.Supreme.namespace[(obj.className) ? obj.className : obj.getClassName()];
                                AP.Supreme.pool.splice(i, 1);
                            }, context: this});
                        }
                    }
                }

                q.run();
                return this;
            },

            /**
             * Call destroy method of the pooled objects. It executes only on window.unload event.
             * @methdo unload
             * @protected
             */
            unload: function(){
                Ar.each(pool, function(subject) {
                    if (!L.isUndefined(subject.obj.destroy)) {
                        subject.obj.destroy();
                    }
                }, this);
            }
        };
    }();
    
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'array', minVersion : '1.0.0' },
    { name : 'queue', minVersion : '0.0.1' }
]);