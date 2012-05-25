//= require ./Regex

/**
 * @class $.validator.AlphaNum
 */
$.Validator.types['aplphanum'] =

$.validator.Regex.extend('$.validator.AlphaNum', {
	message: 'This field should only contain letters, numbers and _'
	,pattern: /^[a-zA-Z0-9_]+$/
});