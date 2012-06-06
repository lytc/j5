//= require ./Observable
//= require ./Element

/**
 * @class $.Component
 */
$.Observable.extend('$.Component component', {
    /**
     * @property String tag
     * @default div
     */
	tag: 'div'

    /**
     * @protected
     * @property String baseClasses
     * @default x-comp
     */
	,baseClasses: 'x-comp'

    /**
     * @property String defaultChildType
     * @default component
     */
	,defaultChildType: 'component'

    /**
     * @private
     * @property fallbackFunctions
     */
	,fallbackFunctions: 'setWidth, getWidth, setHeight, getHeight, getLeft, setLeft, getTop, setTop, getRight, setRight, getAttr, setAttr, setStyles, getStyle, setHtml, addClasses, getClasses, hasClasses, removeClasses, toggleClasses, switchClasses, radioClasses, deRadioClasses, setClickRadioClasses, show, hide, collapse, expand, isRendered, setData, getData, setName, getName, setValue, getValue, index'

    /**
     * @method constructor
     * @param Object [options]
     * @return $.Component
     */
    ,constructor: function(options) {
        options || (options = {});
        this.items = [];
        if (options.el instanceof $.Element) {
            this.initElement(options.el);
            delete options.el;
        } else {
            this.tag = options.tag || this.tag;
            this.initElement();
        }

        // init plugins
        this.plugins || (this.plugins = []);
        options.plugins || (options.plugins = []);
        (options.plugins instanceof Array) || (options.plugins = [options.plugins]);
        var plugins = [].concat(this.plugins || [], options.plugins);

        $.each(plugins, function(plugin) {
            this.addPlugin(plugin);
        }, this);

        this.callSuper([options]);
    }

    /**
     * @protected
     * @method initElement
     * @param String|Element|$.Element
     * @return $.Component
     */
    ,initElement: function(el) {
        if (el instanceof $.Element) {
            this.el = el;
        } else {
            this.el = new $.Element('<' + this.tag + '>');
        }
        this.el.dom.$comp = this;
        this.setClasses('');
        this.trigger('render');
        this.rendered = true;
        return this;
    }

    /**
     * @method isRendered
     * @return Boolean
     */
    ,isRendered: function() {
        return this.el? this.el.isRendered() : false;
    }

    /**
     * @method addPlugin
     * @param $.Class|Array
     * @return $.Component
     */
    ,addPlugin: function(plugin) {
        plugin = $.getClass(plugin);
        new plugin(this);
        return this;
    }

    /**
     * @method on
     * @param String|Object events
     * @param Function [callback]
     * @param Mixed [scope]
     * @return $.Component
     */
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

    /**
     * @method un
     * @param String|Object events
     * @param Function [callback]
     * @param Mixed [scope]
     * @return $.Component
     */
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

    /**
     * @method setEl
     * @param Object options
     * @return $.Component
     */
	,setEl: function(options) {
        if (options instanceof $.Element) {
            this.el = options;
        } else {
            this.el.applyOptions(options);
        }
		return this;
	}

    /**
     * @method setAppendTo
     * @param Element|$.Element|$.Component
     * @return $.Component
     */
	,setAppendTo: function(target) {
        if (target instanceof $.Component) {
            target = target.el;
        }
		this.el.appendTo(target);
		return this;
	}

    /**
     * @method setClasses
     * @param String classes
     * @return $.Component
     */
	,setClasses: function(classes) {
		classes = 'x-comp ' + this.baseClasses + ' ' + classes;
		classes = classes.trim();
		classes = classes.split(/\s+/g);
		classes = classes.uniq().join(' ');
		this.el.setAttr('class', classes);
		return this;
	}

    /**
     * @method setData
     * @param Mixed data
     * @return $.Component
     */
    ,set$data: function(data) {
        this.$data = data;
        return this;
    }

    /**
     * @method setHidden
     * @param Boolean bool
     * @return $.Component
     */
    ,setHidden: function(bool) {
        this.switchClasses(bool, 'x-hidden');
        return this;
    }

    /**
     * @method setDefault
     * @param Object options
     * @return $.Component
     */
    ,setDefaults: function(options) {
        this.defaults = options;
        return this;
    }

    /**
     * @method add
     * @param Objec|$.Component|Array
     * @return $.Component
     */
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

    /**
     * @method setChildren
     * @param Object... children
     * @return @.Component
     */
	,setChildren: function() {
		var result = this.add.apply(this, arguments);

        this._isInitItem = true;
        this.trigger('inititem');
        return result;
	}

    /**
     * @method contains
     * @param $.Component
     * @return Boolean
     */
	,contains: function(comp) {
		return this.el.contains(comp.el);
	}

    /**
     * @mehtod query
     * @param String query
     * @return $.Component
     */
	,query: function(query) {
		var el = this.el.query(query);
		if (el && el.dom.$comp) {
			return el.dom.$comp;
		}
	}

    /**
     * @method queryAll
     * @param String query
     * @return Array
     */
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

    /**
     * @method findAncestor
     * @param query
     * @return $.Component
     */
	,findAncestor: function(query) {
		var el = this.el.findAncestor(query);
		if (el && el.dom.$comp) {
			return el.dom.$comp;
		}
	}

    /**
     * @method child
     * @param Number at
     * @return $.Component
     */
    ,child: function(at) {
        var dom = $.Dom.query('> .x-comp:nth-child(' + (at + 1) + ')', this.el.dom);
        if (dom && dom.$comp) {
            return dom.$comp;
        }
    }

    /**
     * @method firstChild
     * @return $.Component
     */
    ,firstChild: function() {
        return this.child(0);
    }

    /**
     * @method lastChild
     * @return $.Component
     */
    ,lastChild: function() {
        var dom = $.Dom.query('> .x-comp:last-child', this.el.dom);
        if (dom && dom.$comp) {
            return dom.$comp;
        }
    }

    /**
     * @method children
     * @return Array
     */
	,children: function() {
		var result = [], doms = $.Dom.queryAll('> .x-comp', this.el.dom);
		
		$.each(doms, function(dom) {
            result.push(dom.$comp);
        });

		return result;
	}

    /**
     * @method getNext
     * @return $.Component
     */
    ,getNext: function() {
        var el = this.el.getNext();
        if (el && el.dom.$comp) {
            return el.dom.$comp;
        }
    }

    /**
     * @method getPrev
     * @return $.Component
     */
    ,getPrev: function() {
        var el = this.el.getPrev();
        if (el && el.dom.$comp) {
            return el.dom.$comp;
        }
    }

    /**
     * @method empty
     * @return $.Component
     */
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

    /**
     * @method destroy
     */
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

/**
 * @static
 * @method get
 * @param String query
 * @return $.Component
 */
$.Component.get = function(query) {
	var el = $.Element.get(query);
	if (el.dom.$comp) {
		return el.dom.$comp;
	}
};