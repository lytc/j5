//= require ../Cell

/**
 * @class $.table.cell.RowNumberer
 * @superclass $.table.Cell
 */
$.table.Cell.extend('$.table.cell.RowNumberer', {
    /**
     * @property Number offset
     * @default 1
     */
    offset: 1

    /**
     * @method setOffset
     * @param Number offset
     * @return $.table.cell.RowNumberer
     */
    ,setOffset: function(offset) {
        this.offset = offset;
        return this;
    }

    /**
     * @method refresh
     * @return $.table.cell.RowNumberer
     */
    ,refresh: function() {
        this.setHtml(this.row.index() + this.offset);
        return this;
    }
});