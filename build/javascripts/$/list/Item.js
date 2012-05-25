//= require ../Component

/**
 * @class $.list.Item
 */
$.Component.extend('$.list.Item list.item', {
    tag: 'li'
    ,baseClasses: 'x-item'

    ,constructor: function() {
        this.callSuper(arguments);

        this.getElementHandlerSelect().on('click', function(e) {
            if (this.clickToToggle) {
                this.toggleSelect();
            } else {
                this.select();
            }
        }, this);
    }

    ,setClickToToggle: function(bool) {
        this.clickToToggle = bool;
        return this;
    }

    ,getElementHandlerSelect: function() {
        return this.el;
    }

    ,isSelected: function() {
        return this.hasClasses('x-selected');
    }

    ,setSelected: function(bool) {
        var isSelected = this.isSelected();
        if (bool && isSelected || !bool && !isSelected) {
            return this;
        }

        this.switchClasses(bool, 'x-selected');

        this.trigger('selectionchange', bool, this);
        this.trigger(bool? 'select' : 'deselect', this);

        return this;
    }

    ,select: function() {
        return this.setSelected(true);
    }

    ,deselect: function() {
        return this.setSelected(false);
    }

    ,toggleSelect: function() {
        return this[this.isSelected()? 'deselect' : 'select']();
    }
});