//= require ./List

/**
 * @class $.Tree
 */
$.List.extend('$.Tree tree', {
    baseClasses: 'x-list x-tree'
    ,defaultChildType: 'tree.item'

    ,getSelection: function(bool) {
        var query = bool !== false? '.x-tree-item.x-selected' : ':not(.x-tree-item.x-selected)';
        return this.queryAll(query);
    }
});