//= require ./List

$.List.extend('$.Table table', {
    tag: 'table'
    ,baseClasses: 'x-list x-table'

    ,defaultOptions: $.readOnlyObject({
        striped: true
    })

    ,initElement: function() {
        this.callSuper();

        this.headerComponent = this.add(new $.table.Header(this));
        this.bodyComponent = this.add(new $.table.Body(this));

    }

    ,setColumns: function(columns) {
        this.columns = [];

        $.each(columns, function(options) {
            options.xtype || (options.xtype = 'table.column');

            this.columns.push(new ($.alias(options.xtype))(this, options));
        }, this);

        this.headerComponent.add(this.columns);
    }

    ,setData: function(data) {
        this.bodyComponent.setData(data);
        return this;
    }

    ,setCollection: function(collection) {
        this.bodyComponent.setCollection(collection);

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
    }

    ,setStriped: function(bool) {
        return this.switchClasses(bool, 'x-striped');
    }
});