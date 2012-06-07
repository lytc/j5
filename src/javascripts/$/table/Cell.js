//= require ../Component

/**
 * @class $.table.Cell
 * @superclass $.Component
 */
$.Component.extend('$.table.Cell table.cell', {
    /**
     * @property String tag
     * @default td
     */
    tag: 'td'

    /**
     * @method constructor
     * @param $.table.Row row
     * @param Object [options]
     * @return $.table.Cell
     */
    ,constructor: function(row, options) {
        this.row = row;
        this.callSuper([options]);
    }

    /**
     * @method setAlign
     * @param String align
     * @return $.table.cell
     */
    ,setAlign: function(align) {
        this.setStyles('textAlign', align);
        return this;
    }
});