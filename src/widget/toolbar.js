AP.add('widget.toolbar', function (A) {
    var DEFAULT_TOOLBAR_TEMPLATE = {
        name : 'container:toolbar',
        body : ' %{content} '
    }, 
    INNER_PANEL_DEFAULT_TEMPLATE = {
        name : 'container:innerToolbarPanel',
        body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><div class="panelTitle">%{humanizedTitle}</div>%{content}</div>'
    },
    Ar = A.Array,
    DEFAULT_HUMANIZED_TITLE = /* Текст */ '\u0422\u0435\u043A\u0441\u0442',
    DEFAULT_HIDDEN_CLASS = 'hidden',
    tabActivationRegexp = /\.activate/,
    tabDeActivationRegexp = /\.deactivate/,
    DEFAULT_OPEN_TAB_CSS_CLASS = 'activeTab',
    L = AP.Lang;
    
    A.Widget.ToolBar = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_TOOLBAR_TEMPLATE; // todo: review that template should be empty

            this.type = 'container:toolbar';

            

            var items = o.items, tabPanels = [], controls = [];

            delete o.items; // remove items from configuration

            this.base(o);
            
            Ar.each(items, function (item) {
                if (item.className == 'tabPanel') {
                    tabPanels.push(item);
                } else {
                    controls.push(item); // input or toolbarButton
                }
            }, this);
            
            var tabTriggerrs = [];
            
            var triggerRegExp = /Trigger/;
            Ar.each(tabPanels, function (item) {
                tabTriggerrs.push(item.trigger);
                
                // subscribe toolbar on the click on the trigger
                var meta = item.trigger.title.replace(triggerRegExp, '');
                
                item.trigger.subscribe('activate', function () { this.openTab(meta); }, this);
                item.trigger.subscribe('deactivate', function () { this.closeTab(meta); }, this);
                
            }, this);


            // create panel for top level buttons, inputs, tab triggers
            var paramsForTheToolbarMainPanel = {
                title : 'toolbarMainPanel',
                cssClass : 'mainPanel',
                items : controls.concat(tabTriggerrs),
                template : INNER_PANEL_DEFAULT_TEMPLATE,
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE
            };

            if (o.hidden) {
                paramsForTheToolbarMainPanel.hidden = true;
            }
            var innerPanel = new A.Widget.Panel(paramsForTheToolbarMainPanel);
            
            

            this.registerChild(innerPanel);
            this.type = 'container:toolbar';

            // register panels as children
            Ar.each(tabPanels, function (item) {
                // prepare panel to render:
                var cssClasses = item.panel.cssClass.split(' ');
                if (((cssClasses.length == 1) && (cssClasses[0] != DEFAULT_HIDDEN_CLASS)) ||
                  !Ar.some(cssClasses, function (item) { return item === DEFAULT_HIDDEN_CLASS; }, this)) {
                        
                    cssClasses.push(DEFAULT_HIDDEN_CLASS);
                    item.panel.cssClass = cssClasses.join(' ');
                    item.panel.supplyDataForTemplatesWithValues({
                        cssClass : item.panel.cssClass
                    });
                }
                
                this.registerChild(item.panel);
            }, this);            
            
            this.currentOpenTabMeta = '';
        },
        openTab : function (e) {
            var meta = '';
            if (L.isString(e)) { // we received currentOpenTabMeta
                meta = e.replace(tabActivationRegexp, '');
            } else if (e && e.type) { // W3C event received
                meta = (e.type + '').replace(/-ap-[\d]+$/, '').replace(tabActivationRegexp, '');
            }
            if (meta) {
                this.changeTabState(meta);
                this.publish('tab:stateChanged');
            }
        },
        closeTab : function (e) {
            var meta = '';
            if (L.isString(e)) { // we received currentOpenTabMeta
                meta = e.replace(tabDeActivationRegexp, '');
            } else if (e && e.type) { // W3C event received
                meta = (e.type + '').replace(/-ap-[\d]+$/, '').replace(tabDeActivationRegexp, '');
            }
            if (meta) {
                this.changeTabState(meta);
                this.publish('tab:stateChanged');
            }
        },
        changeTabState : function (meta) {
            var panel, toolbarPanel = this.children.get('toolbarMainPanel'), trigger;
            // there are three possible cases:
            // 1) another one tab are open, so that hide another tab and show that. (all without animation)
            // 2) no one tab are open, so that open provided tab with animation
            // 3) provided tab are already open, so that we need to close it with animation

            if (this.currentOpenTabMeta) {
                if (this.currentOpenTabMeta == meta) {
                    trigger = toolbarPanel.children.get(meta + 'Trigger');
                    trigger.DOM.removeClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                    trigger.DOM.removeClass(trigger.css.pressed);
                    
                    panel = this.children.get(meta + 'Panel');
                    panel.hide('fast');
                    this.currentOpenTabMeta = '';
                } else {
                    trigger = toolbarPanel.children.get(this.currentOpenTabMeta + 'Trigger');
                    trigger.DOM.removeClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                    trigger.DOM.removeClass(trigger.css.pressed);
                    trigger = toolbarPanel.children.get(meta + 'Trigger');
                    trigger.DOM.addClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                    trigger.DOM.removeClass(trigger.css.pressed);
                    
                    panel = this.children.get(this.currentOpenTabMeta + 'Panel');
                    panel.hide();
                    panel = this.children.get(meta + 'Panel');
                    panel.show();
                    this.currentOpenTabMeta = meta;
                }
            } else {
                trigger = toolbarPanel.children.get(meta + 'Trigger');
                
                
                trigger.DOM.addClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                trigger.DOM.removeClass(trigger.css.pressed);
                
                panel = this.children.get(meta + 'Panel');
                
                panel.show('fast');
                this.currentOpenTabMeta = meta;
            }
        },
        show : function (animate) {
            if (!this.rendered) { this.render(); }
            this.publish('before-show');

            var toolbarPanel = this.children.get('toolbarMainPanel');
            if (animate) {
                toolbarPanel.DOM.show(70);
            } else {
                toolbarPanel.DOM.show();
            }
            this.redraw();
        },
        hide : function (animate) {
            if (!this.rendered) { return; }
            var toolbarPanel = this.children.get('toolbarMainPanel');
            if (animate) {
                this.closeTab(this.currentOpenTabMeta);
                toolbarPanel.DOM.hide(70);
            } else {
                this.closeTab(this.currentOpenTabMeta);
                toolbarPanel.DOM.hide();
            }
        },
        redraw : function() {
        },
        className : 'toolbar'
    });

}, '0.0.1', [
    { name : 'widget.container', minVersion : '0.0.1' }
]);