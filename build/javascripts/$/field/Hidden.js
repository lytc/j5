//= require ./Field

/**
 * @class $.field.Hidden
 */
$.field.Field.extend('$.field.Hidden field.hidden', {
	baseClasses: 'x-field x-field-hidden'
	,initElement: function() {
		this.callSuper();
		this.inputEl = this.el.append('<input>');
		this.inputEl.setAttr('type', 'hidden');

        this.trigger('render:input');
    }
});