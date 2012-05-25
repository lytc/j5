//= require ../Validator

/**
 * @class $.validator.Require
 */
$.Validator.types['require'] =

$.Validator.extend('$.validator.Require', {
	message: 'This field is required'
	
	,validate: function() {
		var isValid = this.getValue() !== '';
		this.messages = isValid? [] : [this.message];
		return isValid;
	}
});