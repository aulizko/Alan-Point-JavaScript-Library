/*Что должен уметь тулбар?
1) Регистрировать кнопки, принимать от них сообщения и менять их состояния.
2) Регистрировать табы, принимать от них сообщения (то есть, нам надо:
    а) компонент tabPanel - то есть соединение панели и trigger'a, то есть штуки, которая контролирует активность/открытость/закрытость панели
    б) транслировать сообщения от панели-дочери tabPanel до toolbar'a. И обратно.
3) Уметь транслировать сообщения дальше rte.
4) Уметь принимать сообщения от rte и отображать состояние. 
5) Уметь хостить input'ы. И тоже делать им represent state
6) Уметь хостить кнопки-триггеры окон. И симметрично. */

AP.add('widget-toolbar', function (A) {
    var DEFAULT_TOOLBAR_TEMPLATE = {
        name : 'container:toolbar',
        body : ' %{content} '
    }, 
    INNER_PANEL_DEFAULT_TEMPLATE = {
        name : 'container:innerToolbarPanel',
        body : '<div id="%{title}:%{uniqueId}" class="%{cssClass}"><span class="panelTitle">%{humanizedTitle}</span>%{content}</div>'
    },
    Ar = A.Array,
    DEFAULT_HUMANIZED_TITLE = /* Текст */ '\u0422\u0435\u043A\u0441\u0442',
    DEFAULT_HIDDEN_CLASS = 'hidden',
    tabActivationRegexp = /\.activate/,
    tabDeActivationRegexp = /\.deactivate/,
    DEFAULT_OPEN_TAB_CSS_CLASS = 'activePage';
    
    A.Widget.ToolBar = A.Widget.Container.extend({
        init : function (o) {
            this.template = o.template || DEFAULT_TOOLBAR_TEMPLATE; // todo: review that template should be empty

            this.type = 'container:toolbar';
            

            var items = o.items, tabPanels = [], controls = [], item, i = items.length - 1;

            delete o.items; // remove items from configuration

            this.base(o);
            
            Ar.each(items, function (item) {
                if (item.className == 'tabPanel') {
                    tabPanels.push(item);
                } else {
                    controls.push(item); // input or toolbarButton
                }
            }, this);
            
            var tabTriggerrs = [], panels = [];
            
            var triggerRegExp = /Trigger/;
            Ar.each(tabPanels, function (item) {
                tabTriggerrs.push(item.trigger);
                
                // subscribe toolbar on the click on the trigger
                var meta = item.trigger.title.replace(triggerRegExp, '');
                
                item.trigger.subscribe(meta + '.activate', this.openTab, this);
                item.trigger.subscribe(meta + '.deactivate', this.closeTab, this);
                
            }, this);

            // create panel for top level buttons, inputs, tab triggers
            var innerPanel = new A.Widget.Panel({
                title : 'toolbarMainPanel',
                items : controls.concat(tabTriggerrs),
                template : INNER_PANEL_DEFAULT_TEMPLATE,
                humanizedTitle : o.humanizedTitle || DEFAULT_HUMANIZED_TITLE
            });
            
            

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
                    item.panel.dataForTemplate[0].cssClass = item.panel.cssClass;
                }
                
                this.registerChild(item.panel);
            }, this);            
            
            this.currentOpenTabMeta = '';
        },
        openTab : function (eventName) {
            var meta = eventName.replace(tabActivationRegexp, '');
            if (meta) {
                this.changeTabState(meta);
            }
        },
        closeTab : function (eventName) {
            var meta = eventName.replace(tabDeActivationRegexp, '');
            if (meta) {
                this.changeTabState(meta);
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
                    
                    panel = this.children.get(meta + 'Panel');
                    panel.hide('fast');
                    this.currentOpenTabMeta = '';
                } else {
                    trigger = toolbarPanel.children.get(this.currentOpenTabMeta + 'Trigger');
                    trigger.DOM.removeClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                    trigger = toolbarPanel.children.get(meta + 'Trigger');
                    trigger.DOM.addClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                    
                    panel = this.children.get(this.currentOpenTabMeta + 'Panel');
                    panel.hide();
                    panel = this.children.get(meta + 'Panel');
                    panel.show();
                    this.currentOpenTabMeta = meta;
                }
            } else {
                trigger = toolbarPanel.children.get(meta + 'Trigger');
                
                
                trigger.DOM.addClass(DEFAULT_OPEN_TAB_CSS_CLASS);
                
                panel = this.children.get(meta + 'Panel');
                
                panel.show('fast');
                this.currentOpenTabMeta = meta;
            }
        },
        show : function (animate) {
            var toolbarPanel = this.children.get('toolbarMainPanel');
            if (animate) {
                toolbarPanel.DOM.show(70);
            } else {
                toolbarPanel.DOM.show();
            }
        },
        hide : function (animate) {
            var toolbarPanel = this.children.get('toolbarMainPanel');
            if (animate) {
                this.closeTab(this.currentOpenTabMeta);
                toolbarPanel.DOM.hide(70);
            } else {
                this.closeTab(this.currentOpenTabMeta);
                toolbarPanel.DOM.hide();
            }
        },
        className : 'toolbar'
    });

}, '0.0.1', [
    { name : 'widget-container', minVersion : '0.0.1' }
]);