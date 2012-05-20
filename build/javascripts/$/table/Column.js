//= require ../Observable

$.table.Cell.extend('$.table.Column table.column', {
    defaultCellType: 'table.row.cell'

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
    }

    ,setAlign: function(align) {
        this.callSuper(arguments);
        this.align = align;
    }

    ,setWidth: function(width) {
        this.callSuper(arguments);
        this.width = width;
    }

    ,setHidden: function(bool) {
        this.callSuper(arguments);

        if (this.isRendered()) {
            var index = this.index();

            $.each(this.table.bodyComponent.children(), function(row) {
                row.child(index).setHidden(bool);
            });
        }

        this.hidden = bool;
        return this;
    }

    ,setRenderer: function(renderer) {
        this.renderer = renderer;
        return this;
    }

    ,hide: function() {
        return this.setHidden(true);
    }

    ,show: function() {
        return this.setHidden(false);
    }

    ,createCell: function(row, index) {
        var cellClass = $.alias(this.defaultCellType);

        return new cellClass(row, {
            renderer: this.renderer
            ,html: row.data[this.dataField]
            ,editable: this.editable
            ,align: this.align
            ,hidden: this.hidden
            ,width: this.width
        });
    }
});