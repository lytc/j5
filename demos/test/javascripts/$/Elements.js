$.Elements = function(doms) {
	this.doms = doms;
	
	if ('string' == typeof doms) {
		this.doms = $.Dom.queryAll(doms);
	}
	
	var methods = $.Element.methods();
	$.each(methods, function(method) {
		this[method] = function() {
			return callEach.call(this, method, arguments);
		}
	}, this);
	
	var _el;
	function el(dom) {
		if (dom.$el) {
			return dom.$el;
		}
		
		if (!_el) {
			_el = new $.Element(dom);
		}
		_el.dom = dom;
		return _el;
	}
	
	function callEach(fn, args) {
		var result, _el;
		
		$.each(this.doms, function(dom) {
			_el = el(dom);
			result = _el[fn].apply(_el, args);
		}, this);
		
		if (result instanceof $.Element) {
			return this;
		}
		
		return result;
	}
	
	$.extend(this, {
		count: function() {
			return this.doms.length;
		}
		,on: function() {
			var args = arguments;
			this.each(function(el) {
				el.on.apply(el, args);
			}, true, this);
			return this;
		}
		,un: function() {
			var args = arguments;
			this.each(function(el) {
				el.un.apply(el, args);
			}, true, this);
			return this;
		}
		,each: function(fn, uniq, scope) {
			uniq || (uniq = false);
			$.each(this.doms, function(dom) {
				return fn.call(scope, $.Element.get(dom, null, uniq));
			}, this);
			return this;
		}
		,at: function(at) {
			var dom = this.doms[at];
			if (dom) {
				return $.Element.get(dom);
			}
		}
		,first: function() {
			return this.at(0);
		}
		,last: function() {
			return this.at(this.count() - 1);
		}
		,range: function(start, end) {
			return new $.Elements([].slice.call(this.doms, start, end));
		}
	});
};