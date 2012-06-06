//= require ../Validator

/**
 * @class $.validator.Number
 */
$.Validator.types['number'] =

$.Validator.extend('$.validator.Number', {
	min: null
	,max: null
	,invalidMessage: 'This field should be a number'
	,minMessage: 'This field should be greater than {0}'
	,maxMessage: 'This field should be less than {0}'
	
	,validate: function() {
		var value = this.getValue();
		this.messages = [];
		
		if (undefined === value || null === value || '' === value) {
			return true;
		}
		
		var isValid = true;
		
		if (!/\d+/.test(value)) {
			this.messages.push(this.invalidMessage);
			isValid = false;
		}
		
		value = parseInt(value);
		if (this.min && this.min > value) {
			this.messages.push(this.minMessage.format(this.min));
			isValid = false;
		}
		
		if (this.max && this.max < value) {
			this.messages.push(this.maxMessage.format(this.max));
			isValid = false;
		}
		
		return isValid;
	}
});