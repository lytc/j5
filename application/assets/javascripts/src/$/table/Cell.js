//= require ../Component

$.Component.extend('$.table.Cell table.cell', {
    tag: 'td'
    ,baseClasses: 'x-cell'

    ,setAlign: function(align) {
        return this.setStyles('textAlign', align);
    }
});