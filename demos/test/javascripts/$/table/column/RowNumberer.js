//= require ../Column

$.table.Column.extend('$.table.column.RowNumberer table.column.rownumberer', {
    initElement: function() {
        this.callSuper();
        this.addClasses('x-numberer');
    }

    ,createCell: function(row) {
        var cell = this.callSuper(arguments);
        cell.addClasses('x-numberer');
        cell.setHtml(row.index());
        return cell;
    }
});