//= require ./Regex

$.Validator.types['url'] =

$.validator.Regex.extend('$.validator.Url', {
	message: 'This field should be a URL'
	,pattern: /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i
});