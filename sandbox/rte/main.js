(function () {
    var $ = AP.Query, 
    rteToolBar = new AP.ToolBar({
        title : 'Текст',
        container : $('.header')
    });
    rteToolBar.addButton({
        title : 'Bold',
        cssClass : 'boldIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addButton({
        title : 'Italic',
        cssClass : 'italicIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addButton({
        title : 'UnorderedList', 
        cssClass : 'markedListIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addButton({
        title : 'OrderedList', 
        cssClass : 'numListIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addButton({
        title : 'alignTextLeft',
        cssClass : 'toLeftIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addButton({
        title : 'alignTextRight',
        cssClass : 'toRightIcon',
        onActivateCallback : function () {},
        onDeactivateCallback : function () {}
    });
    rteToolBar.addSelect({
        title : 'formatText',
        values : {
            '<p>' : 'Обычный текст',
            '<h1>' : 'Заголовок',
            '<h2>' : 'Подзаголовок',
            '<h3>' : 'Малый заголовок'
        },
        defaultValue : '<p>',
        onChange : function () {  }
    });
    
    
    rteToolBar.addTab({
        title : 'Link',
        trigger : {
            cssClass : 'hyperlinkIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'linkContent',
                id : 'linkContent',
                eventListeners : {
                    focus : function () {  }
                },
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Текст ссылки</div>\
                             <input id="linkContent%UNIQUE_ID%" value="">\
                         </div>'
            });
            a.registerComponent({
                title : 'linkAddress',
                id : 'linkAddress',
                eventListeners : {
                    focus : function () {  }
                },
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">URL</div>\
                             <input value="" id="linkAddress%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'linkTooptip',
                id : 'linkTooptip',
                eventListeners : {
                    focus : function () {  }
                },
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Подсказка</div>\
                             <input value="" id="linkTooptip%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'addLink',
                id : 'addLink',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addLink%UNIQUE_ID%">Добавить ссылку</a></div>'
            });
            a.registerComponent({
                title : 'deleteLink',
                id : 'deleteLink',
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteLink%UNIQUE_ID%">Удалить ссылку</a></div>'
            });
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'Picture',
        trigger : {
            cssClass : 'addPictureIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'pictureAddress',
                id : 'pictureAddress',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Адрес изображения</div>\
                             <input value="" id="pictureAddress%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'pictureTitle',
                id : 'pictureTitle',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Подпись под изоражением</div>\
                             <input value="" id="pictureTitle%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'addPicture',
                id : 'addPicture',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addPicture%UNIQUE_ID%">Добавить изображение</a></div>'
            });
            a.registerComponent({
                title : 'deletePicture',
                id : 'deletePicture', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deltePicture%UNIQUE_ID%">Удалить изображение</a></div>'
            });
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'Video',
        trigger : {
            cssClass : 'addVideoIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'videoEmbed',
                id : 'videoEmbed',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Ссылка на видео</div>\
                             <input value="" id="videoEmbed%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'addVideo',
                id : 'addVideo',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addVideo%UNIQUE_ID%">Добавить видео</a></div>'
            });
            a.registerComponent({
                title : 'deleteVideo',
                id : 'deleteVideo', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteVideo%UNIQUE_ID%">Удалить видео</a></div>'
            });
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'Audio',
        trigger : {
            cssClass : 'addAudioIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            
            a.registerComponent({
                title : 'audioEmbed',
                id : 'audioEmbed',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Ссылка на аудио</div>\
                             <input value="" id="audioEmbed%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'addAudio',
                id : 'addAudio',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addAudio%UNIQUE_ID%">Добавить аудио</a></div>'
            });
            a.registerComponent({
                title : 'deleteAudio',
                id : 'deleteAudio', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteAudio%UNIQUE_ID%">Удалить аудио</a></div>'
            });
            
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'Quote',
        trigger : {
            cssClass : 'quotationIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            
            a.registerComponent({
                title : 'quoteSource',
                id : 'quoteSource',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Название источника</div>\
                             <input value="" id="quoteSource%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'quoteAddress',
                id : 'quoteAddress',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Ссылка на источник</div>\
                             <input value="" id="quoteAddress%UNIQUE_ID%">\
                         </div>'
            });
            a.registerComponent({
                title : 'addQuote',
                id : 'addQuote',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addQuote%UNIQUE_ID%">Добавить цитату</a></div>'
            });
            a.registerComponent({
                title : 'deleteQuote',
                id : 'deleteQuote', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteQuote%UNIQUE_ID%">Удалить цитату</a></div>'
            });
            
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'Table',
        trigger : {
            cssClass : 'addTableIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            a.registerComponent({
                title : 'addRowAbove',
                id : 'addRowAbove',
                eventListeners : {},
                html : '<div class="panelItem settingsPanelIcon" id="addRowAbove%UNIQUE_ID%"><div class="panelIcon tableToTopIcon"></div></div>'
            });
            a.registerComponent({
                title : 'addRowBelow',
                id : 'addRowBelow',
                eventListeners : {},
                html : '<div class="panelItem settingsPanelIcon" id="addRowBelow%UNIQUE_ID%"><div class="panelIcon tableToBottomIcon"></div></div>'
            });
            a.registerComponent({
                title : 'addColumnLeft',
                id : 'addColumnLeft',
                eventListeners : {},
                html : '<div id="addColumnLeft%UNIQUE_ID%" class="panelItem settingsPanelIcon"><div class="panelIcon tableToLeftIcon"></div></div>'
            });
            a.registerComponent({
                title : 'addColumnRight',
                id : 'addColumnRight',
                eventListeners : {},
                html : '<div id="addColumnRight%UNIQUE_ID%" class="panelItem settingsPanelIcon"><div class="panelIcon tableToRightIcon"></div></div>'
            });
            a.registerComponent({
                title : 'deleteRow',
                id : 'deleteRow',
                eventListeners : {},
                html : '<div id="delRowIcon%UNIQUE_ID%" class="panelItem settingsPanelIcon"><div class="panelIcon delRowIcon"></div></div>'
            });
            a.registerComponent({
                title : 'deleteColumn',
                id : 'deleteColumn',
                eventListeners : {},
                html : '<div id="delCollumnIcon%UNIQUE_ID%" class="panelItem settingsPanelIcon"><div class="panelIcon delCollumnIcon"></div></div>'
            });
            a.registerComponent({
                title : 'makeTableInvisible',
                id : 'makeTableInvisible',
                eventListeners : {},
                html : '<div class="settingsInput"><div class="settingsInputLabel">Сделать таблицу невидимой</div><input type="checkbox" id="makeTableInvisible%UNIQUE_ID%"></input></div>'
            });
            
            a.registerComponent({
                title : 'addTable',
                id : 'addTable',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addTable%UNIQUE_ID%">Добавить таблицу</a></div>'
            });
            a.registerComponent({
                title : 'deleteTable',
                id : 'deleteTable', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteTable%UNIQUE_ID%">Удалить таблицу</a></div>'
            });
            
            return a;
        }()
    });
    rteToolBar.addTab({
        title : 'File',
        trigger : {
            cssClass : 'addFileIcon'
        },
        content : function () {
            var a = new AP.Panel({
                cssClass : 'settingsPanel'
            });
            
            a.registerComponent({
                title : 'attachment',
                id : 'attachment',
                eventListeners : {},
                html : '<div class="settingsInput">\
                             <div class="settingsInputLabel">Файл для загрузки</div>\
                             <input value="" type="file" id="attachment%UNIQUE_ID%">\
                         </div>'
            });
            
            a.registerComponent({
                title : 'addFile',
                id : 'addFile',
                eventListeners : {},
                html : '<div class="addLink"><a href="#" id="addFile%UNIQUE_ID%">Добавить ссылку на файл</a></div>'
            });
            a.registerComponent({
                title : 'deleteFile',
                id : 'deleteFile', 
                eventListeners : {},
                html : '<div class="addLink hidden"><div class="deleteIcon"></div><a href="#" id="deleteFile%UNIQUE_ID%">Удалить ссылку на файл</a></div>'
            });
            
            return a;
        }()
    });
    rteToolBar.show();
    var GUI = {
        topPanel : {
            visible : true
        }
    };
    
    $('.topPanelArrow').click(function (e) {
        if (GUI.topPanel.visible) {
            $('.header').animate({height : '23px'}, 500).animate({ width : '23px' }, 700);
            rteToolBar.hide();
            GUI.topPanel.visible = false;
        } else {
            $('.header').animate({ width : '100%' }, 700).animate({height : '58px'}, 500);
            rteToolBar.show();
            GUI.topPanel.visible = true;
        }
        
    });
    // var e = new AP.Widget.RTE({
    //         textareaClass : 'wisywig',
    //         containerClass : 'clicheEditor',
    //         iframeClass : 'textarea',
    //         pathToStyleSheet : 'clicheEditor.css'
    //     });
    //     e.render();
    // a.registerComponent({
    //     title : 'separator',
    //     html : '<div class="settingsPanelSeparator"></div>'
    // });
})();