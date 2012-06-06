//= require ../Validator

/**
 * @class $.validator.Regex
 */
$.Validator.types['regex'] =

$.Validator.extend('$.validator.Regex', {
	pattern: null
	,message: 'This field should be valid pattern {0}'
	,validate: function() {
		var value = this.getValue();
		if (undefined === value || null === value || '' === value) {
			this.messages = [];
			return true;
		}
		
		var isValid = this.pattern.test(value);
		this.messages = isValid? [] : [this.message.format(this.pattern.toString())];
		return isValid;
	}
});