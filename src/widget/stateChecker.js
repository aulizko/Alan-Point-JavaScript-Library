AP.add('widget.editor.stateChecker', function (A) {

    var E = A.namespace('Widget.Editor'),
        $ = A.Query;

    E.StateChecker = {
        cachedState : null,

        dirty : false,

        defaultState : {
            text : ''
        },

        stateCheckersList : {},

        /**
         * Register function as state checker and update default state to return some value
         * @method adoptStateChecker
         * @param o {Object} hash, which contains following statements:
         * <ul><li>name {String} name of the state</li>
         * <li>defaultValue default value of the state</li>
         * <li>checker {Function} handler which will receive current node and check if state is achieved or not</li></ul>
         */
        adoptStateChecker : function (o) {
            // check if this state is already adopted, to avoid multiple calls
            if (this.defaultState[o.name]) { return; }

            this.defaultState[o.name] = o.defaultValue;

            this.stateCheckersList[o.name] = o.checker.bind(this);
        },

        runChecks : function (node) {
            var state = {};

            A.Object.each(this.stateCheckersList, function (checker, name) {
                var result = checker(node);
                if (result != this.defaultState[name]) {
                    state[name] = result;
                }
            }, this);

            return A.Object.clean(state);
        }
    };

}, '0.0.1', []);


