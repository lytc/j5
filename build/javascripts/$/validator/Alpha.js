//= require ./Regex

/**
 * @class $.validator.Alpha
 */
$.Validator.types['aplpha'] =
$.validator.Regex.extend('$.validator.Alpha', {
	pattern: /^[a-zA-Z_]+$/
	,message: 'This field should only contain letters and _'
});