//= require ../List

/**
 * @class $.table.Body
 */
$.List.extend('$.table.Body table.body', {
    tag: 'tbody'
    ,baseClasses: 'x-body'
    ,defaultChildType: 'table.row'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,initElement: function() {
        this.callSuper();
        this.el.wrap();
    }

    ,setData: function(data) {
        this.data = data;
        this.empty();

        var row;
        $.each(data, function(rowData) {
            this.add(row = new $.table.Row(this.table));
            row.setData(rowData);
        }, this);
    }

    ,setCollection: function(collection) {
        this.collection = collection;
        var row;

        collection.on('change', function() {
            this.empty();

            $.each(collection.models, function(model) {
                this.add(new $.table.Row(this.table, {
                    model: model
                }));
            }, this);

        }.bind(this));
    }
});