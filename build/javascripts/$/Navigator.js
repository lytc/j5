//= require ./Observable

/**
 * @class $.Navigator
 */
$.Navigator = (function(){
	var navigator = $.Observable.extend({
		constructor: function() {
			var me = this;
			window.onpopstate = function() {
				me.trigger('change', window.location.pathname, {}, me);
			}
            this.callSuper(arguments);
		}

		,navigate: function(path, options) {
			options || (options = {});
			if (!options.allowDuplicate && (path == window.location.pathname)) {
				return this;
			}
            if (history.pushState) {
                history.pushState(options.data, options.title, path);
            } else {
                window.location.href = '/#' + path;
            }

			if (true !== options.silent) {
				this.trigger('change', path, options, this);
			}
			return this;
		}
		
		,getParam: function(name) {
			return $.getUrlQueryParam(name);
		}
	});
	return new navigator;
})();