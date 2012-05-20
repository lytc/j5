//= require ../list/Item
$.list.Item.extend('$.table.Row table.row', {
    tag: 'tr'
    ,baseClasses: 'x-item x-row'
    ,defaultChildType: 'table.row.cell'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,setData: function(data) {
        this.empty();
        this.data = data;

        $.each(this.table.columns, function(column, index) {
            this.add(column.createCell(this, index));
        }, this);
    }

    ,setModel: function(model) {
        this.model = model;

        this.setData(model.toJson());

        model.on('change', function() {
            this.setData(model.toJson());
        }.bind(this));

        model.on('destroy', function() {
            this.destroy();
        }.bind(this));
    }

    ,index: function() {
        if (!this.isRendered()) {
            if (this.table.bodyComponent.data)  {
                return this.table.bodyComponent.data.indexOf(this.data);
            } else {
                return this.table.bodyComponent.collection.indexOf(this.model);
            }
        }
        return this.callSuper();
    }
});