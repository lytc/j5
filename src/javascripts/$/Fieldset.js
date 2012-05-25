//= require ./Component

/**
 * @class $.Fieldset
 */
$.Component.extend('$.Fieldset fieldset', {
	baseClasses: 'x-fieldset'
	,tag: 'fieldset'
	
	,initElement: function() {
		this.callSuper();
		this.legendEl = this.el.append('<legend>');
	}
	
	,setLegend: function(options) {
		this.legendEl.applyOptions(options);
		return this;
	}
});