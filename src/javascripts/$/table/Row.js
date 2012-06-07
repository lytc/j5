//= require ../Component

$.Component.extend('$.table.Row table.row', {
    tag: 'tr'
    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,getCell: function(col) {
        col = this.table.getCol(col);
        return this.child(col.getIndex());
    }

    ,getAllCell: function() {
        return this.children();
    }
});