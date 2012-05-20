//= require ./Observable

(function() {
	var cache = {};
	
	$.Observable.extend('$.Template', {
		autoEscape: true
		,exprRegex: /<%= (((?!<%=).)*) %>/g
	  ,ifRegex: /<% if (.*): %>([\s\S]*)<% endif %>/g
	  ,forRegex: /<% for (.*): %>([\s\S]*)<% endfor %>/g

		,constructor: function(options) {
			if (arguments.length > 1) {
				options = {html: arguments.join('')};
			} else {
				options = 'string' == typeof options? {html: options} : options;
			}
			
			if (options) {
				var me = this, html;
				if (options.url) {
					var ajax = new $.Ajax({
						url: options.url
						,async: false
						,success: function(responseText) {
							html = responseText;
							cache[options.url] = me;
						}
					}).send();
				} else {
					html = options.html;
					cache[html] = this;
				}
				this.html = html;
			}
			this.callSuper(arguments);
		}

		,compile: function() {
			if (this.compiledFn) {
				return this;
			}

			var me = this;
			function compile(html) {
				html = html.replace(me.forRegex, function(m, m1, m2) {
					return "' + (function(){\
			      var result = '';\
			      for " + m1 + " {\
			        result += ('" + compile(m2) + "');\
			      }\
			      return result;\
			    }).bind(this)() + '";
				}).replace(me.ifRegex, function(m, m1, m2) {
					return "' + (function(){\
				    if " + m1 + " {\
				      return '" + compile(m2) + "'\
				    }\
						return ''\
				  }).bind(this)() + '";
				}).replace(me.exprRegex, function(m, m1) {
					if (me.autoEscape) {
						return "' + escape(" + m1 + ") + '";
					}
					return "' + (" + m1 + ") + '";
				}).replace(/\n/g, '');

				return html;
			}

			var _html = compile(this.html);
			_html = "function escape(v) {return $.String.escape(v)}; return '" + _html + "'";

			this.compiledFn = new Function(_html);
			return this;
		}

		,render: function(data) {
			this.compile();
			return this.compiledFn.bind(data)();
		}
	});
	
	$.Template.get = function(options) {
		var key;
		if (arguments.length > 1) {
			key = arguments.join('');
		} else {
			if ('string' == typeof options) {
				key = options;
			} else if (options && options.url) {
				key = options.url;
			}
		}
		
		if (key && cache[key]) {
			return cache[key];
		}
		var tpl = new $.Template();
		tpl.constructor.apply(tpl, arguments);
		return tpl;
	}
})();