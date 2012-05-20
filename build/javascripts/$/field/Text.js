//= require ./Field
//= require ./mixins/Labelable
//= require ./plugins/ValidateIndicator
//= require ./mixins/SelectOnFocusable
//= require ./mixins/Placeholderable

$.field.Field.extend('$.field.Text field.text', {
	baseClasses: 'x-field x-field-text'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.Placeholderable
        ,$.field.mixins.SelectOnFocusable
    ]
	,plugins: [
		//'$.field.plugins.Labelable'
		'$.field.plugins.ValidateIndicator'
	]

	,initElement: function() {
        this.callSuper();
		var input = this.fieldWrap.add({
            tag: 'input'
            ,attr: {
                type: 'text'
            }
        });
		this.inputEl = input.el;

        this.trigger('render:input');
	}
});