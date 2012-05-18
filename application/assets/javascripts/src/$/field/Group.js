//= require ./Field
//= require ./mixins/Labelable

$.field.Field.extend('$.field.Group field.group', {
    baseClasses: 'x-field x-field-group'
    ,includes: [$.field.mixins.Labelable]

    ,setInput: function(options) {
        this.fieldWrap.applyOptions(options);
    }

    ,getField: function(name /* or index */) {
        var query = '> .x-field';
        if ('number' == typeof name) {
            query += ':at({0})'.format(name);
        } else if (/\w+/.test(name)) {
            query += '[name={0}]'.format(name);
        } else {
            query += ' ' + name;
        }
        return this.fieldWrap.query(query);
    }

    ,getName: function() {
        return this.el.getName();
    }

    ,setName: function(name) {
        this.el.setName(name);
        return this;
    }

    ,setValue: function(value) {
        var fieldName, fields = this.fieldWrap.children();

        $.each(fields, function(field, index) {
            fieldName = field.getName() || index;
            field.setValue(value[fieldName]);
        });

        return this;
    }

    ,getValue: function() {
        var fields = this.fieldWrap.children();
        var value = [], fieldName, fieldValue;

        $.each(fields, function(field) {
            fieldValue = field.getValue();

            if (fieldName = field.getName()) {
                value.push({name: fieldName, value: fieldValue});
            } else {
                value.push(fieldValue);
            }
        });
        return value;
    }

    ,setColumns: function(number) {
        var styles = number;
        if ('number' == typeof number) {
            styles = {columnCount: number}
        }
        this.fieldWrap.setStyles(styles);
        return this;
    }

    ,setChildren: function() {
        this.fieldWrap.defaults = $.extend({}, this.defaults);
        this.fieldWrap.setChildren.apply(this.fieldWrap, arguments);
        return this;
    }
});