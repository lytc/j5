//= require ../Group

$.field.Group.extend('$.field.group.Checkbox field.group.checkbox', {
    defaultOptions: $.readOnlyObject({
        defaults: {
            xtype: 'field.checkbox'
        }
    })

    ,getValue: function(all) {
        var fields = this.fieldWrap.children();
        var value = [], fieldName, fieldValue;

        $.each(fields, function(field) {
            if (!all && !field.isChecked()) {
                return;
            }

            fieldValue = field.getValue();
            fieldName = field.getName();

            if (fieldName) {
                value.push({name: fieldName, value: fieldValue});
            } else {
                value.push(fieldValue);
            }
        });
        return value;
    }
});