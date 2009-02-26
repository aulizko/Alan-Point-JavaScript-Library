(function () {
    var $ = AP.Query, 
    poll = new AP.ToolBar({
        title : 'Опрос',
        container : $('.header')
    });
    poll.addButton({
        title : 'Bold',
        cssClass : 'boldIcon',
        onActivateCallback : function () { alert('make bold!!!'); },
        onDeactivateCallback : function () { alert('make thin!!!'); }
    });
    poll.addButton({
        title : 'Italic',
        cssClass : 'italicIcon',
        onActivateCallback : function () { alert('make italic!!!'); },
        onDeactivateCallback : function () { alert('make non italic!!!'); }
    });
    poll.addTab({
        title : 'Link',
        trigger : {
            cssClass : 'hyperlinkIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'url',
                id : 'linkAddress',
                eventListeners : {
                    focus : function () { console.log('url input focus received'); }
                },
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Источник</div>\
                             <input value="Источник" id="linkAddress%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'separator',
                html : '<div class="settingsPanelSeparator"></div>'
            });
            a.registerComponent({
                title : 'linkContent',
                id : 'linkContent',
                eventListeners : {
                    focus : function () { console.log('link content input receive focus'); }
                },
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Содержание</div>\
                             <input id="linkContent%UNIQUE_ID%" value="Содержание">\
                         </div>'
            });
            return a;
        }()
    });
    poll.addTab({
        title : 'Table',
        trigger : {
            cssClass : 'addTableIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'url',
                id : 'linkAddress',
                eventListeners : {
                    focus : function () { console.log('url input focus received'); }
                },
                html : '<div class="settingsPanel">\
                         <div class="iconGroup">\
                             <div class="settingsLabel">Таблица</div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon tableToTopIcon"></div></div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon tableToBottomIcon"></div></div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon tableToLeftIcon"></div></div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon tableToRightIcon"></div></div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon delRowIcon"></div></div>\
                             <div class="panelItem settingsPanelIcon"><div class="panelIcon delCollumnIcon"></div></div>\
                         </div>\
                     </div>'
            });
            return a;
        }()
    });
    poll.show();
    // var e = new AP.Widget.RTE({
    //         textareaClass : 'wisywig',
    //         containerClass : 'clicheEditor',
    //         iframeClass : 'textarea',
    //         pathToStyleSheet : 'clicheEditor.css'
    //     });
    //     e.render();
})();