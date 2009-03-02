// 1 создаем html для тулбара и edit area с учетом плагинов (хотя это скорее к toolbar)
// 2 замещаем этим html-ом элемент, который нам показали. 
// 3 инициализируем ссылки на dom - т.е. на всякие там iframe и прочее. Делаем это за счет того, что на этапе генерации html уже дали каждому нужному элементу уникальный id вида clicheEditorIframe__UNIQUE_ID__
// 4 вставляем в iframe изначальный текст
// 5 инициализируем event listeners
// 6 человек работает с информацией
// 7 после нажатия сохранить, прогоняем всю эту бодягу через валидаторы и делаем валидный (x)html код
// 8 отдаем нужный текст

AP.add('rte', function (A) {
    var $ = A.Query;
    A.Widget.RTE = A.Widget.extend({
        init : function (o) {
            this.base(o);
            
            var e = this.editArea = o.editArea, 
                t = this.toolbar = o.toolbar;;
            
            e.setMediator(this);
            t.setMediator(this);
        },
        updateState : function (state) {
            this.state = state;
            
            if (state.strong) this.toolbar.buttons.Bold.activate();
            else this.toolbar.buttons.Bold.deactivate();
            
            if (state.emphasis) this.toolbar.buttons.Italic.activate();
            else this.toolbar.buttons.Italic.deactivate();
            
            if (state.unOrderedList) {
                // this.toolbar.buttons.UnorderedList.activate();
                console.log('we are on unoredered list');
            }
            else this.toolbar.buttons.UnorderedList.deactivate();
            
            if (state.orderedList) this.toolbar.buttons.OrderedList.activate();
            else this.toolbar.buttons.OrderedList.deactivate();
            
            if (state.heading) $(this.toolbar.domReferences.selects.formatText).val('<' + state.heading + '>');
            else $(this.toolbar.domReferences.selects.formatText).val('<p>');
            
            if (state.link) {
                console.log('we are on link node');
                this.toolbar.domReferences.tabs.Link.addClass(this.conf.activeButtonCssClass);
                this.toolbar.tabs.Link.content.components.linkAddress.DOM.val(state.link.source);
                this.toolbar.tabs.Link.content.components.linkContent.DOM.val(state.link.text);
                // todo: show remove link button
            } else {
                this.toolbar.domReferences.tabs.Link.removeClass(this.conf.activeButtonCssClass);
                this.toolbar.tabs.Link.content.components.linkAddress.DOM.val('');
                this.toolbar.tabs.Link.content.components.linkContent.DOM.val('');
                // todo: show add link button
            }
            
            if (state.img) {
                this.toolbar.domReferences.tabs.Picture.addClass(this.toolbar.conf.activeButtonCssClass);
                this.toolbar.tabs.Picture.content.components.pictureAddress.DOM.val(state.img.source);
                this.toolbar.tabs.Picture.content.components.pictureTitle.DOM.val(state.img.alternate);
            } else {
                this.toolbar.domReferences.tabs.Picture.removeClass(this.toolbar.conf.activeButtonCssClass);
                this.toolbar.tabs.Picture.content.components.pictureAddress.DOM.val('');
                this.toolbar.tabs.Picture.content.components.pictureTitle.DOM.val('');
            }
            
            if (state.table) {
                this.toolbar.domReferences.tabs.Table.addClass(this.toolbar.conf.activeButtonCssClass);
                if (state.table.visible) {
                    this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', false);
                } else {
                    this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', true);
                }
            } else {
                this.toolbar.domReferences.tabs.Table.removeClass(this.toolbar.conf.activeButtonCssClass);
                this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', true);
            }
        },
        toggleBold : function () {
            this.editArea.conf.doc.execCommand('bold', false, null);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        toggleItalic : function () {
            this.editArea.conf.doc.execCommand('italic', false, null);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        toggleUnOrderedList : function () {
            this.editArea.conf.doc.execCommand('insertunorderedlist', false, null);
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        toggleOrderedList : function () {
            this.editArea.conf.doc.execCommand('insertorderedlist', false, null);
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        formatText : function (action) {
            this.editArea.conf.doc.execCommand('formatBlock', false, action);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        createLink : function () {
            var source = this.toolbar.tabs.Link.content.components.linkAddress.val(),
                content = this.toolbar.tabs.Link.content.components.linkContent.val();
            
            this.editArea.restoreSelection();
            
            if (linkText && (linkText.length > 0)) {
                if (linkAddress && (linkAddress.length > 0)) {
                    var html = "<a href='" + linkAddress + "'>" + linkText + "</a>";
                    EditArea.fn.doc.execCommand('InsertHTML', false, html);
                }
            }
            raiseEvent('clearToolBarFields');
            EditArea.fn.iframe.contentWindow.focus();
        }
    });
}, '0.0.1', [
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);