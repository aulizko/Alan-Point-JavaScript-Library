(function () {

    var $ = AP.Query,
        CherInfo = AP.namespace('CherInfo'),
        toolbarButtonTemplate = {
            name : 'component:toolbarButton',
            body : '<div id="%{title}:%{uniqueId}" class="panelItem"><div class="panelIcon %{cssClass}"></div></div>'
        },
        windowCheckboxTemplate = {
            name : 'component:input:checkbox',
            body : '<div class="windowElement" id="%{title}:%{uniqueId}">\
                        <input class="windowCheckbox" type="checkbox">%{humanizedTitle}\
                    </div>'
        },
        windowTextareaTemplate = {
            name : 'component:input:textarea',
            body : '<div class="windowElement" id="%{title}:%{uniqueId}">\
                        <h3 class="miniLabel">%{humanizedTitle}</h3>\
                        <textarea class="windowTextArea"></textarea>\
                    </div>'
        },
        toolbarTextInputTemplate = {
            name : 'component:input:toolbarTextInput',
            body : '<div class="%{containerCssClass}">\
                        <div class="settingsInputLabel">%{humanizedTitle}</div>\
                        <input value="%{defaultValue}"/>\
                    </div>'
        },
        toolbarFileInputTemplate = {
            name : 'component:input:toolbarFileInput',
            body : '<div class="%{containerCssClass}">\
                        <div class="settingsInputLabel">%{humanizedTitle}</div>\
                        <input type="file"/>\
                    </div>'
        },
        toolbarCheckboxTemplate = {
            name : 'component:input:toolbarCheckbox',
            body : '<div class="%{containerCssClass}" id="%{title}:%{uniqueId}">\
        				<input type="checkBox"/> %{humanizedTitle}\
        			</div>'
        },
        addLinkTemplate = {
            name : 'toolbarAddLink',
            body : '<div class="%{containerCssClass}" id="%{title}:%{uniqueId}">\
        				<div class="%{cssClass}"></div><a href="#">%{humanizedTitle}</a>\
        			</div>'
        }, 
        items = [];
    

    function createTextButtons () {
        var 
        boldButton = new AP.Widget.ToolbarButton({
            title : 'bold',
            cssClass : 'boldIcon',
            template : toolbarButtonTemplate
        }), 
        italicButton = new AP.Widget.ToolbarButton({
            title : 'italic',
            cssClass : 'italicIcon',
            template : toolbarButtonTemplate
        }),
        unorderedListButton = new AP.Widget.ToolbarButton({
            title : 'unorderedList',
            cssClass : 'markedListIcon',
            template : toolbarButtonTemplate
        }),
        orderedListButton = new AP.Widget.ToolbarButton({
            title : 'orderedList',
            cssClass : 'numListIcon',
            template : toolbarButtonTemplate
        }),
        unmarkedListButton = new AP.Widget.ToolbarButton({
            title : 'unmarkedList',
            cssClass : 'unmarkedListIcon',
            template : toolbarButtonTemplate
        });
        return [boldButton, italicButton, unorderedListButton, orderedListButton, unmarkedListButton];
    };

    function buildLinkTab() {
        var linkAddress = new AP.Widget.Input({
            title : 'linkAddress',
            type : 'toolbarTextInput',
            humanizedTitle : 'URL',
            template : toolbarTextInputTemplate
        }),
        linkText = new AP.Widget.Input({
            title : 'linkText',
            type : 'toolbarTextInput',
            humanizedTitle : /*Текст ссылки*/'\u0422\u0435\u043A\u0441\u0442 \u0441\u0441\u044B\u043B\u043A\u0438',
            template : toolbarTextInputTemplate
        }),
        addLink = new AP.Widget.LinkWithIcon({
            title : 'addLink',
            template : addLinkTemplate,
            cssClass : 'plusIcon',
            type : 'toolbarAddLink',
            humanizedTitle : /*Добавить ссылку*/'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443'
        }),
        deleteLink = new AP.Widget.LinkWithIcon({
            title : 'deleteLink',
            template : addLinkTemplate,
            cssClass : 'binIcon',
            hidden : true,
            type : 'toolbarAddLink',
            humanizedTitle : /*Удалить ссылку*/'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443'
        }),
        linkPanel = new AP.Widget.Panel({
            title : 'linkPanel',
            cssClass : 'settingsPanel',
            items : [linkAddress, linkText, addLink, deleteLink]
        }),
        linkTrigger = new AP.Widget.ToolbarButton({
            title : 'linkTrigger',
            cssClass : 'hyperlinkIcon',
            template : toolbarButtonTemplate,
            open : false,
            handlers : {
                click : function () {
                    var meta = this.title.replace(/Trigger/, '');
                    if (!this.open) {
                        this.publish(meta + '.activate');
                        this.open = true;
                    } else {
                        this.publish(meta + '.deactivate');
                        this.open = false;
                    }
                }
            }
        });
        return new AP.Widget.TabPanel({
            panel : linkPanel,
            trigger : linkTrigger,
            triggerOpenCssClass : 'activePage'
        });
    };

    function buildImageTab() {
        var 
        imageAddress = new AP.Widget.Input({
            title : 'imageAddress',
            type : 'toolbarTextInput',
            humanizedTitle : /*Адрес изображения*/'\u0410\u0434\u0440\u0435\u0441 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F',
            template : toolbarTextInputTemplate
        }),
        imageText = new AP.Widget.Input({
            title : 'imageText',
            type : 'toolbarTextInput',
            humanizedTitle : /*Альтернативный текст*/'\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442',
            template : toolbarTextInputTemplate
        }),
        imageFile = new AP.Widget.Input({
            title : 'imageFile',
            type : 'toolbarFileInput',
            humanizedTitle : /*Загрузить из файла*/'\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0438\u0437 \u0444\u0430\u0439\u043B\u0430',
            template : toolbarFileInputTemplate
        }),
        addImage = new AP.Widget.LinkWithIcon({
            title : 'addImage',
            template : addLinkTemplate,
            cssClass : 'plusIcon',
            type : 'toolbarAddLink',
            humanizedTitle : /*Добавить изображение*/'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
        }),
        deleteImage = new AP.Widget.LinkWithIcon({
            title : 'deleteImage',
            template : addLinkTemplate,
            cssClass : 'binIcon',
            hidden : true,
            type : 'toolbarAddLink',
            humanizedTitle : /*Удалить изображение*/'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435'
        }),
        imagePanel = new AP.Widget.Panel({
            title : 'imagePanel',
            cssClass : 'settingsPanel',
            items : [imageAddress, imageText, imageFile, addImage, deleteImage]
        }),
        imageTrigger = new AP.Widget.ToolbarButton({
            title : 'imageTrigger',
            cssClass : 'addPictureIcon',
            template : toolbarButtonTemplate,
            open : false,
            handlers : {
                click : function () {
                    var meta = this.title.replace(/Trigger/, '');
                    if (!this.open) {
                        this.publish(meta + '.activate');
                        this.open = true;
                    } else {
                        this.publish(meta + '.deactivate');
                        this.open = false;
                    }
                }
            }
        });
        
        return new AP.Widget.TabPanel({
            panel : imagePanel,
            trigger : imageTrigger,
            triggerOpenCssClass : 'activePage'
        });
    };

    function buildAddPersonWindow() {
        var windowCheckbox = new AP.Widget.Input({
            title : 'windowCheckbox',
            humanizedTitle : 'Какой-то инпут',
            type : 'checkbox',
            template : windowCheckboxTemplate
        }),
        windowTextarea = new AP.Widget.Input({
            title : 'windowTextarea',
            type : 'textarea',
            humanizedTitle : 'Какая-то текстарея',
            template : windowTextareaTemplate
        });

        return new AP.Widget.Window({
            title : 'people',
            hidden : true,
            humanizedTitle : 'Добавить человека',
            target : $('.cmsHeader'),
            items : [
                windowCheckbox,
                windowTextarea
            ]
        });
    };

    function buildTableTab() {
        var 
        addRowAboveButton = new AP.Widget.ToolbarButton({
            title : 'addRowAbove',
            cssClass : 'tableToTopIcon',
            template : toolbarButtonTemplate
        }),
        addRowBelowButton = new AP.Widget.ToolbarButton({
            title : 'addRowBelow',
            cssClass : 'tableToBottomIcon',
            template : toolbarButtonTemplate
        }),
        addColumnLeftButton = new AP.Widget.ToolbarButton({
            title : 'addColumnLeft',
            cssClass : 'tableToLeftIcon',
            template : toolbarButtonTemplate
        }),
        addColumnRightButton = new AP.Widget.ToolbarButton({
            title : 'addColumnRight',
            cssClass : 'tableToRightIcon',
            template : toolbarButtonTemplate
        }),
        deleteRowButton = new AP.Widget.ToolbarButton({
            title : 'deleteRow',
            cssClass : 'delRowIcon',
            template : toolbarButtonTemplate
        }),
        deleteColumnButton = new AP.Widget.ToolbarButton({
            title : 'deleteColumn',
            cssClass : 'delCollumnIcon',
            template : toolbarButtonTemplate
        }),
        panelSeparator = new AP.Widget.CustomHTML({
            html : '<div class="panelSeparatop"/>'
        }),
        tableInvisibilityCheckbox = new AP.Widget.Input({
            title : 'tableInvisibilityCheckbox',
            type : 'toolbarCheckbox',
            containerCssClass : 'settingsCheckBox',
            humanizedTitle : /*Сделать невидимой*/'\u0421\u0434\u0435\u043B\u0430\u0442\u044C \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u043E\u0439',
            template : toolbarCheckboxTemplate
        }),
        addTable = new AP.Widget.LinkWithIcon({
            title : 'addTable',
            template : addLinkTemplate,
            cssClass : 'plusIcon',
            type : 'toolbarAddLink',
            humanizedTitle : /*Добавить таблицу*/'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u0430\u0431\u043B\u0438\u0446\u0443'
        }),
        deleteTable = new AP.Widget.LinkWithIcon({
            title : 'deleteTable',
            template : addLinkTemplate,
            cssClass : 'binIcon',
            type : 'toolbarAddLink',
            hidden : true,
            humanizedTitle : /*Удалить таблицу*/'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u0430\u0431\u043B\u0438\u0446\u0443'
        }),
        tablePanel = new AP.Widget.Panel({
            title : 'tablePanel',
            cssClass : 'settingsPanel',
            items : [addRowAboveButton, addRowBelowButton, addColumnLeftButton, addColumnRightButton, deleteRowButton, deleteColumnButton, panelSeparator, tableInvisibilityCheckbox, addTable, deleteTable]
        }),
        tableTrigger = new AP.Widget.ToolbarButton({
            title : 'tableTrigger',
            cssClass : 'addTableIcon',
            template : toolbarButtonTemplate,
            open : false,
            handlers : {
                click : function () {
                    var meta = this.title.replace(/Trigger/, '');
                    if (!this.open) {
                        this.publish(meta + '.activate');
                        this.open = true;
                    } else {
                        this.publish(meta + '.deactivate');
                        this.open = false;
                    }
                }
            }
        });
        return new AP.Widget.TabPanel({
            panel : tablePanel,
            trigger : tableTrigger,
            triggerOpenCssClass : 'activePage'
        });
    };

    function buildQuoteTab() {
        var
        quoteSource = new AP.Widget.Input({
            title : 'quoteSource',
            type : 'toolbarTextInput',
            humanizedTitle : /*Название источника*/'\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0430',
            template : toolbarTextInputTemplate
        }),
        quoteSourceUrl = new AP.Widget.Input({
            title : 'quoteSourceUrl',
            type : 'toolbarTextInput',
            humanizedTitle : /*Ссылка на источник*/'\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A',
            template : toolbarTextInputTemplate
        }),
        addQuote = new AP.Widget.LinkWithIcon({
            title : 'addQuote',
            template : addLinkTemplate,
            cssClass : 'plusIcon',
            type : 'toolbarAddLink',
            humanizedTitle : /*Добавить цитату*/'\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0446\u0438\u0442\u0430\u0442\u0443'
        }),
        deleteQuote = new AP.Widget.LinkWithIcon({
            title : 'deleteQuote',
            template : addLinkTemplate,
            cssClass : 'binIcon',
            type : 'toolbarAddLink',
            hidden : true,
            humanizedTitle : /*Удалить цитату*/'\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0446\u0438\u0442\u0430\u0442\u0443'
        }),
        quotePanel = new AP.Widget.Panel({
            title : 'quotePanel',
            cssClass : 'settingsPanel',
            items : [quoteSource, quoteSourceUrl, addQuote, deleteQuote]
        }),
        quoteTrigger = new AP.Widget.ToolbarButton({
            title : 'quoteTrigger',
            cssClass : 'quotationIcon',
            template : toolbarButtonTemplate,
            open : false,
            handlers : {
                click : function () {
                    var meta = this.title.replace(/Trigger/, '');
                    if (!this.open) {
                        this.publish(meta + '.activate');
                        this.open = true;
                    } else {
                        this.publish(meta + '.deactivate');
                        this.open = false;
                    }
                }
            }
        });
        return new AP.Widget.TabPanel({
            panel : quotePanel,
            trigger : quoteTrigger,
            triggerOpenCssClass : 'activePage'
        });
    };

    var personWindow = buildAddPersonWindow(),
    addPersonButton = new AP.Widget.ToolbarButton({
        title : 'addPerson',
        cssClass : 'addPersonIcon',
        template : toolbarButtonTemplate,
        handlers : {
            click : function (ev, el) {
                personWindow.show('fast');
            }
        }
    });

    CherInfo.toolbar = new AP.Widget.ToolBar({
        title : 'text',
        items : createTextButtons().concat([buildLinkTab(), buildImageTab(), buildTableTab(), buildQuoteTab(), addPersonButton]),
        target : $('.cmsHeader')
    });
    
    AP.Layout.render();
    
    
    //var textPanel = new AP.Widget.Panel({
        //title : 'textPanel',
        //target : $('.cmsHeader'),
        //items : [
            //boldButton,
            //italicButton
        //]
    //});

    //AP.Mediator().registerEvent('Bold.activate', boldButton);
    //AP.Mediator().registerEvent('Bold.deactivate', boldButton);

    //AP.Mediator().addEventListener('Bold.activate', function () {
        //console.log('bold.activate event received');
    //});


    //AP.Mediator().addEventListener('Bold.deactivate', function () {
        //console.log('bold.deactivate event received');
    //});
 
    //AP.Mediator().registerEvent('layout:ready', AP.Layout);

    //AP.Mediator().addEventListener('layout:ready', function () {
        //console.log('catched event layout:ready');
    //});

    

//    var linkAddress = new AP.Widget.Input({
//            type : 'text',
//            title : 'linkAddress',
//            label : 'URL',
//            handlers : {
//                focus : function () {
//                    this.mediator.updateLinkAddress();
//                }
//            }
//        }),
//
//    linkText = new AP.Widget.Input({
//        type : 'text',
//        title : 'linkText',
//        label : '',
//        handlers : {
//            focus : {
//                data : {somethingStrange : 'someData'},
//                fn : function (o) {
//                    this.conf = o;
//                }
//            }
//        }
//    }),


//    linkPanel = new AP.Widget.Panel({
//        cssClass : 'settingPanel',
//        items : [linkAddress, linkText]
//    }),
//
//
//    rteToolBar = new AP.Widget.ToolBar({
//        tabs : [
//            {
//                name : 'link',
//                triggerCssClass : 'addPictureIcon',
//                panel : linkPanel
//            }
//        ]
//    }),
//
//    editArea = new AP.Widget.EditArea({
//        target : $('.block')
//    });
//
//    rte = new AP.Widget.RTE({
//        toolbar : rteToolBar,
//        editArea : editArea
//    });
//    
//    rteToolBar.render();


    // describe every button
    // host it on the tabPanel (described before)
    // host all tabPanel on the toolbar
    // register toolbar on the layout

})();
