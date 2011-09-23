AP.add('widget.editor.rte', function (A) {

    var $ = A.Query,
        E = A.namespace("Widget.Editor");

    A.Widget.Editor.RTE = A.Class.extend({
        init : function (o) {
            this.setEditArea(o.editArea);
            this.prepareToolbar(o.toolbar);
        },

        /**
         * Set new edit area. I mean by this, that not only editArea property on the RTE would be fullfilled, but also all events should be subscribed
         * @method setEditArea
         */
        setEditArea : function (e) {
            this.editArea = e;
            e.subscribe('stateChanged', this.updateState.bind(this));
        },

        toolbarPrepared : false,

        prepareToolbar : function (toolbar) {
            if (this.toolbarPrepared) { return; }

            this.toolbar = toolbar;

            // listen textbuttons
            var mainToolbarPanel = toolbar.children.get('toolbarMainPanel');
            
            mainToolbarPanel.children.each(function (child, title) {
                switch(title) {
                    case 'bold' :
                        child.subscribe('activate', this.toggleBold, this);
                        child.subscribe('deactivate', this.toggleBold, this);
                        this.bold = child;
                        break;
                    case 'italic' :
                        child.subscribe('activate', this.toggleItalic, this);
                        child.subscribe('deactivate', this.toggleItalic, this);
                        this.italic = child;
                        break;
                    case 'unorderedList':
                        child.subscribe('activate', this.toggleUnOrderedList, this);
                        child.subscribe('deactivate', this.toggleUnOrderedList, this);
                        this.unorderedList = child;
                        break;
                    case 'orderedList' :
                        child.subscribe('activate', this.toggleOrderedList, this);
                        child.subscribe('deactivate', this.toggleOrderedList, this);
                        this.orderedList = child;
                        break;
                    case 'unmarkedList' :
                        child.subscribe('activate', this.toggleUnmarkedList, this);
                        child.subscribe('deactivate', this.toggleUnmarkedList, this);
                        this.unmarkedList = child;
                        break;
                    case 'indentList' :
                        child.subscribe('activate', this.doIndentList.bind(this));
                        this.indentList = child;
                        break;
                    case 'outdentList' :
                        child.subscribe('activate', this.doOutdentList.bind(this));
                        this.outdentList = child;
                        break;
                    case 'textFormatting' :
                        child.subscribe('valueChanged', this.formatText, this);
                        this.textFormatting = child;
                        break;
                
                    default:
                }
            }, this);

            var linkPanel = toolbar.children.get('linkPanel');
            // link
            this.link = {
                button : mainToolbarPanel.children.get('linkTrigger'), 
                address : linkPanel.children.get('linkAddress'),
                text : linkPanel.children.get('linkText'),
                openInNewWindow : linkPanel.children.get('openLinkInTheNewWindow'),
                visit : linkPanel.children.get('visitLink'),

                filter : /^(mailto:)?([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/,

                add : linkPanel.children.get('addLink'),
                destroy : linkPanel.children.get('deleteLink')
            };

            this.link.openInNewWindow.subscribe('valueChanged', this.toggleOpenLinkInNewWindow, this);
            this.link.visit.subscribe('activate', this.visitLink, this);
            this.link.add.subscribe('activate', this.addLink, this);
            this.link.destroy.subscribe('activate', this.deleteLink, this);

            // image
            var imagePanel = toolbar.children.get('imagePanel');
            this.image = {
                button : mainToolbarPanel.children.get('imageTrigger'),
                uploader : imagePanel.children.get('uploadImage'),
                add : imagePanel.children.get('addImage'),
                destroy : imagePanel.children.get('deleteImage'),
                address : imagePanel.children.get('imageAddress'),
                file : imagePanel.children.get('uploadImage'),
                text : imagePanel.children.get('imageText'),
                type : imagePanel.children.get('imageType'),
                addWatermark : imagePanel.children.get('addWatermark')

            };

            this.image.add.subscribe('activate', this.addPicture.bind(this));
            this.image.destroy.subscribe('activate', this.deletePicture.bind(this));

            this.image.type.subscribe('valueChanged', this.changePictureType.bind(this));
            this.image.addWatermark.subscribe('valueChanged', this.changeWatermarkAttr.bind(this));

            // table
            var tablePanel = toolbar.children.get('tablePanel');
            this.table = {
                button : mainToolbarPanel.children.get('tableTrigger'),
                prependRow : tablePanel.children.get('addRowAbove'),
                appendRow : tablePanel.children.get('addRowBelow'),
                prependColumn : tablePanel.children.get('addColumnLeft'),
                appendColumn : tablePanel.children.get('addColumnRight'),
                deleteRow : tablePanel.children.get('deleteRow'),
                deleteColumn : tablePanel.children.get('deleteColumn'),
                type : tablePanel.children.get('tableType'),
                toggleHeader : tablePanel.children.get('toggleTableHeader'),
                add : tablePanel.children.get('addTable'),
                destroy : tablePanel.children.get('deleteTable') 
            };

            this.table.prependRow.subscribe('activate', function () {
                this.prependRow();
                this.table.prependRow.release();
            }, this);
            this.table.appendRow.subscribe('activate', function () {
                this.appendRow();
                this.table.appendRow.release();
            }, this);
            this.table.prependColumn.subscribe('activate', function () {
                this.prependColumn();
                this.table.prependColumn.release();
            }, this);
            this.table.appendColumn.subscribe('activate', function () {
                this.appendColumn();
                this.table.appendColumn.release();
            }, this);
            this.table.deleteRow.subscribe('activate', function () {
                this.deleteRow();
                this.table.deleteRow.release();
            }, this);
            this.table.deleteColumn.subscribe('activate', function () {
                this.deleteColumn();
                this.table.deleteColumn.release();
            }, this);
            this.table.type.subscribe('valueChanged', this.changeTableType.bind(this));
            this.table.toggleHeader.subscribe('valueChanged', this.toggleTableHeader.bind(this));
            this.table.add.subscribe('activate', this.addTable.bind(this));
            this.table.destroy.subscribe('activate', this.deleteTable.bind(this));

            // quote
            var quotePanel = toolbar.children.get('quotePanel');
            this.quote = {
                button : mainToolbarPanel.children.get('quoteTrigger'),
                sourceRadioGroup : quotePanel.children.get('quoteSourceRadioGroup'),
                sourceSelect : quotePanel.children.get('quoteSource'),
                add : quotePanel.children.get('addQuote'),
                destroy : quotePanel.children.get('deleteQuote')
            };

            this.quote.add.subscribe('activate', this.addQuote, this);
            this.quote.destroy.subscribe('activate', this.deleteQuote, this);

            var objectTypePanel = toolbar.children.get('objectTypePanel');
            this.objectIcon = {
                button : mainToolbarPanel.children.get('objectTypeTrigger'),
                type : objectTypePanel.children.get('objectTypeSelect'),
                add : objectTypePanel.children.get('addObjectIcon'),
                destroy : objectTypePanel.children.get('deleteObjectIcon')
            };

            this.objectIcon.add.subscribe('activate', this.addObjectIcon.bind(this));
            this.objectIcon.destroy.subscribe('activate', this.deleteObjectIcon.bind(this));

            this.toolbarPrepared = true;
        },

        updateState : function (eventName, state) {
            this.state = state;

            if (state.strong) { this.bold.press(); }
            else { this.bold.release(); }

            if (state.emphasis) { this.italic.press(); }
            else { this.italic.release(); }

            if (state.unOrderedList) { this.unorderedList.press(); }
            else { this.unorderedList.release(); }

            if (state.orderedList) { this.orderedList.press(); }
            else { this.orderedList.release(); }

            if (state.unmarkedList) { this.unmarkedList.press(); }
            else { this.unmarkedList.release(); }

            if (state.textFormat != 'p') { this.textFormatting.manualSetValue('<' + state.textFormat + '>'); }
            else { this.textFormatting.manualSetValue('<p>'); }



            if (state.link) {
                this.link.button.press();
                this.link.address.setValue(state.link.href);
                this.link.text.setValue(state.link.text);

                if (state.link.openInNewWindow) {
                    this.link.openInNewWindow.check();
                } else {
                    this.link.openInNewWindow.uncheck();
                }

                if (!this.link.filter.test(state.link.href)) {
                    this.link.visit.show();
                } else {
                    this.link.openInNewWindow.hide();
                }

                this.link.add.hide();
                this.link.destroy.show();
            } else {
                this.link.button.release();
                this.link.address.setValue('');
                this.link.text.setValue(state.text);
                this.link.visit.hide();
                this.link.openInNewWindow.show();
                this.link.openInNewWindow.uncheck();

                this.link.add.show();
                this.link.destroy.hide();
            }

            if (state.img) {
                this.image.button.press();
                this.image.address.setValue(state.img.src);
                this.image.text.setValue(state.img.alt);
                
                this.image.type.manualSetValue(state.img.type);

                if (state.img.addWatermark) this.image.addWatermark.check();
                else this.image.addWatermark.uncheck();

                this.image.add.hide();
                this.image.destroy.show();
            } else {
                this.image.addWatermark.check();
                this.image.button.release();
                this.image.address.setValue('');
                this.image.text.setValue(state.text);

                this.image.type.resetToDefaultValue();

                this.image.add.show();
                this.image.destroy.hide();
            }

            if (state.table) {
                this.table.button.press();
                this.table.type.manualSetValue(state.table);

                if (state.table.className == 'twoColumns') {
                    this.table.appendColumn.hide();
                    this.table.prependColumn.hide();
                    this.table.deleteColumn.hide();
                } else {
                    this.table.appendColumn.show();
                    this.table.prependColumn.show();
                    this.table.deleteColumn.show();
                }

                if (state.table.hasHeader) {
                    this.table.toggleHeader.check();
                } else {
                    this.table.toggleHeader.uncheck();
                }

                this.table.add.hide();
                this.table.destroy.show();
            } else {
                this.table.button.release();
                this.table.type.resetToDefaultValue();
                this.table.appendColumn.show();
                this.table.prependColumn.show();
                this.table.deleteColumn.show();
                this.table.toggleHeader.uncheck();
                this.table.add.show();
                this.table.destroy.hide();
            }

            // quote
            if (state.quote) {
                this.quote.button.press();

                this.quote.add.hide();
                this.quote.destroy.show();
            } else {
                this.quote.button.release();

                this.quote.add.show();
                this.quote.destroy.hide();
            }

            // object
            if (state.objectIcon) {
                this.objectIcon.button.press();
                this.objectIcon.type.manualSetValue(state.objectIcon);
                this.objectIcon.add.hide();
                this.objectIcon.destroy.show();
            } else {
                this.objectIcon.button.release();
                this.objectIcon.type.resetToDefaultValue();     
                this.objectIcon.add.show();
                this.objectIcon.destroy.hide();
            }
        },
        toggleBold : function () {
            this.editArea.toggleStrong();
            
            if (!this.bold.active) {
                this.bold.press();
            } else {
                this.bold.release();
            }
        },
        toggleItalic : function () {
            this.editArea.toggleEmphasis();

            if (!this.italic.active) {
                this.italic.press();
            } else {
                this.italic.release();
            }
        },

        toggleUnOrderedList : function () {
            this.editArea.toggleUnOrderedList();

            if (!this.unorderedList.active) {
                this.unorderedList.press();
            } else {
                this.unorderedList.release();
            }
        },
        
        toggleOrderedList : function () {
            this.editArea.toggleOrderedList();

            if (!this.orderedList.active) {
                this.orderedList.press();
            } else {
                this.orderedList.release();
            }
        },

        toggleUnmarkedList : function () {
            this.editArea.toggleUnmarkedList();
            if (!this.orderedList.active) {
                this.unmarkedList.press();
            } else {
                this.unmarkedList.release();
            }
        },

        formatText : function () {
            this.editArea.formatText(this.textFormatting.value.toUpperCase());
        },

        toggleOpenLinkInNewWindow : function () {
            this.editArea.toggleOpenLinkInNewWindow();
        },
        visitLink : function () {
            var link = this.link.address.getValue();
            if (link) {
                AP.config.win.open( link, (new Date()).getTime(), [
                            // array joining is faster than string concatenation
                            ['height=', AP.config.doc.body.clientHeight].join(''),
                            ['width=', AP.config.doc.body.clientWidth].join(''),
                            'top=0',
                            'left=0',
                            'scollbars=yes',
                            'resizeable=yes',
                            'status=yes',
                            'titlebar=yes',
                            'toolbar=yes'
                            ].join(',') );
            }
        },
        addLink : function () {
            var href = this.link.address.value,
                content = this.link.text.value;

            this.editArea.addLink(href, content, this.link.openInNewWindow.isChecked());

            this.link.add.hide();
            this.link.destroy.show();
        },

        deleteLink : function () {
            this.editArea.removeLink();

            this.link.add.show();
            this.link.destroy.hide();
        },
        addPicture : function () {
            var url = this.image.address.value,
                alt = this.image.text.value,
                file = this.image.uploader,
                addWatermark = this.image.addWatermark.isChecked(),
                imageType = this.image.type.value;

            if (url.length) {
                if (imageType != 'withoutDescription') {

                    var imageDetails = A.Widget.Editor.ImageTypes[imageType];
                    // define width
                    var width = imageDetails.width;
                    // define height
                    var height = imageDetails.height;

                    var conf = {
                        addWatermark : addWatermark,
                        height : height,
                        width : width,
                        src : url,
                        alt : alt || '',
                        cssClass : imageDetails.cssClass,
                        initialText : AP.CherInfo.Messages.Toolbar.Text.Tab.Image.initialText, // todo: replace with something more semantic (or at list bind it not while executing),
                        uniqueId : AP.generateUID()
                    };
                } else {
                    var placeHolderType = AP.CherInfo.RTE.editArea.placeHolderType,
                        priority = 'noMain';

                    if (placeHolderType.domain) {
                        priority = 'domain';
                    } else if (placeHolderType.main) {
                        priority = 'main';
                    }
                    imageDetails = A.Widget.Editor.ImageTypes[imageType][priority][placeHolderType.orientation];

                    width = imageDetails.width;
                    // define height
                    height = imageDetails.height;

                    conf = {
                        height : height,
                        width : width,
                        src : url,
                        alt : alt || ''
                    };
                }
            } else if (file.value) {
                $.ajaxFileUpload({
                    url: '/rest/images',
                    secureuri: false,
                    inputs: file.DOM,
                    data: 'type=multisize',
                    dataType: 'json',
                    success: function(response) {
                        if (response.error) {
                            alert(response.message);
                            return;
                        }
                        
                        var entity = response.entity,
                            url,
                            imageDetails;

                        // define sizes which we want:
                        if (imageType != 'withoutDescription') {

                            imageDetails = A.Widget.Editor.ImageTypes[imageType];
                            // define url
                            url = entity.urls[imageDetails.urlType];
                        } else {
                            var placeHolderType = AP.CherInfo.RTE.editArea.placeHolderType,
                                priority = 'noMain';

                            if (placeHolderType.domain) {
                                priority = 'domain';
                            } else if (placeHolderType.main) {
                                priority = 'main';
                            }
                            imageDetails = A.Widget.Editor.ImageTypes[imageType][priority][placeHolderType.orientation];
                            url = entity.urls[imageDetails.urlType];
                        }

                        AP.CherInfo.RTE.image.address.setValue(url);

                        file.initializeLogic();
                        AP.CherInfo.RTE.addPicture();
                    }
                });

            }

            if (url.length) {
                this.editArea.addImage(conf, imageType != 'withoutDescription');
                this.image.add.hide();
                this.image.destroy.show();
            }
        },

        deletePicture : function () {
            this.editArea.removeImage();

            this.image.address.setValue('');
            this.image.alternate.setValue('');
            this.image.add.show();
            this.image.destroy.hide();
        },

        changePictureType : function () {
            this.editArea.changePictureType(this.image.type.value);
        },

        changeWatermarkAttr : function () {
            this.editArea.changeWatermarkAttr(this.image.addWatermark.isChecked());
        },

        doIndentList : function () {
            this.editArea.indent();
            this.indentList.release();
        },

        doOutdentList : function () {
            this.editArea.outdent();
            this.outdentList.release();
        },

        save : function (callback) {
            if (!this.editArea) { return; }
            AP.FeedBack.showLoader(AP.CherInfo.Messages.textProcessing);
            this.editArea.save(function (result) {
                if (result.error) {
                    AP.FeedBack.hideLoader();
                    AP.FeedBack.post(AP.Messages.error + ': ' + result.message + '<br/>' + AP.Messages.callAdministrator, 'error');
                    return;
                }

                var output = {
                    target : AP.CherInfo.RTE.editArea.targetElement,
                    value : result
                };
    
                AP.CherInfo.RTE.editArea = null;

                delete AP.CherInfo.RTE.editArea;

                callback(output);
                AP.FeedBack.hideLoader();
            });
        },

        addQuote : function () {
            var
            mode = this.quote.sourceRadioGroup.getValue(),
            manualText = (this.state && this.state.text) ? this.state.text : '';

            this.editArea.addQuote(mode, manualText);
        },
        
        deleteQuote : function () {
            this.editArea.deleteQuote();
        },

        addTable : function () {
            var type = this.table.type.getValue(),
                addHeader = (type == 'format' || type == 'vertical') ? false : this.table.toggleHeader.isChecked();

            this.editArea.addTable(type, addHeader);

            this.table.add.hide();
            this.table.destroy.show();
        },

        deleteTable : function () {
            this.editArea.deleteTable();
            
            this.table.add.show();
            this.table.destroy.hide();
            this.table.button.release();
        },

        prependRow : function () {
            this.editArea.prependRow();
            this.table.prependRow.release();
        },

        appendRow : function () {
            this.editArea.appendRow();
            this.table.appendRow.release();
        },

        prependColumn : function () {
            this.editArea.prependColumn();
            this.table.prependColumn.release();
        },

        appendColumn : function () {
            this.editArea.appendColumn();
            this.table.appendColumn.release();
        },

        deleteRow : function () {
            this.editArea.deleteRow();
            this.table.deleteRow.release();
        },

        deleteColumn : function () {
            this.editArea.deleteColumn();
            this.table.deleteColumn.release();
        },

        addObjectIcon : function () {
            this.editArea.addObject(this.objectIcon.type.getValue());

            this.objectIcon.add.hide();
            this.objectIcon.destroy.show();
        },
        deleteObjectIcon : function () {
            this.editArea.deleteObject();

            this.objectIcon.add.show();
            this.objectIcon.destroy.hide();
        },

        changeTableType : function (eventName, value) {
            this.editArea.changeTableType(value);
            if (value == 'twoColumns') {
                this.table.appendColumn.hide();
                this.table.prependColumn.hide();
            } else {
                this.table.appendColumn.show();
                this.table.prependColumn.show();
            }

            if (value == 'format' || value == 'vertical') {
                this.table.toggleHeader.hide();
            } else {
                this.table.toggleHeader.show();
            }
        },

        toggleTableHeader : function () {
            var value = this.table.type.getValue();
            if (value != 'format' || value != 'vertical') {
                this.editArea.toggleTableHeader();
            }
        },
        
        mixins : AP.util.Event.Observable
    });

}, '0.0.1', [
    { name : 'widget', minVersion : '0.0.1' },
    { name : 'widget.editor.formatter', minVersion : '0.0.1' }
]);