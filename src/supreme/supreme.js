AP.add('supreme', function(A) {
    var L = A.Lang, Ar = A.Array, $ = A.Query;
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
        var pool = [];

        return {
            /**
             * Add any number of subjects. Each of them have next properties:
             * <ul>
             * <li><code>reason</code> {Function} - is that object needed on current page. If passed function returns true, it invokes function</li>
             * <li><code>obj</code> {Function|Class} - Function that should call or class which should be called with "new" method
             * equal project name on the current namespace. Used to delete property from current namspace.</li></ul>
             * @method add
             * @param subject* {Object} Any number of objects
             * @return {Supreme} the Supreme instance
             */
            add : function(){
                var subjects = Ar(arguments, 0, true);
                if (AP.Lang.isArray(subjects[0])) {
                    subjects = subjects[0];
                } 
                pool = pool.concat(subjects);
                return this;
            },

            /**
             * Execute initializers and destroyers of pooled objects with help of Queue object
             * This method also remove destroyed objects from current namespace and from pool.
             * @method run
             * @return {Supreme} the Supreme instance
             */
            run: function() {
                var q = AP.Queue();
                
                Ar.each(pool, function (subject) {
                    var fn = subject.fn,
                        data = subject.data,
                        context = subject.context || AP.config.win,
                        condition = subject.condition;

                    if ((L.isFunction(condition) && condition()) || condition) {
                        if (L.isFunction(fn.extend)) {
                            q.add(function () {
                                (function (fn, data) {
                                    new fn(data);
                                }).call(context, [fn, data]);
                            });
                        } else if (L.isFunction(fn)) {
                            q.add(function () {
                                fn.call(context, data);
                            });
                        } else if (L.isObject(fn) && L.isFunction(fn.initialize)) {
                            q.add(function () {
                                fn.initialize.call(context, data);
                            });
                        }
                    }
                }, this);

                q.run();
                return this;
            }

        };
    }();

}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'array', minVersion : '1.0.0' }
]);