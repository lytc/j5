//= require ../menu/Item

$.menu.Item.extend('$.tree.Item tree.item', {
    baseClasses: 'x-item x-tree-item'
    ,defaultChildType: 'tree'

    ,initElement: function() {
        this.callSuper();

        this.bowEl = this.el.insert(0, {
            dom: '<span>'
            ,classes: 'x-bow'
            ,listeners: {
                click: function(e) {
                    this.toggleCollapse();

                }.bind(this)
            }
        });
    }

    ,getElementHandlerSelect: function() {
        return this.anchorEl;
    }

    ,isExpanded: function() {
        return this.hasClasses('x-expanded');
    }

    ,toggleCollapse: function() {
        if (this.isExpanded()) {
            return this.collapse();
        }
        return this.expand();
    }

    ,expand: function() {
        this.addClasses('x-expanded');
        this.trigger('toggleexpand', true);
        this.trigger('expand');
    }

    ,collapse: function() {
        this.removeClasses('x-expanded');
        this.trigger('collapse');
        this.trigger('toggleexpand', false);
    }
});