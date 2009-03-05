(function () {

    var $ = AP.Query;

    var x = new AP.Widget.ToolbarButton({
        title : 'Bold',
        handlers : {
            click : function () {
                
            }
        }
    });
    console.log(x);

    var linkAddress = new AP.Widget.Input({
            type : 'text',
            title : 'linkAddress',
            label : 'URL',
            handlers : {
                focus : function () {
                    this.mediator.updateLinkAddress();
                }
            }
        }),

    linkText = new AP.Widget.Input({
        type : 'text',
        title : 'linkText',
        label : 'Текст ссылки',
        handlers : {
            focus : {
                data : {somethingStrange : 'someData'},
                fn : function (o) {
                    this.conf = o;
                }
            }
        }
    }),


    linkPanel = new AP.Widget.Panel({
        cssClass : 'settingPanel',
        items : [linkAddress, linkText]
    }),


    rteToolBar = new AP.Widget.ToolBar({
        tabs : [
            {
                name : 'link',
                triggerCssClass : 'addPictureIcon',
                panel : linkPanel
            }
        ]
    }),

    editArea = new AP.Widget.EditArea({
        target : $('.block')
    });

    rte = new AP.Widget.RTE({
        toolbar : rteToolBar,
        editArea : editArea
    });
    
    rteToolBar.render();
})();
