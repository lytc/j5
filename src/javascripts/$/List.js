//= require ./Component

$.Component.extend('$.List list', {
    tag: 'ul'
    ,baseClasses: 'x-list'
    ,defaultChildType: 'list.item'

    ,multiSelect: false
    /*,defaultOptions: $.readOnlyObject({
        multiSelect: false
    })*/

    ,initElement: function() {
        this.callSuper();

        var me = this;
        this.on('add', function(item) {
            item.on({
                'select deselect': function() {
                    me.trigger('selectionchange');
                }
                ,select: function() {
                    me.trigger('select', this);
                }
            });
        });
    }

    ,setDirection: function(direction) {
        this.switchClasses(direction == 'horizontal', 'x-horizontal');
        return this;
    }

    ,setMultiSelect: function(bool) {
        /*
        if (!this._singleSelectCallback) {
            var me = this;
            this._singleSelectCallback = function() {
                var me2 = this;
                $.each(me.getSelection(), function(item2) {
                    if (me2 != item2) {
                        item2.deselect();
                    }
                });
            }
        }

        if (this._isInitItem) {
            $.each(this.children(), function(item, index) {
                if (bool) {
                    item.un('select', this._singleSelectCallback);
                } else {
                    item.on('select', this._singleSelectCallback);
                    var selection = this.getSelection();

                    // just keep first selected
                    selection.shift(0);
                    $.each(selection, function(item) {
                        item.deselect();
                    });

                }
            }, this);
        } else {
            this.on('inititem', function() {
                this.setMultiSelect(bool);
            });
        }
        */
        this.multiSelect = bool;

        return this;
    }

    ,getSelected: function(at) {
        query = '> .x-selected';

        if ('number' == typeof at) {
            at = 'at(' + at + ')';
        }

        if (at) {
            query += ':' + at;
        }

        return this.query(query);
    }

    ,getSelection: function(bool) {
        var query = bool !== false? '> .x-selected' : '> :not(.x-selected)';
        return this.queryAll(query);
    }

    ,select: function(items) {
        if (!this.multiSelect) {
            this.clearSelection();
        }

        if (undefined === items) {
            items = this.children();
        }

        (items instanceof Array) || (items = [items]);

        $.each(items, function(item) {
            if ('number' == typeof item) {
                item = this.child(item);
            }
            item.select();
        }, this);

        return this;
    }

    ,clearSelection: function() {
        $.each(this.getSelection(), function(item) {
            item.deselect();
        });
        return this;
    }

    ,toggleSelection: function() {
        var unselection = this.getSelection(false);
        this.clearSelection();

        $.each(unselection, function(item) {
            item.select();
        });

        return this;
    }

    ,selectFirst: function() {
        return this.select(0);
    }

    ,selectLast: function() {
        return this.select(this.lastChild());
    }

    ,getFirstSelected: function() {
        return this.getSelected();
    }

    ,getLastSelected: function() {
        return this.getSelected('last');
    }

    ,getSelectAt: function(at) {
        return this.getSelected(at);
    }

    ,selectNext: function() {
        var selected = this.getFirstSelected()
            ,next;

        if (selected) {
            next = selected.getNext();
        }

        if (!next) {
            next = this.child(0);
        }

        return this.select(next);
    }

    ,selectPrev: function() {
        var selected = this.getFirstSelected()
            ,prev;

        if (selected) {
            prev = selected.getPrev();
        }

        if (!prev) {
            prev = this.lastChild();
        }

        return this.select(prev);
    }
});