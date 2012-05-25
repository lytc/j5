/**
 * @class $.Dom
 */
$.Dom = {
	is: function(obj) {
		return obj instanceof HTMLElement;
	}
	
	,query: function(selectors, root, all) {
		root || (root = document);
		
		if (/(>|\+|~)/.test(selectors)) {
			(root != document) || (root = document.body);
			var uniqClass = $.uniq('x-uniq-class-');
			selectors = selectors.split(',');
			for (var i = 0, len = selectors.length; i < len; i++) {
				selectors[i] = selectors[i].trimLeft().replace(/^(>|\+|~)/, '.' + uniqClass + ' $1');
			}
			selectors = selectors.join(',');
			
			root.classList.add(uniqClass);
		}

        var matches = selectors.match(/(.*):(focus|first|last|at\(\d+\))/);
        if (matches) {
            selectors = matches[1];
            all = true;
        }

		var result = root[all? 'querySelectorAll' : 'querySelector'](selectors);

        if (matches) {
            switch (matches[2]) {
                case 'focus':
                    var active = document.activeElement;
                    for (var i = 0, len = result.length; i < len; i++) {
                        if (active === result[i]) {
                            return result[i];
                        }
                    }
                    return;
                    break;

                case 'first':
                    return result.item(0);
                    break;

                case 'last':
                    return result.item(result.length - 1);
                    break;

                default:
                    var matches = matches[2].match(/at\((\d+)\)/);
                    return result.item(matches[1]);
            }
        }
		
		if (uniqClass) {
			root.classList.remove(uniqClass);
		}
		
		return result;
	}
	
	,queryAll: function(selectors, root) {
		return this.query(selectors, root, true);
	}
	
	,create: function(options) {
		options || (options = {});
		('string' != typeof options) || (options = {tag: options});
		options.tag || (options.tag = 'div');
		
		var dom = document.createElement(options.tag);
		delete options.tag;
		
		if (options.html) {
			dom.innerHTML = options.html;
			delete options.html;
		}
		
		if (options.children) {
			(options.children instanceof Array) || (options.children = [options.children]);
			$.each(options.children, function(child) {
				dom.appendChild($.Dom.create(child));
			});
			delete options.children;
		}
		
		$.each(options, function(value, attribute) {
			dom.setAttribute(attribute, value);
		});
		return dom;
	}
	
	,toElement: function(dom /* or query */) {
		if ('string' == typeof dom) {
			dom = $.Dom.query(dom);
			if (!dom) {
				throw new Error($.String.format('Dom element with query "{0}" not found', dom));
			}
		}
		
		if (dom.$el) {
			return dom.$el;
		}
		
		return new $.Element(dom);
	}
}