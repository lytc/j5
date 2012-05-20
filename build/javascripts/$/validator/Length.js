//= require ../Validator

$.Validator.types['length'] =

$.Validator.extend('$.validator.Length', {
	min: null
	,max: null
	,minMessage: 'This field should be have length greater than {0}'
	,maxMessage: 'This field should be have length less than {0}'
	
	,validate: function() {
		var value = this.getValue();
		this.messages = [];
		if (undefined === value || null === value || '' === value) {
			return true;
		}
		
		var isValid = true;
		
		if (this.min && this.min > value.length) {
			this.messages.push($.String.format(this.minMessage, this.min));
			isValid = false;
		}
		
		if (this.max && this.max < value.length) {
			this.messages.push($.String.format(this.maxMessage, this.max));
			isValid = false;
		}
		
		return isValid;
	}
});