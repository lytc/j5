App.plugins.Test = $.Observable.extend({
	constructor: function(model) {
		model.on('constructor', function() {
			console.log('constructor model');
		});
	}
});