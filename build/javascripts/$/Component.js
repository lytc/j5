//= require ./Observable
//= require ./Element

$.Observable.extend('$.Component component', {
	tag: 'div'
	,baseClasses: 'x-comp'
	,defaultChildType: 'component'
	
	,fallbackFunctions: 'setWidth, getWidth, setHeight, getHeight, getLeft, setLeft, getTop, setTop, getRight, setRight, getAttr, setAttr, setStyles, getStyle, setHtml, addClasses, getClasses, hasClasses, removeClasses, toggleClasses, switchClasses, radioClasses, deRadioClasses, setClickRadioClasses, show, hide, collapse, expand, isRendered, setData, getData, setName, getName, setValue, getValue, index'

    ,constructor: function(options) {
        options || (options = {});
        this.items = [];

        this.tag = options.tag || this.tag;

        // init plugins
        this.plugins || (this.plugins = []);
        options.plugins || (options.plugins = []);
        (options.plugins instanceof Array) || (options.plugins = [options.plugins]);
        var plugins = [].concat(this.plugins || [], options.plugins);

        $.each(plugins, function(plugin) {
            this.addPlugin(plugin);
        }, this);

        this.initElement();
        this.callSuper([options]);
    }

    ,initElement: function() {
        this.el = new $.Element('<' + this.tag + '>');
        this.el.dom.$comp = this;
        this.setClasses('');
        this.trigger('render');
        this.rendered = true;
    }

    ,isRendered: function() {
        return this.el? this.el.isRendered() : false;
    }

    ,addPlugin: function(plugin) {
        plugin = $.getClass(plugin);
        new plugin(this);
    }
	
	,on: function(events, callback, scope) {
        if ('object' == typeof events) {
            scope = callback;
			$.each(events, function(callback, event) {
				this.on(event, callback, scope);
			}, this);
		} else {
            var me = this;
			var _events = events.split(/\s+/);
			$.each(_events, function(event) {
				if ($.Element.events[event]) {
					this.el.on(event, callback, scope || this);
				}
                $.Observable.prototype.on.call(this, event, callback, scope || this);
			}, this);
		}
		
		return this;
	}
	
	,un: function(events, callback, scope) {
		var _events = events.split(/\s+/);
        var me = this;
		$.each(_events, function(event) {
			if ($.Element.events[event]) {
				this.el.un(event, callback, scope);
			} else {
                // @todo ?????
                $.Observable.prototype.un.call(this, event, callback, scope);
                //me.super('un', [event, callback, scope]);
                //$.Component.__super__.un.call(this, event, callback, scope);
			}
		}, this);
		return this;
	}
	
	,setEl: function(options) {
		this.el.applyOptions(options);
		return this;
	}
	
	,setAppendTo: function(target) {
		this.el.appendTo(target);
		return this;
	}
	
	,setClasses: function(classes) {
		classes = 'x-comp ' + this.baseClasses + ' ' + classes;
		classes = classes.trim();
		classes = classes.split(/\s+/g);
		classes = $.Array.uniq(classes).join(' ');
		this.el.setAttr('class', classes);
		return this;
	}

    ,setHidden: function(bool) {
        return this.switchClasses(bool, 'x-hidden');
    }

    ,setDefaults: function(options) {
        this.defaults = options;
        return this;
    }

	,add: function(components) {
        if (components instanceof Array) {
			return $.each(components, function(component) {
				return this.add(component);
			}, this);
		} else {
			if (!(components instanceof $.Component)) {
				options = components;

                if (this.defaults) {
                    $.each(options, function(value, name) {
                        if ('string' == typeof value && 'object' == typeof this.defaults[name]) {
                            options[name] = {html: value};
                        }
                    }, this);
                }

                options = $.extend({}, this.defaults, options, this.requiredDefaults, true);
				options.xtype || (options.xtype = this.defaultChildType);

				components = new ($.alias(options.xtype))(options);
			}
			this.el.append(components.el);
			this.trigger('add', components);
			this.items.push(components);

			return components;
		}
	}
	
	,setChildren: function() {
		var result = this.add.apply(this, arguments);

        this._isInitItem = true;
        this.trigger('inititem');
        return result;
	}
	
	,contains: function(comp) {
		return this.el.contains(comp.el);
	}
	
	,query: function(query) {
		var el = this.el.query(query);
		if (el && el.dom.$comp) {
			return el.dom.$comp;
		}
	}
	
	,queryAll: function(query) {
		var result = [];
		var els = this.el.queryAll(query);
		
		els.each(function(el) {
			if (el.dom.$comp) {
				result.push(el.dom.$comp);
			}
		});
		return result;
	}
	
	,findAncestor: function(query) {
		var el = this.el.findAncestor(query);
		if (el && el.dom.$comp) {
			return el.dom.$comp;
		}
	}

    ,child: function(at) {
        var dom = $.Dom.query('> .x-comp:nth-child(' + (at + 1) + ')', this.el.dom);
        if (dom && dom.$comp) {
            return dom.$comp;
        }
    }

    ,firstChild: function() {
        return this.child(0);
    }

    ,lastChild: function() {
        var dom = $.Dom.query('> .x-comp:last-child', this.el.dom);
        if (dom && dom.$comp) {
            return dom.$comp;
        }
    }
	
	,children: function() {
		var result = [], doms = $.Dom.queryAll('> .x-comp', this.el.dom);
		
		$.each(doms, function(dom) {
            result.push(dom.$comp);
        });

		return result;
	}

    ,getNext: function() {
        var el = this.el.getNext();
        if (el && el.dom.$comp) {
            return el.dom.$comp;
        }
    }

    ,getPrev: function() {
        var el = this.el.getPrev();
        if (el && el.dom.$comp) {
            return el.dom.$comp;
        }
    }
	
	,empty: function() {	
		$.each(this.el.dom.children, function(child) {
			if (child.$comp) {
				child.$comp.destroy();
			}else if (child.$el) {
				child.$el.destroy();
			}
		});
        this.el.empty();
		return this;
	}
	
	,destroy: function() {
		this.empty();
		this.el.destroy();
	}
});

// fallback function
(function(){
    var fallbackMethods = $.Element.methods();
    $.each(fallbackMethods, function(method) {
        if (!$.Component.prototype[method]) {
            $.Component.addProperties(method, function() {
                return this.el[method].apply(this.el, arguments);
            });
        }
    });
})();

$.Component.get = function(query) {
	var el = $.Element.get(query);
	if (el.dom.$comp) {
		return el.dom.$comp;
	}
};