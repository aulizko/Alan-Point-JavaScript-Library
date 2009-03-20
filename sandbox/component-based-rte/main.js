(function () {

    var $ = AP.Query,
        toolbarButtonTemplate = {
            name : 'component:toolbarButton',
            body : '<div id="%{title}:%{uniqueId}" class="panelItem"><div class="panelIcon %{cssClass}"></div></div>'
        },
        CherInfo = AP.namespace('CherInfo'),
        windowCheckboxTemplate = {
            name : 'checkbox',
            body : '<div class="windowElement" id="%{title}:%{uniqueId}">\
                        <input class="windowCheckbox" type="checkbox">%{humanizedTitle}\
                    </div>'
        },
        windowTextareaTemplate = {
            name : 'textarea',
            body : '<div class="windowElement" id="%{title}:%{uniqueId}">\
                        <h3 class="miniLabel">%{humanizedTitle}</h3>\
                        <textarea class="windowTextArea"></textarea>\
                    </div>'
        };
    

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
    unorderedList = new AP.Widget.ToolbarButton({
        title : 'unorderedList',
        cssClass : 'markedListIcon',
        template : toolbarButtonTemplate
    }),
    orderedList = new AP.Widget.ToolbarButton({
        title : 'orderedList',
        cssClass : 'numListIcon',
        template : toolbarButtonTemplate
    });
    // TODO: implement unmarked list
    var linkTabButton = new AP.Widget.ToolbarButton({
        title : 'linktabbutton',
        cssClass : 'addFileIcon',
        template : toolbarButtonTemplate
    });
    
    var linkPanel = new AP.Widget.Panel({
        title : 'linkPanel',
        cssClass : 'settingsPanel',
        items : [linkTabButton]
    });
    
    var linkTrigger = new AP.Widget.ToolbarButton({
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
    
    var linkTabPanel = new AP.Widget.TabPanel({
        panel : linkPanel,
        trigger : linkTrigger,
        triggerOpenCssClass : 'activePage'
    });

    

    var imagePanel = new AP.Widget.Panel({
        title : 'imagePanel',
        cssClass : 'settingsPanel'
    });
    
    var imageTrigger = new AP.Widget.ToolbarButton({
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
    
    var imageTabPanel = new AP.Widget.TabPanel({
        panel : imagePanel,
        trigger : imageTrigger,
        triggerOpenCssClass : 'activePage'
    });
    
    
    var windowCheckbox = new AP.Widget.Input({
        title : 'windowCheckbox',
        humanizedTitle : 'Какой-то инпут',
        type : 'checkbox',
        template : windowCheckboxTemplate
    });
    
    var windowTextarea = new AP.Widget.Input({
        title : 'windowTextarea',
        type : 'textarea',
        humanizedTitle : 'Какая-то текстарея',
        template : windowTextareaTemplate
    });
    
    var humanWindow = new AP.Widget.Window({
        title : 'people',
        humananizedTitle : 'Добавить человека',
        target : $('.cmsHeader'),
        items : [
            windowCheckbox,
            windowTextarea
        ]
    });
    
    
    
    
    CherInfo.toolbar = new AP.Widget.ToolBar({
        title : 'text',
        items : [
            boldButton,
            italicButton,
            unorderedList,
            orderedList,
            linkTabPanel,
            imageTabPanel
        ],
        target : $('.cmsHeader')
    });
    
    
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

    AP.Layout.render();

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
