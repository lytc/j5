//= require ./Observable

/**
 * @class $.Template
 */
(function() {
	var cache = {};
	
	$.Observable.extend('$.Template', {
	    evaluateRegex: /<%([\s\S]+?)%>/g
        ,exprRegex: /<%=([\s\S]+?)%>/g

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

            var escapes = {
                '\\':   '\\',
                "'":    "'",
                r:      '\r',
                n:      '\n',
                t:      '\t',
                u2028:  '\u2028',
                u2029:  '\u2029'
            };

            for (var key in escapes) escapes[escapes[key]] = key;
            var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
            var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

            var unescape = function(code) {
                return code.replace(unescaper, function(match, escape) {
                    return escapes[escape];
                });
            };

            var source = '';

            // add helpers
            $.each($.Template.helpers, function(fn, name) {
                source += 'var ' + name + '=' + fn.toString() + ';';
            });

            source += "var _t=''; _t+='" + this.html
                .replace(escaper, function(match) {
                    return '\\' + escapes[match];
                })
                .replace(this.exprRegex, function(match, code) {
                    return "'+\n(" + unescape(code) + ")+\n'";
                })
                .replace(this.evaluateRegex, function(match, code) {
                    return "';\n" + unescape(code) + "\n;_t+='";
                })
                + "';\nreturn _t;\n";

            this.compiledFn = new Function(source);
            return this;
		}

		,render: function(data) {
			this.compile();
			return this.compiledFn.bind(data)();
		}
	});

    $.extend($.Template, {
        get: function(options) {
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
            var tpl = new $.Template(options);
            return tpl;
        }

        ,helpers: {

        }
    });
})();