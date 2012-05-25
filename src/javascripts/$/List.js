//= require ./Component

/**
 * @class $.List
 */
$.Component.extend('$.List list', {
    tag: 'ul'
    ,baseClasses: 'x-list'
    ,defaultChildType: 'list.item'

    ,multiSelect: false

    ,constructor: function() {
        this.callSuper(arguments);

        var me = this;
        this.on('click', function(e) {
            var item = e.getTargetComponent(me.defaultChildType, this);
            if (item) {
                if (item.isSelected()) {
                    me.select(item);
                }
            }
        });
    }

    ,setDirection: function(direction) {
        this.switchClasses(direction == 'horizontal', 'x-horizontal');
        return this;
    }

    ,setMultiSelect: function(bool) {
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
        if (undefined === items) {
            items = this.children();
        }

        (items instanceof Array) || (items = [items]);

        if (!this.multiSelect) {
            items = [items[0]];
        }

        $.each(items, function(item, index) {
            if ('number' == typeof item) {
                items[index] = this.child(item);
            }
        }, this);

        items = $.Array(items);
        if (!this.multiSelect) {
            $.each(this.getSelection(), function(item) {
                if (!items.has(item)) {
                    item.deselect();
                }
            });
        }

        $.each(items, function(item) {
            item.select();
        }, this);

        this.trigger('selectionchange', this);
        this.trigger('select', items);

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