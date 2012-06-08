//= require ../Column

$.table.Column.extend('$.table.column.Action table.column.action', {
    defaultItemType: 'button'

    ,setItems: function(items) {
        this.items = items;
        return this;
    }

    ,createCell: function(row, rowData) {
        var cell = this.callSuper(arguments);

        $.each(this.items, function(item) {
            item.xtype || (item.xtype = this.defaultItemType);
            item = cell.add(item);
            item.setClick(function() {
                item.options.callback(row, rowData);
            });
        }, this);

        return cell;
    }
});