//= require ./List

/**
 * @class $.ColorPalette
 * @superclass $.List
 */
$.List.extend('$.ColorPalette colorpalette', {
    /**
     * @private
     * @property String baseClasses
     */
    baseClasses: 'x-list x-color-palette'

    /**
     * @private
     * @property Object defaultOptions
     */
    ,defaultOptions: $.readOnlyObject({
        colors: [
            '000000', '993300', '333300', '003300', '003366', '000080', '333399', '333333',
            '800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080',
            'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '969696',
            'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0',
            'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'
        ]
        ,multiSelect: false
        ,columns: 8
    })

    /**
     * @property Number itemSize
     * @default 18
     *
     */
    ,itemSize: 18

    /**
     * @method setColors
     * @param Array colors
     * @return $.ColorPalette
     */
    ,setColors: function(colors) {
        this.empty();

        $.each(colors, function(color) {
            color = '#' + color;
            this.add({
                size: this.itemSize
                ,value: color
                ,radioSelect: true
                ,styles: {
                    backgroundColor: color
                }
            });
        }, this);
        return this;
    }

    /**
     * @method setItemSize
     * @param Number size
     * @return $.ColorPalette
     */
    ,setItemSize: function(size) {
        $.each(this.children(), function(item) {
            item.setSize(size);
        });
        this.itemSize = size;
        return this;
    }

    /**
     * @method setColumns
     * @param Number columns
     * @return $.ColorPalette
     */
    ,setColumns: function(columns) {
        this.setWidth((this.itemSize + 4) * columns);
        return this;
    }

    /**
     * @method setValue
     * @param String value
     * @return $.ColorPalette
     */
    ,setValue: function(value) {
        var item = this.query('> .x-item[data-value=\\#' + value + ']');
        item.select();
        return this;
    }

    /**
     * @method getValue
     * @return String
     */
    ,getValue: function() {
        var selected = this.getFirstSelected();
        if (selected) {
            return selected.getValue().substr(-6);
        }
    }
});