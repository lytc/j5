//= require ./Trigger

$.field.Trigger.extend('$.field.Select field.select', {
    baseClasses: 'x-field x-field-text x-field-trigger x-field-select'
    ,filterRegex: '(.*){0}(.*)$'
    ,nameField: 'id'
    ,valueField: 'id'
    ,htmlField: 'value'

    ,defaultOptions: $.readOnlyObject({
        menu: {
            styles: {
                maxHeight: '150px'
            }
        }
        ,menuAlign: 'left'
    })

    ,initElement: function() {
        this.callSuper();

        this.menu = this.fieldWrap.add({
            xtype: 'menu'
            ,classes: 'x-hidden'
            ,hideGutter: true
            ,listeners: {
                show: function() {
                    this.clearSelection();
                }
            }
        });

        var hideOnBlurCallback = function(e) {
            this.menu.hide(100);
        }.bind(this);

        this.inputEl.on('blur', hideOnBlurCallback);

        this.triggerButton.on({
            mousedown: function() {
                this.inputEl.un('blur', hideOnBlurCallback);
            }.bind(this)

            ,mouseup: function() {
                this.menu.toggleDisplay();

                $.each(this.menu.children(), function(item) {
                    item.show();
                });
                this.inputEl.on('blur', hideOnBlurCallback);
            }.bind(this)
        });

        this.inputEl.on('keyup', function(e) {
            var key = e.getKey();
            if (!e.canModifyText()) {
                return;
            }
            this.filter();
        }, this);

        var me = this;
        this.inputEl.setKeyListener({
            up: function() {
                me.menu.selectPrev();
            }
            ,down: function() {
                me.menu.selectNext();
            }
            ,esc: function() {
                me.menu.hide();
            }
            ,enter: function(e) {
                var selected = me.menu.getFirstSelected();
                if (selected) {
                    e.stop();
                    me.select(selected);
                    me.menu.hide();
                }
            }
        });
    }

    ,setMenu: function(options) {
        this.menu.applyOptions(options);
        return this;
    }

    ,setMenuAlign: function(align) {
        this.menuAlign = align;
        return this;
    }

    ,setData: function(data) {
        this.menu.empty();
        var menuItem, me = this;

        $.each(data, function(item) {
            if ('string' == typeof item) {
                item = {
                    name: item
                    ,value: item
                    ,html: item
                }
            } else if (item instanceof Array) {
                item = {
                    name: item[0]
                    ,value: item[0]
                    ,html: item[1]
                }
            } else {
                item = {
                    name: item[this.nameField]
                    ,value: item[this.valueField]
                    ,html: item[this.htmlField]
                }
            }

            menuItem = this.menu.add(item);

            menuItem.anchorEl.on('click', function(e) {
                e.stop();

                me.setValue(this.getData('value'));
            }.bind(menuItem));

        }, this);
    }

    ,renderer: function(v) {
        return v;
    }

    ,filter: function() {
        var value = this.getValue()
            ,found = false
            ,regex = new RegExp($.String.format(this.filterRegex, value))
            ,menuItems = this.menu.children();

        $.each(menuItems, function(item) {
            if (regex.test(item.textEl.getHtml())) {
                item.show();
                found = true;
            } else {
                item.hide();
            }
        });

        if (!found) {
            this.menu.hide();
        } else {
            this.menu.show();
        }
    }

    ,select: function(item) {
        this.setValue(item.getData('value'));
        return this;
    }
});