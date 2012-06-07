//= require ../Column

/**
 * @class $.table.column.RowNumberer
 */
$.table.Column.extend('$.table.column.RowNumberer table.column.rownumberer', {
    /**
     * @property Number offset
     * @default 1
     */
    offset: 1

    /**
     * @method setOffset
     * @param Number offset
     * @return $.table.column.RowNumberer
     */
    ,setOffset: function(offset) {
        this.offset = offset;
        return this;
    }

    /**
     * @method createCell
     * @return $.table.Cell
     */

    ,createCell: function(row, rowData) {
        var cell = new $.table.cell.RowNumberer(row, {
            offset: this.offset
            ,attr: {
                align: this.align
            }
        });
        cell.refresh();
        return cell;
    }

    ,refresh: function() {

    }
});