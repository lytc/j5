//= require ../Component

$.Component.extend('$.table.Header table.header', {
    tag: 'thead'
    ,baseClasses: 'x-header'
    ,defaultChildType: 'table.column.header'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }
});