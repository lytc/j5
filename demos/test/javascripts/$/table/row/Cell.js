//= require ../Cell
//= require ../Row

$.table.Cell.extend('$.table.row.Cell table.row.cell', {
    constructor: function(row, options) {
        this.row = row;
        this.callSuper([options]);
    }

    ,renderer: function(value, row) {
        return value;
    }

    ,setEditable: function(bool) {
        this.setAttr('contenteditable', !!bool);
        return this;
    }

    ,setRenderer: function(renderer) {
        if (renderer) {
            this.renderer = renderer;
        }
        return this;
    }

    ,setHtml: function(html) {
        html = this.renderer(html, this.row);
        return this.callSuper([html]);
    }
});