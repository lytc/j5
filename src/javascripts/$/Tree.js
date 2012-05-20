//= require ./List

$.List.extend('$.Tree tree', {
    baseClasses: 'x-list x-tree'
    ,defaultChildType: 'tree.item'

    ,defaultOptions: $.readOnlyObject({
        multiSelect: true
    })
});