//= require ./Regex
$.Validator.types['email'] =

$.validator.Regex.extend('$.validator.Email', {
	message: 'This field should be an e-mail address'
	,pattern: /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/
});