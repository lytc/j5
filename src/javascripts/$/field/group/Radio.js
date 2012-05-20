//= require ../Group

$.field.Group.extend('$.field.group.Radio field.group.radio', {
    defaultOptions: $.readOnlyObject({
        defaults: {
            xtype: 'field.radio'
            ,name: $.uniq('x-random-radio-name')
        }
    })

    ,getValue: function() {
        var fields = this.fieldWrap.children();
        var value;

        $.each(fields, function(field) {
            if (field.isChecked()) {
                value = field.getValue();
                return false;
            }
        });
        return value;
    }
});