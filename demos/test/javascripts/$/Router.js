//= require ./Observable

$.Observable.extend('$.Router', {
	constructor: function(routes, options) {
		this._routes = routes || {};
		$.Navigator.on('change', function(path) {
			$.each(this._routes, function(callback, route) {
				var matches = path.match(new RegExp(route));
				if (matches) {
					var scope = window;
					if ('string' == typeof callback) {
						callback = this[callback];
						scope = this;
					}
					callback.apply(scope, $.Array.splice(matches));
				}
				
			}, this);
		}, this);
        this.callSuper([options]);
	}
	
	,add: function(route, callback) {
		if (undefined === callback) {
			$.each(route, function(callback, route) {
				this.add(route, callback);
			}, this);
		} else {
			this._routes[(route + '').replace(/^\/(.*)\/$/, '$1').replace(/\\/, '\\\\')] = callback;
		}
		
		return this;
	}
	
	,remove: function(route) {
		$.Array.remove(this._route, (route + '').replace(/^\/(.*)\/$/, '$1').replace(/\\/, '\\\\'));
		return this;
	}
});