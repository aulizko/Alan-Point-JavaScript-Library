/**
 * Really fast and memory-leaks safe spinner widget. 
 * @module spinner
 */
AP.add('spinner', function (A) {
    // global container for that module
    A.Spinner = A.Spinner || {};
    
    A.Spinner.CONSTANT = {
        KEY : {
            BACKSPACE: 8,
            END: 35,
            HOME: 36,
            LEFT: 37,
            PERIOD: 190,
            RIGHT: 39,
            TAB: 9
        }
    };
    
    // references to all instances of spinner
    A.Spinner.instances = {};
    
    /**
     * Single spinner object. Ideal if spinner alone on page, or spinners cannot be unified into one container
     * @class SpinnerOnSteroids
     * @constructor
     * @param html {Object} object with properties:
     * <ul><li>container {jQuery} jQuery reference to html element (container)</li>
     * <li>input {jQuery} jQuery reference to input element</li>
     * <li>up {jQuery} jQuery reference to increase control</li>
     * <li>down {jQuery} jQuery reference to decrease control</li></ul>
     * @param callback {Function} function which invocated every time when spinner value changed. 
     * Spinner object as it is will be passed to callback function as first parameter.
     * @param context {Object} object which will be passed to callback function as this element. 
     * @param step {Number} by this number input value will be changed every time user clicks on control
     * @param min {Number} min value of input. Default to 0.
     * @param max {Number} max value of input. Default to 255.
     */
    A.Spinner.SpinnerOnSteroids = function (html, callback, context, step, min, max) {
        this.container = html.container;
        this.input = html.input;
        this.value = this.input.val() - 0;
        this.up = html.up;
        this.down = html.down;
        this.callback = function () { callback.call((context) ? context : A.config.win, this); };
        this.step = step || 1;
        this.min = min || (this.input.attr('minValue') - 0) || 0;
        this.max = max || (this.input.attr('maxValue') - 0) || 255;
        
        this.initialize();
        
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.initialize = function() {
        // register this instance on the A.spinner.instances module
        A.stamp(this);
        A.Spinner.instances[this._apid] = this;
        this.container.attr('id', this._apid);
        // bind event listeners to the html elements;
        this.bindEventListeners();
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.bindEventListeners = function() {
        var self = this;
        this.up.click(function (e) { return self.upClickHandler(e); });
        
        this.down.click(function (e) { return self.downClickHandler(e); });
        
        this.input.keypress(function (e) { return self.keypressHandler(e); });
        
        this.input.keyup(function (e) { return self.keyupHandler(e); });
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.upClickHandler = function (e) {
        var oldValue = this.value, newValue = oldValue + this.step;
        
        newValue = (newValue > this.max) ? this.max : newValue;
        
        if (newValue != oldValue) {
            this.value = newValue;
            this.input.val(this.value);
            this.callback();
        }
        
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.downClickHandler = function (e) {
        var oldValue = this.value, newValue = oldValue - this.step;
        
        newValue = (newValue < this.min) ? this.min : newValue;
        
        if (newValue != oldValue) {
            this.value = newValue;
            this.input.val(this.value);
            this.callback();
        }
        
        if (e.preventDefault) { e.preventDefault(); }
        return false;
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.keypressHandler = function(e) {
        var output, K = A.Spinner.CONSTANT.KEY, newValue, charCode = e.which;
        // block unwanted keys
        output = false;
        AP.Object.each(K, function (keyCode) {
            if (e.keyCode == keyCode) {
                output = true;
            }
        }, this);

        if (output || (charCode >= 48 && charCode <= 57) || (/[0-9]/).test(String.fromCharCode(charCode))) {
            return true;
        }
        
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.keyupHandler = function (e) {
        var newValue;
        newValue = this.input.val() - 0;
        newValue = (newValue > this.max) ? this.max : ((newValue < this.min) ? this.min : newValue);
        
        this.value = newValue;
        this.input.val(newValue);
        this.callback();
    };
    
    A.Spinner.SpinnerOnSteroids.prototype.cleanup = function() {
        this.input.val(this.min);
        this.value = this.min;
    };
    
    
    A.Spinner.SpinnerOnSteroids.prototype.remove = function() {
        this.container.remove();
        A.Spinner.instances[this._apid] = null;
        delete A.Spinner.instances[this._apid];
    };
    
    
}, '0.0.1');