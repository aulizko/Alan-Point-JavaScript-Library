AP.add('queue', function (A) {
    var L = A.Lang;


    /**
     * Mechanism to execute a series of callbacks in a non-blocking queue.  Each
     * callback is executed via setTimout unless configured with a negative
     * timeout, in which case it is run in blocking mode in the same execution
     * thread as the previous callback.  Callbacks can be function references or
     * object literals with the following keys:
     * <ul>
     *    <li><code>fn</code> - {Function} REQUIRED the callback function.</li>
     *    <li><code>timeout</code> - {number} millisecond delay to wait after previous callback completion before executing this callback.  Negative values cause immediate blocking execution.  Default 0.</li>
     *    <li><code>until</code> - {Function} boolean function executed before each iteration.  Return true to indicate callback completion.</li>
     *    <li><code>iterations</code> - {Number} number of times to execute the callback before proceeding to the next callback in the queue. Incompatible with <code>until</code>.</li>
     * </ul>
     *
     * @module queue
     * @class Queue
     * @constructor
     * @param callback* {Function|Object} Any number of callbacks to initialize the queue
     */
    A.Queue = function () {
        // Factory or Constructor
        var me = this instanceof A.Queue ? this : new A.Queue();
        /**
         * The callback queue
         * @property p
         * @type {Array}
         * @protected
         */
        me.p = [];
        return me.add.apply(me, arguments);
    };

    A.Queue.prototype = {
        /**
         * Timeout id used to pause or stop execution and indicate the execution
         * state of the Queue.  0 indicates paused or stopped, negatives indicate
         * blocking execution, and positives indicate non-blocking execution.
         * @property s
         * @type {number}
         * @protected
         */
        s : 0,


        /**
         * Add any number of callbacks to the end of the queue
         * @method add
         * @param callback* {Function|Object} Any number of callbacks
         * @return {Queue} the Queue instance
         */
        add : function () {
            var callbacks = A.Array(arguments, 0, true);
            this.p.splice.apply(this.p,[this.p.length,0].concat(callbacks));
            return this;
        },

        /**
         * Pause the execution of the Queue after the execution of the current
         * callback completes.  If called from code outside of a queued callback,
         * clears the timeout for the pending callback. Paused Queue can be
         * restarted with q.run()
         * @method pause
         * @return {Queue} the Queue instance
         */
        pause : function () {
            clearTimeout(this.s);
            this.s = 0;
            return this;
        },

        /**
         * Execute the queue callbacks (also resumes paused Queue).
         * @method run
         * @return {Queue} the Queue instance
         */
        run : function () {
            var c = this.p[0], fn;
            
            if (!c || this.s) {
                return this;
            }
            
            fn = c.fn || c;

            if (L.isFunction(fn)) {
                var ms = c.timeout || 0, me = this;
                this.p.shift();

                this.s = setTimeout(function () {
                    me.exec(fn, c);
                    if (me.s) {
                        me.s = 0;
                        me.run();
                    }
                }, ms);
            }
        },

        /**
         * Executes the callback function
         * @method _exec
         * @param fn {Function} the function to execute
         * @param c {Object | Function} the callback as defined during add(c)
         * @protected
         */
        exec : function (fn, c) {
            fn.call((c.context) ? c.context : A.win);
        }
    };


}, '0.0.1');