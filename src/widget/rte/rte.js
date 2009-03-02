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
            var activeButtonCssClass = this.toolbar.conf.activeButtonCssClass;
            
            if (state.strong) this.toolbar.buttons.Bold.highlight();
            else this.toolbar.buttons.Bold.turnOffHighlight();
            
            if (state.emphasis) this.toolbar.buttons.Italic.highlight();
            else this.toolbar.buttons.Italic.turnOffHighlight();
            
            if (state.unOrderedList) this.toolbar.buttons.UnorderedList.highlight();
            else this.toolbar.buttons.UnorderedList.turnOffHighlight();
            
            if (state.orderedList) this.toolbar.buttons.OrderedList.highlight();
            else this.toolbar.buttons.OrderedList.turnOffHighlight();
            
            if (state.heading) $(this.toolbar.domReferences.selects.formatText).val('<' + state.heading + '>');
            else $(this.toolbar.domReferences.selects.formatText).val('<p>');
            
            if (state.link) {
                this.toolbar.domReferences.tabs.Link.addClass(activeButtonCssClass);
                this.toolbar.tabs.Link.content.components.linkAddress.DOM.val(state.link.source);
                this.toolbar.tabs.Link.content.components.linkContent.DOM.val(state.link.text);
                this.toolbar.tabs.Link.content.components.addLink.DOM.parent().addClass('hidden');
                this.toolbar.tabs.Link.content.components.deleteLink.DOM.parent().removeClass('hidden');
                // todo: show remove link button
            } else {
                this.toolbar.domReferences.tabs.Link.removeClass(activeButtonCssClass);
                this.toolbar.tabs.Link.content.components.linkAddress.DOM.val('');
                this.toolbar.tabs.Link.content.components.linkContent.DOM.val(state.text);
                this.toolbar.tabs.Link.content.components.addLink.DOM.parent().removeClass('hidden');
                this.toolbar.tabs.Link.content.components.deleteLink.DOM.parent().addClass('hidden');
                // todo: show add link button
            }
            
            if (state.img) {
                this.toolbar.domReferences.tabs.Picture.addClass(activeButtonCssClass);
                this.toolbar.tabs.Picture.content.components.pictureAddress.DOM.val(state.img.source);
                this.toolbar.tabs.Picture.content.components.pictureTitle.DOM.val(state.img.alternate);
                this.toolbar.tabs.Picture.content.components.addPicture.DOM.parent().addClass('hidden');
                this.toolbar.tabs.Picture.content.components.deletePicture.DOM.parent().removeClass('hidden');
            } else {
                this.toolbar.domReferences.tabs.Picture.removeClass(activeButtonCssClass);
                this.toolbar.tabs.Picture.content.components.pictureAddress.DOM.val('');
                this.toolbar.tabs.Picture.content.components.pictureTitle.DOM.val(state.text);
                this.toolbar.tabs.Picture.content.components.addPicture.DOM.parent().removeClass('hidden');
                this.toolbar.tabs.Picture.content.components.deletePicture.DOM.parent().addClass('hidden');
            }
            
            if (state.table) {
                this.toolbar.domReferences.tabs.Table.addClass(activeButtonCssClass);
                if (state.table.visible) {
                    this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', false);
                } else {
                    this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', true);
                }
            } else {
                this.toolbar.domReferences.tabs.Table.removeClass(activeButtonCssClass);
                this.toolbar.tabs.Table.content.components.makeTableInvisible.DOM.attr('checked', true);
            }
        },
        toggleBold : function () {
            this.editArea.conf.doc.execCommand('bold', false, null);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
            if (!this.toolbar.buttons.Bold.highlighted) this.toolbar.buttons.Bold.highlight();
            else this.toolbar.buttons.Bold.turnOffHighlight();
        },
        toggleItalic : function () {
            this.editArea.conf.doc.execCommand('italic', false, null);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
            if (!this.toolbar.buttons.Italic.highlighted) this.toolbar.buttons.Italic.highlight();
            else this.toolbar.buttons.Italic.turnOffHighlight();
        },
        toggleUnOrderedList : function () {
            this.editArea.conf.doc.execCommand('insertunorderedlist', false, null);
            this.editArea.conf.iframe[0].contentWindow.focus();
            if (this.toolbar.buttons.UnorderedList.highlighted) this.toolbar.buttons.UnorderedList.turnOffHighlight();
        },
        toggleOrderedList : function () {
            this.editArea.conf.doc.execCommand('insertorderedlist', false, null);
            this.editArea.conf.iframe[0].contentWindow.focus();
            if (this.toolbar.buttons.OrderedList.highlighted) this.toolbar.buttons.OrderedList.turnOffHighlight();
        },
        formatText : function (action) {
            this.editArea.conf.doc.execCommand('formatBlock', false, action);
            this.editArea.rememberSelection();
            this.editArea.conf.iframe[0].contentWindow.focus();
        },
        createLink : function () {
            var source = this.toolbar.tabs.Link.content.components.linkAddress.DOM.val(),
                content = this.toolbar.tabs.Link.content.components.linkContent.DOM.val();
            
            this.editArea.restoreSelection();
            
            if (content && source) {
                var html = "<a href='" + source + "'>" + content + "</a>";
                this.editArea.conf.doc.execCommand('InsertHTML', false, html);
            }

            this.toolbar.tabs.Link.content.components.addLink.DOM.parent().addClass('hidden');
            this.toolbar.tabs.Link.content.components.deleteLink.DOM.parent().removeClass('hidden');
            
            this.editArea.focus();
        },
        deleteLink : function () {
            this.editArea.restoreFullTextNodeSelection();
            this.editArea.conf.doc.execCommand('unlink', false, []);
            this.editArea.restoreSelection();
            
            this.toolbar.tabs.Link.content.components.addLink.DOM.parent().removeClass('hidden');
            this.toolbar.tabs.Link.content.components.deleteLink.DOM.parent().addClass('hidden');
            
            this.editArea.focus();
        },
        addPicture : function () {
            var address = this.toolbar.tabs.Picture.content.components.pictureAddress.DOM.val(),
                title = this.toolbar.tabs.Picture.content.components.pictureTitle.DOM.val();
            
            if (address && title) {
                var html = '<img alt="' + title + '" src="' + address + '"/>';
                this.editArea.restoreSelection();
                this.editArea.backupSelection.range.collapse(false);
                this.editArea.conf.doc.execCommand('insertHTML', false, html);
            }
            
            this.toolbar.tabs.Picture.content.components.addPicture.DOM.parent().addClass('hidden');
            this.toolbar.tabs.Picture.content.components.deletePicture.DOM.parent().removeClass('hidden');
            
            this.editArea.focus();
        },
        deletePicture : function () {
            this.editArea.restoreSelection();
            var image = this.editArea.backupSelection.selectedElement;
            $(image).remove();
            image = null;
            
            this.toolbar.tabs.Picture.content.components.addPicture.DOM.parent().removeClass('hidden');
            this.toolbar.tabs.Picture.content.components.deletePicture.DOM.parent().addClass('hidden');
            
            this.editArea.focus();
            this.editArea.rememberSelection();
        }
    });
}, '0.0.1', [
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'stringBuffer', minVersion : '1.0.3' }
]);