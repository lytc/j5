//= require ../Component

$.Component.extend('$.list.Item list.item', {
    tag: 'li'
    ,baseClasses: 'x-item'

    ,constructor: function() {
        this.callSuper(arguments);

        this.getElementHandlerSelect().on('click', function(e) {
            e.cancelBubble();
            this.toggleSelect();
        }, this);
    }

    ,getElementHandlerSelect: function() {
        return this;
    }

    ,setRadioSelect: function(bool) {
        this.isRadioSelect = bool;
        return this;
    }

    ,isSelected: function() {
        return this.hasClasses('x-selected');
    }

    ,setSelected: function(bool) {
        this.switchClasses(bool, 'x-selected');

        this.trigger('selectionchange', bool);
        this.trigger(bool? 'select' : 'deselect');

        return this;
    }

    ,select: function() {
        if (this.isRadioSelect) {
            this.radioClasses('x-selected');
        }
        return this.setSelected(true);
    }

    ,deselect: function() {
        return this.setSelected(false);

    }

    ,toggleSelect: function() {
        return this[this.isSelected()? 'deselect' : 'select']();
    }

    ,radioSelect: function() {
        this.radioClasses('x-selected');
        this.select();
    }
});