/**
 * The image loader is a framework to dynamically load images
 * according to certain triggers, enabling faster load times
 * and a more responsive UI.
 * @module imageloader
 */
AP.add('imageloader', function(A) {
    
    var L = AP.Lang, O = AP.Observer;
    /**
     * A group for images. A group can have one time limit and a series of triggers. 
     * Thus the images belonging to this group must share these constraints.
     * Usage: <ul><li>Custom event: <code>var imageGroup = AP.ImageLoader.group('goodsItemsLoaded');</code></li>
     * <li>DOM event: <code>var imageGroup = AP.ImageLoader.group({event: {el: 'goodsList', action: 'click'}});</code></li>
     * <li>timeuot only: <code>var imageGroup = AP.ImageLoader.group(2);</code></li> 
     * <li>both timeout and event present: <code>var imageGroup = AP.ImageLoader.group({event: 'goodsItemLoaded', timeout: 2});</code></li></ul>
     * @class ImageLoader.group
     * @constructor
     * @param o {Number|String|Object} Also, if this parameter is string than we consider it as Observable event and register it on the observer.
     * If this parameter is number, than it will be interpreted as timeout value.
     * If this parameter is object, it will be interpretered as configure param, which contains all necessary 
     * information to register group. Must contain one of following properties: event or timeout. Details:
     * <ul><li>event {String|Object} If string, than this is name of the custom event from the Observer. If object, 
     * than this is DOM event which group will be subscribed to. That object must have next properties:
     * <ul><li>el {String|HTMLElement} id or HTMLElement reference on which event listener will be bind</li>
     * <li>action {String} type of the event. Ex: <code>click</code>, <code>mouseout</code>.</li></ul></li>
     * <li>timeout {Number} Timeout (time limit) length, in seconds. Can be undefined, or <= 0, for no time limit</li></ul>
     */
    A.ImageLoader.group = function (o) {
        /**
        * Collection of images registered with this group
   	    * @property _imgObjects 
        * @private
        * @type {Object}
        */
        this._imgObjects = {};
        
        /**
    	 * Timeout (time limit) length, in seconds
    	 * @property timeoutLen
    	 * @type {Number}
    	 */
    	this.timeoutLen = (L.isNumber(o)) ? o : o.timeout;

    	/**
    	 * Timeout object to keep a handle on the time limit
    	 * @property _timeout
    	 * @private
    	 * @type {Object}
    	 */
    	this._timeout = null;
    	
    	/**
    	 * Collection of triggers for this group.
    	 * Keeps track of each trigger's element, event, and event-listener-callback "fetch" function
    	 * @property _triggers
    	 * @private
    	 * @type {Array}
    	 */
    	this._triggers = [];
    	
    	/**
    	 * Collection of custom-event triggers for this group.
    	 * Keeps track of each trigger's event object and event-listener-callback "fetch" function
    	 * @property _customTriggers
    	 * @private
    	 * @type {Array}
    	 */
    	this._customTriggers = [];
        
        // add a listener to set the time limit in the onload
        $(window).onload(function() {this._onloadTasks();});
    	
    	// add the trigger
    	this.addTrigger((L.isString(o)) ? o : o.event);
    };
    
    /**
     * Adds a trigger to the group. Call this with the same style as YAHOO.util.Event.addListener
     * @method addTrigger
     * @param event* {String|Object} any number of custom event names or objects which contains DOMEvent type and HTMLElement id or reference.
     * If event is object, he must contain following properties:
     * <ul><li>el {String|HTMLElement} id or reference to the html element</li>
     * <li>action {String} type of the object. Must be dom event type, like <code>click</code> or <code>mouseout</code></li></ul>
     */
    A.ImageLoader.group.prototype.addTrigger = function (evt) {
        if (L.isString(evt)) {
            // make sure we're dealing with a custom event
            this._customTriggers.push(O.subscribe(evt, fetch, this));
        	
        } else if (L.isObject(evt)) {
            var el = evt.el, action = evt.action;
            
            el = (L.isString(el)) ? $('#' + el) : $(el);
            
            // check presence of element and event type
            if (!L.isString(action) || el.length != 1) {
                return;
            }
            
            
            var wrappedFetch = function () {
                this.fetch();
            };
            
            this._triggers.push([el, action, wrappedFetch]);
            el.bind(action, wrappedFetch);
        } 
    };
    
    /**
     * Setup to do in the window's onload
     * Initiates time limit for group; executes the fold check for the images
     * @method _onloadTasks
     * @private
     */
    A.ImageLoader.group.prototype._onloadTasks = function() {
        var self = this;
        if (this.timeoutLen && typeof(this.timeoutLen) == 'number' && this.timeoutLen > 0) {
    		this._timeout = setTimeout(function() { self.fetch(); }, this.timeoutLen * 1000);
    	}
    };
    
    this.pngRegular = /\.png$/;
    
    /**
     * Adds any number of images to group.
     * @param o* {Object} any number of added images. Each image descriptor must contains following properties:
     * <ul><li>el {String|HTMLElement} id or reference to the html element</li>
     * <li>url {String} url to the element. If el is not image and url doesn't contain file extension you'd better 
     * manual set type of background property - png or not (we need it cause ie6 is bad with alpha-transparency)</li>
     * <li>width {Number} width of element in pixels. (opt)</li>
     * <li>height {Number} height of element in pixels. (opt)</li>
     * <li>png {Boolean} how will be url applyed to the element. If <code>el.nodeName == 'IMG'</code> we completely don't 
     * need it - url will be applyed as src. If <code>el</code> is not img html element, so that url will be specified as 
     * <code>style.backgroundImage</code> property. Also, with ie6 lack of alpha-transparency support, we need to define, 
     * need we register background image with filter or not. Thus method would try to automatic define, is loaded image png
     * or not - depends on file extension in the url. But if url doesn't determine it, we need to specify it with value of the
     * <code>png</code> parameter.</li></ul>
     */
    A.ImageLoader.group.prototype.addImage = function (o) {
        var el = o.el, url = o.url, width = o.width, height = o.height, png = o.png;
        el = (L.isString(el)) ? $('#' + el) : $(el);
        if (el.is('img')) {
            this._imgObjects[el.attr('id')] = new AP.ImageLoader.image(el, url, {width: width, height: height});
        } else {
            // check url and png
            if (png || this.pngRegular.test(url)) {
                this._imgObjects[el.attr('id')] = new AP.ImageLoader.backgroundPngImage(el, url, ailProps);
            } else {
                this._imgObjects[el.attr('id')] = new AP.ImageLoader.backgroundImage();
            }
        }
    };
    
    /**
     * Displays the images in the group
     * @method fetch
     */
    A.ImageLoader.group.prototype.fetch = function() {
        var i = 0, length, trigger;
        clearTimeout(this._timeout);
    	
    	// remove custom event subscriptions
    	for (i, length = this._customTriggers.length; i < length; i++) {
    	    O.unsubscribe(this.customTriggers[i]);
    	}
    	// remove all listeners
    	for (i = 0, length = this._triggers.length; i < length; i++) {
    	    trigger = this._triggers[i];
    	    $(trigger[0]).unbind(trigger[1], trigger[2]);
    	}

    	// fetch registered images
    	AP.Object.each(this._imgObjects, function(image) {
    	    image.fetch();
    	}, this);
    };
    
    /**
     * Base class for image objects to be registered with the groups
     * must be overrided by child class
     * @class ImageLoader.imgObj
     * @constructor
     * @param el {jQuery} HTML DOM id of the image element
     * @param url {String} URL for the image
     */
    A.ImageLoader.imgObj = function(el, url) {
        /**
    	 * jQuery reference to the HTML image element
    	 * @property el
    	 * @type {jQuery}
    	 */
    	this.el = el;

    	/**
    	 * URL for the image
    	 * @property url
    	 * @type String
    	 */
    	this.url = url;

    	/**
    	 * Pixel width of the image. Will be set as a "width" attribute after the image is fetched.
    	 * Detaults to the natural width of the image.
    	 * @property width
    	 * @type {Number}
    	 */
    	this.width = null;

    	/**
    	 * Pixel height of the image. Will be set as a "height" attribute after the image is fetched.
    	 * Detaults to the natural height of the image.
    	 * @property height
    	 * @type {Number}
    	 */
    	this.height = null;

    	/**
    	 * Whether the style.visibility should be set to "visible" after the image is fetched.
    	 * Used when setting src images as visibility:hidden prior to image fetching
    	 * @property setVisible
    	 * @type {Boolean}
    	 */
    	this.setVisible = true;

    	/**
    	 * Whether the image has already been fetched. In the case of a foldCondional group, keeps track for when the trigger is fired so images aren't fetched twice
    	 * @property _fetched
    	 * @type {Boolean}
    	 * @private
    	 */
    	this._fetched = false;
    };
    
    /**
     * Displays the image; puts the URL into the DOM
     * @method fetch
     */
    A.ImageLoader.image.prototype.fetch = function() {
        if (this._fetched) {
    		return;
    	}
    	
    	this._applyUrl(el);

		el.style.visibility = 'visible';
    	
    	if (this.width) {
    		el.width = this.width;
    	}
    	
    	if (this.height) {
    		el.height = this.height;
    	}
    	
    	this._fetched = true;
    };
    
    /**
     * Background image object. A background image is one whose URL is specified by "background-image" in the element's style
     * @class ImageLoader.backgroundImage
     * @constructor
     * @extends ImageLoader.image
     * @param el {jQuery} jQuery reference to the HTML element (not img element)
     * @param {String}	url	URL for the image
     */
    A.ImageLoader.backgroundImage = function (el, url) {
        this.constructor.superclass.call(this, domId, url);
    };
    A.extend(AP.ImageLoader.backgroundImage, AP.ImageLoader.imgObj);
    
    /**
     * Inserts the image URL into the DOM so that the image is displayed.
     * Sets style.backgroundImage
     * @method _applyUrl
     * @param {Object}	el	HTML DOM element
     * @private
     */
    A.ImageLoader.backgroundImage.prototype._applyUrl = function (el) {
        el.css('background-image', "url('" + this.url + "')");
    };
    
    /**
     * Source image object. A source image is one whose URL is specified by a src attribute in the DOM element
     * @class ImageLoader.image
     * @constructor
     * @extends YAHOO.util.ImageLoader.imgObj
     * @param el {String} HTML DOM id of the image element
     * @param url {String} URL for the image
     * @param misc {Object}	pixel width and height of the image - defaults to image's natural size
     */
    A.ImageLoader.image = function(domId, url, misc) {
        this.constructor.superclass.call(this, domId, url);
    	this.width = misc.width;
    	this.height = misc.height;
    };

    A.extend(A.ImageLoader.image, AP.ImageLoader.imgObj);
    
    /**
     * Inserts the image URL into the DOM so that the image is displayed.
     * Sets src
     * @method _applyUrl
     * @param {Object}	el	HTML DOM element
     * @private
     */
    A.ImageLoader.image.prototype._applyUrl = function (el) {
        el.attr('src', this.url);
    };
    
    /**
     * PNG background image object. A PNG background image is one whose URL is specified through AlphaImageLoader or by "background-image" in the element's style
     * @class ImageLoader.pngBgImgObj
     * @constructor
     * @extends ImageLoader.imgObj
     * @param el {jQuery} jQuery reference to the html dom element
     * @param url {String} URL for the image
     * @param ailProps {Object} The AlphaImageLoader properties to be set for the image
     *                    Valid properties are 'sizingMethod' and 'enabled'
     */
    A.ImageLoader.backgroundPngImage = function(domId, url, ailProps) {
        this.constructor.superclass.call(this, domId, url);

    	/**
    	 * AlphaImageLoader properties to be set for the image.
    	 * Valid properties are "sizingMethod" and "enabled".
    	 * @property props
    	 * @type Object
    	 */
    	this.props = ailProps || {};
    	this.ie6 = $.browser.msie && (($.browser.version.substr(0, 1) - 0) == 6);
    };

    A.extend(A.ImageLoader.backgroundPngImage, A.ImageLoader.imgObj);
    
    /**
     * Inserts the image URL into the DOM so that the image is displayed.
     * If the browser is determined to be IE6 (or older), sets the AlphaImageLoader src; otherwise sets style.backgroundImage
     * @method _applyUrl
     * @param el {jQuery}	jQuery reference to HTML DOM element
     * @private
     */
    A.ImageLoader.backgroundPngImage.prototype._applyUrl = function (el) {
        if (this.ie6) {
            var sizingMethod = (L.isUndefined(this.props.sizingMethod)) ? 'scale' : this.props.sizingMethod;
    		var enabled = (L.isUndefined(this.props.enabled)) ? 'true' : this.props.enabled;
    		el.css('filter', 
    		    'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + this.url + 
    		        '", sizingMethod="' + sizingMethod + '", enabled="' + enabled + '")');
        } else {
            el.css('background-image', "url('" + this.url + "')");
    	}
    };
}, '0.0.1');