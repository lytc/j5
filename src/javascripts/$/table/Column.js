//= require ../Component

/**
 * @class $.table.Column
 */
$.Component.extend('$.table.Column table.column', {
    tag: 'col'
    ,align: 'left'
    ,dataField: null

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,setDataField: function(name) {
        this.dataField = name;
        return this;
    }

    ,setEditable: function(bool) {
        this.editable = bool;
        return this;
    }

    ,setAlign: function(align) {
        this.align = align;
        return this;
    }

    ,setHidden: function(bool) {
        this[bool? 'hide' : 'show']();
    }

    ,renderer: function(value, rowData) {
        if ([undefined, null].has(value)) {
            value = '';
        }
        return value;
    }

    ,setRenderer: function(renderer) {
        this.renderer = renderer;
        return this;
    }

    ,hide: function() {
        this.setStyles('visibility', 'collapse');
        return this;
    }

    ,show: function() {
        this.removeStyles('visibility');
        return this;
    }

    ,createCell: function(row, rowData) {
        return new $.table.Cell(row, {
            html: this.renderer(rowData[this.dataField])
            ,attr: {
                align: this.align
            }
        });
    }

    ,getCell: function(row) {
        row = this.table.getRow(row);
        return row.getCell(this.index());
    }

    ,getAllCell: function() {
        return this.table.tbody.queryAll('> tr > td:nth-child(' + this.index() + ')');
    }
});