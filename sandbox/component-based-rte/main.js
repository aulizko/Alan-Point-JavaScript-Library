(function () {

    var $ = AP.Query;

    var boldButton = new AP.Widget.ToolbarButton({
        title : 'Bold'
    }), italicButton = new AP.Widget.ToolbarButton({
        title : 'Italic'
    }), buttons = [boldButton, italicButton];
    

    var textPanel = new AP.Widget.Panel({
        title : 'textPanel',
        parent : AP.Layout
    });

    textPanel.registerChild(boldButton);
    textPanel.registerChild(italicButton);

    var  html = textPanel.generateHTML();

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
