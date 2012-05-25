//= require ./Observable

/**
 * @class $.Controller
 */
$.Observable.extend('$.Controller', {
	before: $.emptyFn
	,after: $.emptyFn
	
	,getParam: function(name) {
		return $.getUrlQueryParam(name);
	}
});