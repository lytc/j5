//= require ./Checkbox

/**
 * @class $.field.Radio
 */
$.field.Checkbox.extend('$.field.Radio field.radio', {
	baseClasses: 'x-field x-field-radio'

	,initElement: function() {
        this.callSuper();

		this.inputEl.setAttr('type', 'radio');
	}
});