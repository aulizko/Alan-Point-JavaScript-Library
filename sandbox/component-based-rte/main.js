(function () {

    var $ = AP.Query;

    var boldButton = new AP.Widget.ToolbarButton({
        title : 'Bold'
    }), italicButton = new AP.Widget.ToolbarButton({
        title : 'Italic'
    }), buttons = [boldButton, italicButton];
    
    for (var i = buttons.length - 1; i > -1; i--) {
        console.log(buttons[i]);
        console.log(buttons[i].generateHTML());
    }
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
