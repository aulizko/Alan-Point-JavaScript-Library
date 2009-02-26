AP.add('toolbar', function (A) {
    var $ = A.Query, L = A.Lang, StringBuffer = A.StringBuffer, O = A.Object;
    
    A.ToolBar = A.Class.extend({
        init : function (o) {
            this.title = o.title || 'Текст';
            this.rendered = false;
            this.buttons = {};
            this.tabs = {};
            this.conf = {};
            this.conf.parent = $(o.container);
            this.conf.panelCssClass = o.cssClass || 'panel';
            this.conf.settingsPanelCssClass = o.settingsPanelCssClass || 'settingsPanel';
            this.conf.activeButtonCssClass = o.activeButtonCssClass || 'activeItem';
            this.conf.activeTabCssClass = o.activeTabCssClass || 'activePage';
            AP.stamp(this);
            this.uniqueIdRegex = /%UNIQUE_ID%/g;
        },
        render : function () {
            var root = this.conf.parent;
            if (!L.isValue(root) && !L.isValue(root[0].nodeType)) throw new Error('You must set parent dom element for the toolbar with uid ' + this._uid + ' and title ' + this.title);
            var html = this.generateHTML().replace(this.uniqueIdRegex, this._uid);
            root.append(html);
            
            var t = this.tabs;
            O.each(t, function (tab) {
                tab.content.setParent(root);
                tab.content.render();
                tab.content.hide();
            }, this);
            
            this.initializeDOMReferences();
            this.initializeGUI();
            this.initializeCallbacks();
            this.rendered = true;
        },
        generateHTML : function () {
            var html = new StringBuffer('<div id="toolBarPanel%UNIQUE_ID%" class="' + this.conf.panelCssClass + '"><span class="panelTitle">' + this.title + '</span>'); // begin of the container code
            html.add(this.generateHTMLForButtonsAndTabTriggers())
                .add('</div>');

            return html.toString();
        },
        generateHTMLForButtonsAndTabTriggers : function () {
            var b = this.buttons, html = new StringBuffer(''), t = this.tabs;
            O.each(b, function (button) {
                html.add('<div class="panelItem" id="button' + button.title + '%UNIQUE_ID%"><div class="panelIcon ' + button.cssClass + '"></div></div>');
            }, this);
            html.add('<div class="panelSeparatop"></div>');
            O.each(t, function (tab) {
                html.add('<div class="panelItem" id="tab' + tab.title + '%UNIQUE_ID%"><div class="panelIcon ' + tab.trigger.cssClass + '"></div></div>');
            }, this);

            return html.toString();
        },
        generateHTMLForTabContent : function () {
            var html = new StringBuffer(''), t = this.tabs;
            O.each(t, function (tab) {
                tab.content.setParent(this.conf.parent);
            }, this);
            
            return html.toString();
        },
        initializeDOMReferences : function () {
            var b = this.buttons, t = this.tabs, d = this.domReferences = {};
            d.buttons = {};
            d.tabs = {};

            this.container = $('#toolBarPanel' + this._uid);

            O.each(b, function (button) {
                var title = button.title;
                d.buttons[title] = $('#button' + title + this._uid);
            }, this);
            O.each(t, function (tab) {
                var title = tab.title;
                d.tabs[title] = $('#tab' + title + this._uid);
            }, this);
        },
        initializeGUI : function () {
            var b = this.buttons, 
                t = this.tabs, 
                d = this.domReferences,
                activeButtonCssClass = this.conf.activeButtonCssClass;
            // create functions 'make button active' and 'tab active'. 
            O.each(b, function (button) {
                var title = button.title;
                button.active = false;
                button.activate = function () {
                    if (button.active) return;
                    button.active = true;
                    d.buttons[title].addClass(activeButtonCssClass);
                    button.onActivateCallback(); // call button callback
                };
                button.deactivate = function () {
                    if (!button.active) return;
                    button.active = false;
                    d.buttons[title].removeClass(activeButtonCssClass);
                    button.onDeactivateCallback();
                };
                d.buttons[title].click(function (e) {
                    if (!button.active) {
                        button.activate();
                    } else {
                        button.deactivate();
                    }
                });
            }, this);
            // initialize tab triggers
            O.each(t, function (tab, title) {
                var content = t[title].content,
                    activeTabCssClass = this.conf.activeTabCssClass;
                
                d.tabs[title].click(function (e) {
                    
                    // if correspond tab is hidden, than show it, otherwise, hide it
                    tab.visible = content.visible;
                    
                    O.each(t, function (anotherTab, index) {
                        if (index != title) {
                            anotherTab.content.hide();
                            d.tabs[anotherTab.title].removeClass(activeTabCssClass);
                        }
                    }, this);
                    
                    if (tab.visible) {
                        content.hide('fast');
                        
                        $(this).removeClass(activeTabCssClass);
                    } else {
                        content.show('fast');
                        $(this).addClass(activeTabCssClass);
                    }
                });
            }, this);
        },
        initializeCallbacks : function () {
            // initialize button callback
            // initialize tabs content event listeners and so on
        },
        addButton : function (button) {
            this.buttons[button.title] = button;
        },
        addTab : function (tab) {
            this.tabs[tab.title] = tab;
        },
        show : function () {
            if (!this.rendered) this.render();
            this.container.show();
        },
        hide : function () {
            this.container.hide();
        }
    });
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);