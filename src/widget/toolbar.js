AP.add('toolbar', function (A) {
    var $ = A.Query, L = A.Lang, StringBuffer = A.StringBuffer, O = A.Object;
    
    A.ToolBar = A.Class.extend({
        init : function (o) {
            this.uniqueIdRegex = /%UNIQUE_ID%/g;
            this.title = o.title || 'Текст';
            this.rendered = false;
            this.buttons = {};
            this.selects = {};
            this.tabs = {};
            this.conf = {};
            this.conf.parent = $(o.container);
            this.conf.panelCssClass = o.cssClass || 'panel';
            this.conf.settingsPanelCssClass = o.settingsPanelCssClass || 'settingsPanel';
            this.conf.activeButtonCssClass = o.activeButtonCssClass || 'activeItem';
            this.conf.activeTabCssClass = o.activeTabCssClass || 'activePage';
            
            AP.stamp(this);
            
            this.mediator = o.mediator || function () {};
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
            var b = this.buttons, 
                html = new StringBuffer(''), 
                s = this.selects,
                t = this.tabs;
            O.each(b, function (button) {
                html.add('<div class="panelItem" id="button' + button.title + '%UNIQUE_ID%"><div class="panelIcon ' + button.cssClass + '"></div></div>');
            }, this);
            O.each(s, function (select) {
                html.add('<div class="settingsInput"><select id="select' + select.title + '%UNIQUE_ID%">');
                
                O.each(select.values, function (value, index) {
                    html.add('<option')
                        .add((index == select.defaultValue) ? ' selected' : '')
                        .add(' value="')
                        .add(index)
                        .add('">')
                        .add(value)
                        .add('</option>');
                }, this);
                
                html.add('</select></div>');
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
            var b = this.buttons, 
                s = this.selects,
                t = this.tabs, 
                d = this.domReferences = {};
            d.buttons = {};
            d.tabs = {};
            d.selects = {};

            this.container = $('#toolBarPanel' + this._uid);

            O.each(b, function (button) {
                var title = button.title;
                d.buttons[title] = $('#button' + title + this._uid);
            }, this);
            O.each(s, function (select) {
                var title = select.title;
                d.selects[title] = $('#select' + title + this._uid);
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
                activeButtonCssClass = this.conf.activeButtonCssClass,
                self = this;
            // create functions 'make button active' and 'tab active'. 
            O.each(b, function (button) {
                var title = button.title;
                button.active = false;
                button.highlighted = false;
                button.highlight = function () {
                    if (button.highlighted) return;
                    button.highlighted = true;
                    d.buttons[title].addClass(activeButtonCssClass);
                };
                button.turnOffHighlight = function () {
                    if (!button.highlighted) return;
                    button.highlighted = false;
                    d.buttons[title].removeClass(activeButtonCssClass);
                };
                button.activate = function () {
                    if (button.active) return;
                    button.active = true;
                    button.highlight();
                    button.onActivateCallback.call(self, button); // call button callback
                };
                
                button.deactivate = function () {
                    if (!button.active) return;
                    button.active = false;
                    button.turnOffHighlight();
                    button.onDeactivateCallback.call(self, button);
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
                    
                content.setToolBar(this); // todo remove
                
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
            var s = this.selects,
                d = this.domReferences,
                self = this;
            
            O.each(s, function (select, title) {
                d.selects[title].change(function (e) { return select.onChange.call(self, d.selects[title][0]); });
            }, this);
            // initialize button callback
            // initialize tabs content event listeners and so on
        },
        addButton : function (button) {
            this.buttons[button.title] = button;
        },
        addSelect : function (select) {
            this.selects[select.title] = select;
        },
        addTab : function (tab) {
            this.tabs[tab.title] = tab;
        },
        show : function () {
            if (!this.rendered) this.render();
            this.container.show();
        },
        hide : function () {
            var t = this.tabs, d = this.domReferences, activeTabCssClass = this.conf.activeTabCssClass;
            O.each(t, function (tab, title) {
                d.tabs[title].removeClass(activeTabCssClass);
                tab.content.hide();
            }, this);
            this.container.hide();
        },
        setMediator : function (mediator) {
            this.mediator = mediator;
        }
    });
}, '0.0.1', [
    { name : 'lang', minVersion : '0.0.3' },
    { name : 'object', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);