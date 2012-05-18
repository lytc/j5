//= require ./Field
//= require ./mixins/Labelable
//= require ./plugins/ValidateIndicator
//= require ./mixins/SelectOnFocusable
//= require ./mixins/Placeholderable

$.field.Field.extend('$.field.TextArea field.textarea', {
	baseClasses: 'x-field x-field-textarea'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.Placeholderable
        ,$.field.mixins.SelectOnFocusable
    ]
    ,plugins: [
		'$.field.plugins.ValidateIndicator'
	]

    ,initElement: function() {
		this.callSuper();
        var input = this.fieldWrap.add({
            tag: 'textarea'
        });
        this.inputEl = input.el;


        this.trigger('render:input');
    }

    ,setResizable: function(direction) {
        if (true === direction) {
            direction = 'both';
        } else if (false === direction) {
            direction = 'none';
        }

        this.inputEl.setStyles('resize', direction);
        return this;
    }
});