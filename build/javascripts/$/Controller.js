//= require ./Observable

$.Observable.extend('$.Controller', {
	before: $.emptyFn
	,after: $.emptyFn
	
	,getParam: function(name) {
		return Js.getQueryParams()[name];
	}
});