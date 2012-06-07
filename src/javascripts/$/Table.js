//= require ./Component

/**
 * @class $.Table
 */
$.Component.extend('$.Table table', {
    tag: 'table'
    ,baseClasses: 'x-list x-table'

    ,defaultOptions: $.readOnlyObject({
        striped: true
    })

    ,initElement: function() {
        this.callSuper();

        this.colgroup = this.add({
            tag: 'colgroup'
        });

        this.thead = this.add({tag: 'thead'}).add({tag: 'tr'});

        this.tbody = this.add({
            tag: 'tbody'
        });
    }

    ,setColumns: function(columns) {
        $.each(columns, function(column) {
            column.xtype || (column.xtype = 'table.column');
            var columnClass = $.alias(column.xtype);

            this.colgroup.add(new columnClass(this, column));

            column.tag = 'th';
            this.thead.add(new columnClass(this, column));
        }, this);
        return this;
    }

    ,setData: function(data) {
        this.tbody.empty();

        var columns = this.colgroup.children()
            ,row
            ,cell;

        $.each(data, function(rowData) {
            row = new $.table.Row(this);
            this.tbody.add(row);

            $.each(columns, function(column) {
                cell = column.createCell(row, rowData);
                row.add(cell);
            });
        }, this);

        return this;
    }

    ,setCollection: function(collection) {
        if (collection.hasLoaded) {
            return this.setData(collection.toJson());
        }

        collection.on('load', function(){
            this.setData(collection.toJson());
        }, this);

        if (this.maskOnLoad) {
            collection.on('load:start', function() {
                this.mask('boolean' == typeof this.maskOnLoad? 'Loading...' : this.maskOnLoad);
            }, this);

            collection.on('load:complete', function() {
                this.unmask();
            }, this);
        }

        return this;
    }

    ,setMaskOnLoad: function(mask) {
        this.maskOnLoad = mask;
        return this;
    }

    ,setStripedRow: function(bool) {
        this.switchClasses(bool, 'x-striped-row');
        return this;
    }

    ,setStripedCol: function(bool) {
        this.switchClasses(bool, 'x-striped-col');
        return this;
    }

    ,getCol: function(query) {
        if (query instanceof $.table.Column) {
            return query;
        }

        return this.colgroup.query(query);
    }

    ,getRow: function(query) {
        if (query instanceof $.table.Row) {
            return query;
        }

        return this.tbody.query(query);
    }

    ,getCell: function(col, row) {
        col =  this.getCol(col);
        return col.getCell(row);
    }
});