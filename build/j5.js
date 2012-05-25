/**
 * This is a class
 *
 * @class $
 */

var $ = function() {

};

/**
 * Returns true if the passed value is iterable, false otherwise
 *
 * @method isIterable
 * @param Object obj A javascript object to detect
 * @return Boolean
 */
$.isIterable = function(obj) {
    var iterators = [Array, NodeList, HTMLCollection];

    for (var i = 0; i < iterators.length; i ++) {
        if (obj instanceof iterators[i] || $.getType(obj) == $.getType(iterators[i])) {
            return true;
        }
    }

    if ($.getType(obj) == 'Arguments') {
        return true;
    }

    return false;
};

/**
 *
 * @method each
 * @param Object/Array/NodeList/HTMLCollection/Arguments obj
 * @param Function callback
 * @param Object scope
 * @return Mixed
 */
$.each = function(obj, callback, scope) {
    var result;
    if ($.isIterable(obj)) {
        for (var i = 0; i < obj.length; i ++) {
            if (false === (result = function() {
                if (undefined !== scope) {
                    return callback.call(scope, obj[i], i, obj);
                } else {
                    return callback(obj[i], i, obj);
                }
            }())) {
                return result;
            }
        }
    } else {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (false === (result = function(){
                    if (undefined !== scope) {
                        return callback.call(scope, obj[i], i, obj);
                    } else {
                        return callback(obj[i], i, obj);
                    }
                }())) {
                    return result;
                }
            }
        }
    }
    return result;
};

/**
 * @method extend
 * @param Object dest
 * @params Object... sources
 * @return Object
 */
$.extend = function(dest, source /*, *sources */) {
    if (arguments.length == 1) {
        return dest;
    }

    var sources = [].slice.call(arguments, 1);
    var recursive = sources.splice(sources.length - 1, 1)[0];

    if (recursive !== true) {
        sources.push(recursive);
        recursive = false;
    }

    $.each(sources, function(source) {
        source || (source = {});
        for (var i in source) {
            if (recursive && 'object' == typeof source[i] && source[i].constructor == Object.prototype.constructor) {
                dest[i] = $.extend(dest[i] || {}, source[i]);
            } else {
                if ('prototype' == i) {
                    continue;
                }

                if (source.hasOwnProperty(i)) {
                    dest[i] = source[i];
                    if ('function' == typeof dest[i]) {
                        dest[i].$name = i;
                    }
                }
            }
        }
    });
    return dest;
};

$.extend($, {
    /**
     * @property String version
     */
    version: '1.0'

    /**
     * @property Function emptyFn
     */
    ,emptyFn: function() {}

    /**
     * @method uniq
     * @return String
     */
    ,uniq: (function(){
        var counter, counters = {
            'default': 0
        }
        return function(prefix) {
            prefix || (prefix = '');
            (counter = prefix) || (counter = 'default');
            counters[counter] || (counters[counter] = 0);
            return prefix + counters[counter]++;
        }
    })()

    /**
     * @method getType
     * @param Object obj
     * @return Boolean
     */
    ,getType: function(obj) {
        return Object.prototype.toString.call(obj).match(/\[\w+\s(\w+)\]/)[1];
    }

    /**
     * @method namespace
     * @return Object
     */
    ,namespace: function() {
        var parts, tmp;

        return $.each(arguments, function(item) {
            tmp = window;
            parts = item.split('.');
            return $.each(parts, function(part) {
                tmp[part] || (tmp[part] = {});
                tmp = tmp[part];
                return tmp;
            });
        });
    }

    /**
     * @method getClass
     * @param String className
     * @return Object
     */
    ,getClass: function(className) {
        var result = true, tmp = window, parts = className.split('.');
        $.each(parts, function(part) {
            if (!tmp[part]) {
                result = false;
                return false;
            } else {
                tmp = tmp[part];
            }
        });

        if (result) {
            return tmp;
        }
    }

    /**
     * @method hasClass
     * @param String className
     * @return Boolean
     */
    ,hasClass: function(className) {
        return undefined !== this.getClass(className);
    }

    /**
     * @method define
     * @param String name
     * @param Object [prototype]
     * @return Function
     */
    ,define: function(name, prototype) {
        prototype || (prototype = {});
        var fn, parts = name.split('.')
            ,ctor = prototype.hasOwnProperty('constructor')? prototype.constructor : function() {};

        if (1 == parts.length) {
            fn = window[name] = ctor;
        } else {
            name = parts.pop();
            fn = $.namespace(parts.join('.'))[name] = ctor;
        }

        fn.prototype = prototype || {};
        return fn;
    }

    /**
     * @method defaults
     * @param Object obj
     * @param String|Object property
     * @param Mixed [value]
     * @return Object
     */
    ,defaults: function(obj, property, value) {
        if ('string' == typeof property) {
            if (undefined === obj[property]) {
                (value !== undefined) || (value = {});
                obj[property] = value;
            }
        } else {
            for (var i in property) {
                $.defaults(obj, i, property[i]);
            }
        }

        return obj;
    }

    /**
     * @method readOnlyObject
     * @param Object obj
     * @return Object
     */
    ,readOnlyObject: function(obj) {
        var _obj = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                Object.defineProperty(_obj, i, {
                    value: obj[i]
                    ,writable: false
                    ,enumerable: true
                })
            }
        }
        return obj;
    }

    /**
     * @method alias
     * @return $.Class
     */
    ,alias: (function() {
        var alias = {};

        return function(name, klass) {
            if (undefined == klass) {
                if (!alias[name]) {
                    throw new Error('Alias with name ' + name + ' doesn\'t exist');
                }
                return alias[name];
            }
            
            if (alias[name]) {
                throw new Error('Alias with name ' + name + ' already exist');
            }
            alias[name] = klass;
            return klass;
        };
    })()

    /**
     * @method ready
     */
    ,ready: (function() {
        var isReady = false, listeners = [], callback;
        document.addEventListener('DOMContentLoaded', callback = function() {
            $.each(listeners, function(item) {
                item.callback.call(item.scope);
            });
            document.removeEventListener('DOMContentLoaded', callback, false);
            isReady = true;
        }, false);

        return function(callback, scope) {
            if (isReady) {
                return callback.call(scope);
            }
            listeners.push({callback: callback, scope: scope});
        };
    })()
});

(function(){
    var ua = navigator.userAgent;
    var isWebkit = /webkit/i.test(ua)
        ,isChrome = /chrome/i.test(ua)
        ,isFirefox = /firefox/i.test(ua)
        ,isOpera = /opera/i.test(ua);

    $.extend($, {
        /**
         * @property Boolean isWebkit
         */
        isWebkit: isWebkit

        /**
         * @property Boolean isChrome
         */
        ,isChrome: isChrome

        /**
         * @property Boolean isFirefox
         */
        ,isFirefox: isFirefox

        /**
         * @property isOpera
         */
        ,isOpera: isOpera

        /**
         * @property String cssPrefix
         */
        ,cssPrefix: isWebkit? 'Webkit' : isFirefox? 'Moz' : 'O'

        /**
         * @method getCssProperty
         * @param String name
         * @param Node [dom]
         * @param camelize [default=true]
         * @return String
         */
        ,getCssProperty: function(name, dom, camelize) {
            if ('boolean' == typeof dom) {
                camelize = dom;
                dom = null;
            }

            dom || (dom = document.body);
            undefined !== camelize || (camelize = true);

            if (camelize) {
                name = $.String.camelize(name, true);
            }

            if (!(name in dom.style)) {
                name = $.getCssPrefix(!camelize) + (camelize? $.String.ucfirst(name, false) : name);
            }
            return name;
        }

        /**
         * @method getType
         * @param Object obj
         * @return String
         */
        ,getType: function(obj) {
            var type = Object.prototype.toString.call(obj);
            return type.match(/\[object\s+(\w+)\]/)[1];
        }

        /**
         * @method isNodeList
         * @param Object obj
         * @return Boolean
         */
        ,isNodeList: function(obj) {
            return 'NodeList' == this.getType(obj);
        }

        /**
         * @method getCssPrefix
         * @param Boolean dasherize
         * @return String
         */
        ,getCssPrefix: function(dasherize) {
            var prefix = $.cssPrefix;
            if (dasherize) {
                prefix = '-' + prefix.toLowerCase() + '-';
            }
            return prefix;
        }

        ,queryDecode: function( params, coerce ) {
            var obj = {},
                coerce_types = { 'true': !0, 'false': !1, 'null': null }
                decode = decodeURIComponent;

            // Iterate over all name=value pairs.
            $.each( params.replace( /\+/g, ' ' ).split( '&' ), function(v, j){
                var param = v.split( '=' ),
                    key = decode( param[0] ),
                    val,
                    cur = obj,
                    i = 0,

                // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
                // into its component parts.
                    keys = key.split( '][' ),
                    keys_last = keys.length - 1;

                // If the first keys part contains [ and the last ends with ], then []
                // are correctly balanced.
                if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
                    // Remove the trailing ] from the last keys part.
                    keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

                    // Split first keys part into two parts on the [ and add them back onto
                    // the beginning of the keys array.
                    keys = keys.shift().split('[').concat( keys );

                    keys_last = keys.length - 1;
                } else {
                    // Basic 'foo' style key.
                    keys_last = 0;
                }

                // Are we dealing with a name=value pair, or just a name?
                if ( param.length === 2 ) {
                    val = decode( param[1] );

                    // Coerce values.
                    if ( coerce ) {
                        val = val && !isNaN(val)            ? +val              // number
                            : val === 'undefined'             ? undefined         // undefined
                            : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                            : val;                                                // string
                    }

                    if ( keys_last ) {
                        // Complex key, build deep object structure based on a few rules:
                        // * The 'cur' pointer starts at the object top-level.
                        // * [] = array push (n is set to array length), [n] = array if n is
                        //   numeric, otherwise object.
                        // * If at the last keys part, set the value.
                        // * For each keys part, if the current level is undefined create an
                        //   object or array based on the type of the next keys part.
                        // * Move the 'cur' pointer to the next level.
                        // * Rinse & repeat.
                        for ( ; i <= keys_last; i++ ) {
                            key = keys[i] === '' ? cur.length : keys[i];
                            cur = cur[key] = i < keys_last
                                ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
                                : val;
                        }

                    } else {
                        // Simple key, even simpler rules, since only scalars and shallow
                        // arrays are allowed.

                        if ( obj[key] instanceof Array ) {
                            // val is already an array, so push on the next value.
                            obj[key].push( val );

                        } else if ( obj[key] !== undefined ) {
                            // val isn't an array, but since a second value has been specified,
                            // convert val into an array.
                            obj[key] = [ obj[key], val ];

                        } else {
                            // val is a scalar.
                            obj[key] = val;
                        }
                    }

                } else if ( key ) {
                    // No value was defined, so set something meaningful.
                    obj[key] = coerce
                        ? undefined
                        : '';
                }
            });

            return obj;
        }

        ,urlQueryDecode: function() {
            var query = location.search.replace(/^\?/, '');
            return $.queryDecode(query);
        }

        ,getUrlQueryParam: function(name) {
            return $.urlQueryDecode()[name];
        }
    });


})();
/**
 * @class $.String
 */

$.String = {
	escape: function(str) {
		if ('object' == typeof str) {
			str = str.toString();
		}
		
		if ('string' != typeof str) {
			return str;
		}
		
		var maps = {
			'&amp;': /&/g
			,'&lt;': /</g
			,'&gt;': />/g
			,'&quot;': /"/g
			,'&#x27;': /'/g
			,'&#x2F;': /\//g
		}
		str += '';
		for (var i in maps) {
			str = str.replace(maps[i], i);
		}
		return str;
	}

    ,escapeRegex: function(str) {
        return str.replace(/([-.*+?\^${}()|\[\]\/\\])/g, '\\$1');
    }

    ,stripSlashes: function(str) {
        return str.replace(/\\/g, '');
    }

	,ucfirst: function(str, lowerAll) {
		return str[0].toUpperCase() + (false !== lowerAll? str.substr(1).toLowerCase() : str.substr(1));
	}
	
	,camelize: function(str, lowerFirst) {
		var parts = str.split(/\s+|\-|_/);
		var result = '';
		for (var i = 0; i < parts.length; i ++) {
			result += $.String.ucfirst(parts[i], false);
		}
		if (lowerFirst) {
			result = result[0].toLowerCase() + result.substr(1);
		}
		return result;
	}
	
	,format: function(/*str, params...*/) {
		var params = arguments;
		var str = [].splice.call(params, 0, 1)[0];

        if ('object' == typeof params[0]) {
            params = params[0];
        }

		return str.replace(/{([\w_]+)}/g, function(m, m1) {
			return params[m1];
		});
	}

    ,trimLeft: function(str) {
        return str.replace(/^\s+/, '');
    }

    ,trimRight: function(str) {
        return str.replace(/\s+$/, '');
    }

    ,toInt: function(str) {
        return parseInt(str);
    }

    ,toFloat: function(str) {
        return parseFloat(str);
    }
}

$.each($.String, function(fn, name) {
    if (!String.prototype[name]) {
        String.prototype[name] = function() {
            var args = arguments;
            [].unshift.call(args, this);

            return fn.apply(this, args);
        }
    }
});
/**
 * @class $.Array
 */

(function() {
	var extend = {
		splice: function(array, index, count) {
			(undefined !== index) || (index = 0);
			(undefined !== count) || (count = 1);
			[].splice.call(array, index, count);
			return array;
		}
		,remove: function(/*array, value, ....*/) {
            var args = arguments
                ,array = [].shift.call(args)
                ,index;

            for (var i = 0; i < args.length; i++) {
                index = array.indexOf(args[i]);
                if (-1 == index) {
                    continue;
                }
                array.splice(index, 1);
            }

			return array;
		}
		,has: function(array, value) {
			return -1 != array.indexOf(value);
		}
		,uniq: function(array) {
			var result = [];
			$.each(array, function(item) {
				if (!$.Array.has(result, item)) {
					result.push(item);
				}
			});
			return result;
		}

        ,range: function(start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || (start < stop? 1 : -1);

            var len = Math.max(Math.ceil((stop - start) / step), 0)
                ,idx = 0
                ,range = [];

            while(idx < len) {
                range[idx++] = start;
                start += step;
            }

            return range;
        }

        ,last: function(array) {
            return array[array.length - 1];
        }
	};
	
	$.Array = function(array) {
		$.each(extend, function(fn, name) {
			array[name] = function() {
				array.unshift.call(arguments, array);
				return fn.apply(array, arguments);
			}
		});
		return array;
	}
	
	$.extend($.Array, extend);
	
})();
/**
 * @class $.Function
 */

$.Function = {
    defer: function(fn, miniseconds) {
        var id = setTimeout(function() {
            fn();
        }, miniseconds || 1);
        return {
            fn: fn
            ,id: id
            ,cancel: function() {
                clearTimeout(id);
                return fn;
            }
        }
    }

    ,createBuffered: function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    }
}
;
$.Class = function() {
}

/**
 * @class $.Class
 */
$.extend($.Class, {
    staticMethods: function() {
        var methods = [];
        for (i in this) {
            if ('function' == typeof this[i]) {
                methods.push(i);
            }
        }
        return methods;
    }

    ,methods: function() {
        var methods = [];
        for (var i in this.prototype) {
            if ('function' == typeof this.prototype[i]) {
                methods.push(i);
            }
        }
        return methods;
    }

    ,hasMethod: function(name) {
        return 'function' == typeof this.prototype[name];
    }

    ,addProperties: function(name, value) {
        if ('string' == typeof name) {
            if ('function' == typeof value) {
                value.$name = name;
                value.$class = this;
            }
            this.prototype[name] = value;
        } else {
            var methods = 'function' == typeof name? name.prototype : name;

            for (var i in methods) {
                this.addProperties(i, methods[i]);
            }
        }

        return this;
    }

    ,includes: function(modules) {
        this.$includes || (this.$includes = []);

        (modules instanceof Array) || (modules = [modules]);

        for (var i = 0; i < modules.length; i++) {
            this.addProperties(modules[i]);
            this.$includes.push(modules[i]);
        }
        return this;
    }


    ,extend: function(name, overrides) {
        if ('string' != typeof name) {
            overrides = name;
            name = undefined;
        }

        overrides || (overrides = {});
        var me = this;

        var klass = overrides.constructor && overrides.constructor !== Object.prototype.constructor?
                overrides.constructor : function() {
                    me.prototype.constructor.apply(this, arguments);
                };

        var ctor = function() {
            this.constructor = klass;
        };
        ctor.prototype = this.prototype;
        klass.prototype = new ctor;

        klass.$superclass = this;
        klass.$subclasses = [];
        klass.prototype.$class = klass;

        if (this.$subclasses) {
            this.$subclasses.push(klass);
        }

        // add statics method
        for (var i in this) {
            if (this.hasOwnProperty(i) && '$' != i[0]) {
                klass[i] = this[i];
            }
        }

        if (overrides.includes) {
            klass.includes(overrides.includes);
        }

        if (overrides.simpleSetters) {
            var simpleSetters = overrides.simpleSetters.replace(/\s/g, '').split(',')
                ,setters = {};

            $.each(simpleSetters, function(name) {
                setters['set' + name.ucfirst()] = function(value) {
                    this[name] = value;
                    return this;
                }
            });

            klass.addProperties(setters);
        }

        klass.addProperties(overrides);

        if (name) {
            var parts = name.split(' ');
            var originalName = name = parts[0];
            var alias = parts[1];

            var parts = name.split('.');
            if (1 == parts.length) {
                window[name] = klass;
            } else {
                name = parts.pop();
                $.namespace(parts.join('.'))[name] = klass;
            }

            klass.$className = originalName;
            klass.$classAliasName = alias;

            !alias || $.alias(alias, klass);
        }

        return klass;
    }
});

$.extend($.Class.prototype, {
    callSuper: function(methodName, args) {
        var parent;

        if ('string' != typeof methodName) {
            args = methodName;
            methodName = this.callSuper.caller.$name;
            parent = this.callSuper.caller.$class.$superclass;
        } else {
            parent = this.$class.$superclass;
        }

        return parent.prototype[methodName].apply(this, args || []);
    }

    ,applyOptions: function(options) {
        this.options || (this.options = {});
        options || (options = {});

        $.each(options, function(value, name) {
            var setter = 'set' + name[0].toUpperCase() + name.substr(1);

            if ('function' == typeof this[setter]) {
                this[setter](value);
            } else {
                this.options[name] = value;
            }
        }, this);
        return this;
    }

    ,initOptions: function(options) {
        options = $.extend({}, this.defaultOptions, options, true);
        this.applyOptions(options);
        return this;
    }

    ,createAlias: function(method) {
        return this[method].bind(this);
    }

    ,defer: function(method, miniseconds) {
        return $.Function.defer(this.createAlias(method), miniseconds);
    }
});


/**
 * @class $.Observable
 */

$.Class.extend('$.Observable', {
    constructor: function(options) {
        this.initOptions(options);
    }

    ,setListeners: function(listeners) {
        return this.on(listeners);
    }

    ,on: function(events, callback, scope, count) {
        if ('number' == typeof scope) {
            count = scope;
            scope = undefined;
        }

        this.listeners || (this.listeners = {});

        if ('object' == typeof events) {
            scope = callback;
            $.each(events, function(callback, event) {
                this.on(event, callback, scope, count);
            }, this);
        } else {
            events = events.split(/\s+/);
            $.each(events, function(event) {
                this.listeners[event] || (this.listeners[event] = []);
                this.listeners[event].push({
                    callback: callback
                    ,scope: undefined !== scope? scope : this
                    ,count: count || -1
                });
            }, this);
        }

        return this;
    }
    ,un: function(events, callback, scope) {
        if (!this.listeners) {
            return this;
        }

        undefined !== scope || (scope = this);

        events = events.split(/\s+/);
        $.each(events, function(event) {
            if (!this.listeners[event]) {
                return;
            }
            if (!callback) {
                this.listeners[event] = [];
                return;
            }

            $.each(this.listeners[event], function(item, index, items) {
                if (item.callback === callback && item.scope === scope) {
                    items.splice(index);
                }
            });
        }, this);

        return this;
    }
    ,trigger: function(/*events, args...*/) {
        if (!this.listeners) {
            return this;
        }

        var args = arguments;
        var events = [].splice.call(args, 0, 1)[0].split(/\s+/);
        return $.each(events, function(event) {
            if (!this.listeners[event]) {
                return;
            }

            return $.each(this.listeners[event], function(item, index, items) {
                var result = item.callback.apply(item.scope, args);
                item.count--;

                if (item.count == 0) {
                    this.un(event, item.callback, item.scope);
                }

                return result;
            }, this);
        }, this);
    }
});


/**
 * @class $.Ajax
 * @superclass $.Observable
 */

$.Observable.extend('$.Ajax', {
    /**
     * @property Object defaultOptions
     */
    defaultOptions: $.readOnlyObject({
        url: ''
        ,method: 'GET'
        ,async: true
        ,disableCacheParamName: '_' + (new Date).getTime()
        ,headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    /**
     * @property Function start
     */
    ,start: $.emptyFn

    /**
     * @property Function complete
     */
    ,complete: $.emptyFn

    /**
     * @property Function success
     */
    ,success: $.emptyFn

    /**
     * @property Function exception
     */
    ,exception: $.emptyFn

    /**
     * @private
     * @property String simpleSetters
     */
    ,simpleSetters: 'params, start, complete, success, exception'

    /**
     * @method getXhr
     * @return XMLHttpRequest
     */
    ,getXhr: function() {
		if (!this._xhr) {
			this._xhr = new XMLHttpRequest();
			var me = this;

			this._xhr.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					me.complete(this, me);
					me.trigger('complete', this, me);
					var status = this.status;
					if ((status >= 200 && status < 300) || status == 304) {
						me.success(this.responseText, this, me);
						me.trigger('success', this.responseText, this, me);
					} else {
						me.exception(this, me);
						me.trigger('exception', this, me);
					}
				}
			}
		}
		return this._xhr;
	}

    /**
     * @method setHeaders
     * @param String|Object name
     * @param String [value]
     * @return $.Ajax
     */
	,setHeaders: function(name, value) {
		this.headers || (this.headers = {});
		if (undefined === value) {
			for (var i in name) {
				this.setHeaders(i, name[i]);
			}
		} else {
			this.headers[name] = value;
		}
		return this;
	}

    /**
     * @method abort
     * @return $.Ajax
     */
	,abort: function() {
		this.getXhr().abort();
        return this;
	}

    /**
     * @method send
     * @param Object [options]
     * @return $.Ajax
     */
	,send: function(options) {
        if (options) {
            this.applyOptions(options);
        }

        var xhr = this.getXhr();

        if (this.trigger('start', xhr, this) === false || this.start(xhr, this) === false) {
            return this;
        }

        var data = this.rawData || this.xmlData || null
        if (this.jsonData) {
            data = JSON.stringify(this.jsonData);
        }

        if (this.form) {
            data = new FormData(this.form);
        }

        if (undefined == this.headers['Content-Type'] && (this.options.method == 'POST' || this.options.method == 'PUT')) {
            var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (this.rawData) {
                contentType = 'text/plain';
            } else if (this.xmlData) {
                contentType = 'text/xml';
            } else if (this.jsonData) {
                contentType = 'application/json';
            }

            this.setHeaders('Content-Type', contentType);
        }

        var url = this.options.url;
        if (this.options.method == 'GET' || this.options.method == 'HEAD') {
            if (this.options.disableCacheParamName) {
                this.params || (this.params = {});
                this.params[this.options.disableCacheParamName] = (new Date).getTime();
            }
            if (this.params) {
                url = $.Util.buildUrl(this.params, url);
            }
        }

        xhr.open(this.options.method, url, this.options.async);

        for (var i in this.headers) {
            xhr.setRequestHeader(i, this.headers[i]);
        }

        xhr.send(data);
        return this;
	}
});
/**
 * @class $.Elements
 */

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


/**
 * @class $.Animation
 * @superclass $.Observable
 */

$.Observable.extend('$.Animation', {
    /**
     * @property Int delay
     * @default 0
     */
    delay: 0

    /**
     * @property String direction
     * @default normal
     */
    ,direction: 'normal'// [ normal | reverse | alternate | alternate-reverse ] [, [ normal | reverse | alternate | alternate-reverse ] ]*

    /**
     * @property Int duration
     * @default 1
     */
    ,duration: 1

    /**
     * @property String fillMode
     * @default 'forwards'
     */
    ,fillMode: 'forwards' // [ none | forwards | backwards | both ] [, [ none | forwards | backwards | both ] ]*

    /**
     * @property Int iterationCount
     * @default 1
     */
    ,iterationCount: 1 // [ infinite | <number> ] [, [ infinite | <number> ] ]*

    /**
     * @property String playState
     * @default running
     */
    ,playState: 'running' // [ running | paused ] [, [ running | paused ] ]*

    /**
     * @property String timingFunction
     * @default ease
     */
    ,timingFunction: 'ease' // [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>) ] [, [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>)] ]*

    /**
     * @property Function onIteration
     * @default $.emptyFn
     */
    ,onIteration: $.emptyFn

    /**
     * @property Function onEnd
     * @default $.emptyFn
     */
    ,onEnd: $.emptyFn

    /**
     * @property Object keyframe
     * @default null
     */
    ,keyframe: null

    /**
     * @property Boolean concurrent
     * @default true
     */
    ,concurrent: true

    /**
     * @private
     * @property String simpleSetter
     */
    ,simpleSetters: 'delay, direction, duration, fillMode, iterationCount, playState, timingFunction, keyframe, concurrent'

    /**
     * @method constructor
     * @param String|Element|$.Element el
     * @param Object [options]
     */
    ,constructor: function(el, options) {
        this.el = $.Element.get(el);

        this.queue || (this.queue = []);

        this.buffered = $.Function.createBuffered(this.playQueue);
        this.el.on('animationend', function() {
            this.playQueue();
        }, this);

        this.callSuper(options);
    }

    /**
     * @method play
     * @param Object [options]
     * @return $.Animation
     */
    ,play: function(options) {
        var property = '{name} {duration} {timingFunction} {delay} {iterationCount} {direction} {fillMode}'
            ,name
            ,animation
            ,currentProperty;

        if (this.concurrent) {
            this.applyOptions(options);

            name = $.uniq('x-keyframe');
            var keyframes = '@' + $.getCssPrefix(true) + 'keyframes ' + name + '{\n'
                ,step;

            $.each(this.keyframe, function(properties, percentage) {
                if ('function' == typeof properties) {
                    properties = properties();
                }

                step = percentage + '% {\n';

                $.each(properties, function(value, property) {
                    if ('function' == typeof value) {
                        value = value();
                    }
                    property = $.getCssProperty(property, false);
                    step += (property + ':' + value + ';\n');
                });
                step += '}';
                keyframes += step + '\n';
            });

            keyframes += '}';

            $.Element.get('head').append({
                dom: '<style>'
                ,attr: {
                    type: 'text/css'
                }
                ,html: keyframes
            });

            animation = $.String.format(property, {
                name: name
                ,duration: this.duration + 's'
                ,timingFunction: this.timingFunction
                ,delay: this.delay + 's'
                ,iterationCount: this.iterationCount
                ,direction: this.direction
                ,fillMode: this.fillMode
            });

            currentProperty = this.el.getStyle('animation');
            !currentProperty || (animation = currentProperty + ', ' + animation);
            this.el.setStyles('animation', animation);
        } else {
            this.queue.push(options);
            this.buffered();
        }

        return this;
    }

    /**
     * @private
     * @method playQueue
     * @return $.Animation
     */
    ,playQueue: function() {
        if (!this.queue || !this.queue.length) {
            return this;
        }
        this.concurrent = true;

        var item = this.queue.shift();

        this.play(item);
        return this;
    }

    /**
     * @method fade
     * @param Object [options]
     * @param Number [opacity]
     * @return $.Animation
     */
    ,fade: function(options, opacity) {
        var currentOpacity = parseFloat(this.el.getStyle('opacity'));
        return this[currentOpacity == 1? 'fadeOut' : 'fadeIn'](options, opacity);
    }

    /**
     * @method fadeInt
     * @param Object [options]
     */
    ,fadeIn: function(options) {
        options || (options = {});

        options.keyframe = {
            0: {
                opacity: 0
            }
            ,100: {
                opacity: 1
            }
        }

        return this.play(options);
    }

    /**
     * @method fadeOut
     * @param Object [options]
     * @return $.Animation
     */
    ,fadeOut: function(options) {
        options || (options = {});

        options.keyframe = {
            0: {
                opacity: 1
            }
            ,100: {
                opacity: 0
            }
        }

        return this.play(options);
    }

    /**
     * @method moveTo
     * @param Number x
     * @param Number [y]
     * @param Object [options]
     * @return $.Animation
     */
    ,moveTo: function(x, y, options) {
        if ('number' !== typeof y) {
            options = y;
            y = x;
        }

        options || (options = {});

        options.keyframe = {
            0: function() {
                return {
                    top: this.el.getOffset().y + 'px'
                    ,left: this.el.getOffset().x + 'px'
                }
            }
            ,100: {
                top: y + 'px'
                ,left: x + 'px'
            }
        };
        return this.play(options);
    }

    /**
     * @method moveToX
     * @param Number x
     * @param Object [options]
     * @return $.Animation
     */
    ,moveToX: function(x, options) {
        options || (options = {});

        options.keyframe = {
            0: {
                left: this.el.getLeft() + 'px'
            }
            ,100: {
                left: x + 'px'
            }
        };
        return this.play(options);
    }

    /**
     * @method moveToY
     * @param Number y
     * @param Object [options]
     * @return $.Animation
     */
    ,moveToY: function(y, options) {
        options || (options = {});

        options.keyframe = {
            0: {
                top: this.el.getTop() + 'px'
            }
            ,100: {
                top: y + 'px'
            }
        };
        return this.play(options);
    }

    /**
     * @method slideUp
     * @param Object [options]
     * @return $.Animation
     */
    ,slideUp: function(options) {
        if (this._originalBeforeFx) {
            return this;
        }

        options || (options = {});

        options.keyframe = {
            100: {
                height: 0
            }
        }

        this._originalBeforeFx = {
            height: this.el.getHeight()
            ,heightStyle: this.el.getStyle('height')
        };

        return this.play(options);
    }

    /**
     * @method slideDown
     * @param Object [options]
     * @return $.Animation
     */
    ,slideDown: function(options) {
        if (!this._originalBeforeFx) {
            return this;
        }
        options || (options = {});

        options.keyframe = {
            0: {
                height: 0
            }
            ,100: {
                height: this._originalBeforeFx.height + 'px'
            }
        }

        this._originalBeforeFx = null;

        return this.play(options);
    }

    /**
     * @method slide
     * @param Object [options]
     * @return $.Animation
     */
    ,slide: function(options) {
        return this[this._originalBeforeFx? 'slideDown' : 'slideUp'](options);
    }

    /**
     * @method rotate
     * @param Object [options]
     * @param String [property]
     * @return $.Animation
     */
    ,rotate: function(options, property) {
        options || (options = {});
        property || (property = 'rotateY(180deg)');

        options.keyframe = {
            100: {
                transform: property
            }
        };
        return this.play(options);
    }
});




/**
 * @class $.Element
 */

$.Observable.extend('$.Element element', {
    constructor: function(options) {
        options || (options = {});

        var dom;

        if ('string' == typeof options || $.Dom.is(options)) {
            dom = options;
            options = {};
        } else {
            dom = options.dom || '<div>';
        }

        if ('string' == typeof dom) {
            var match = dom.match(/<(\w+)>/);
            if (match) {
                dom = $.Dom.create(match[1]);
            } else {
                var query = dom;
                dom = $.Dom.query(query);
                if (!dom) {
                    throw new Error($.String.format('Dom element with query "{0}" not found', query));
                }
            }
        }

        this.dom = dom;
        dom.$el = this;

        this.callSuper([options]);
    }

    ,on: function(events) {
        this.callSuper(arguments);

        var eventNames = [];
        if ('string' == typeof events) {
            eventNames = events.split(/\s+/);
        } else {
            eventNames = Object.keys(events);
        }

        var callback, _eventName;
        this._hasFallbackListeners || (this._hasFallbackListeners = {});
        $.each(eventNames, function(eventName) {
            _eventName = $.Element.events[eventName];
            if (!_eventName || this._hasFallbackListeners[eventName]) {
                return;
            }

            callback = function(e) {
                this.trigger(eventName, new $.Event(e), this);
            }.bind(this);

            this.dom.addEventListener(_eventName, callback, false);
            this._hasFallbackListeners[eventName] = callback;
        }, this);

        return this;
    }

    ,un: function(events) {
        this.callSuper(arguments);

        if (!this._hasFallbackListeners) {
            return this;
        }

        var eventNames = [];
        if ('string' == typeof events) {
            eventNames = events.split(/\s+/);
        } else {
            eventNames = Object.keys(events);
        }

        var _eventName;

        $.each(eventNames, function(eventName) {
            _eventName = $.Element.events[eventName];
            if (!_eventName || !this._hasFallbackListeners[eventName]) {
                return;
            }

            if (!this.listeners[eventName].length) {
                this.dom.removeEventListener(_eventName, this._hasFallbackListeners[eventName], false);
                this._hasFallbackListeners[eventName] = null;
            }
        }, this);

        return this;
    }

    ,setAttr: function(name, value) {
        if ('string' != typeof name) {
            $.each(name, function(v, k) {
                this.setAttr(k, v);
            }, this);
        } else {
            this.dom.setAttribute(name, value);
        }
        return this;
    }

    ,getAttr: function(name) {
        return this.dom.getAttribute(name);
    }

    ,removeAttr: function(name) {
        this.dom.removeAttribute(name);
        return this;
    }

    ,toggleAttr: function(name) {
        if (this.dom.hasAttribute(name)) {
            return this.removeAttr(name);
        }
        return this.addAttr(name, value !== undefined? value : true);
    }

    ,switchAttr: function(bool, name, value) {
        (undefined !== value) || (value = true);
        return this[bool? 'setAttr' : 'removeAttr'](name, value);
    }

    ,setFocusable: function(bool) {
        this.setAttr('tabindex', bool? 0 : -1);
    }

    ,isFocused: function() {
        return document.activeElement == this.dom;
    }

    ,focus: function() {
        if (!this.isFocused()) {
            this.dom.focus();
        }
        return this;
    }

    ,blur: function() {
        if (this.isFocused()) {
            this.dom.blur();
        }
        return this;
    }

    ,select: function() {
        this.dom.select();
        return this;
    }

    ,setId: function(id) {
        this.dom.id = id;
        return this;
    }

    ,setData: function(name, value) {
        if ('object' == typeof name) {
            $.each(name, function(v, n) {
                this.setData(n, v);
            }, this);
        } else {
            this.dom.dataset[name] = value;
        }
        return this;
    }

    ,getData: function(name) {
        return this.dom.dataset[name];
    }

    ,setName: function(name) {
        this.setAttr('name', name);
        this.setData('name', name);
        return this;
    }

    ,getName: function() {
        var name = this.getAttr('name');
        if (!name) {
            name = this.getData(name);
        }
        return name;
    }

    ,setValue: function(value) {
        this.dom.value = value;
        this.setAttr('value', value);
        this.setData('value', value);
        return this;
    }

    ,getValue: function() {
        return this.dom.value || this.getAttr('value') || this.getData('value');
    }

    ,setClasses: function(classes) {
        this.setAttr('class', '');
        return this.addClasses(classes);
    }

    ,getClasses: function() {
        return this.dom.classList;
    }

    ,hasClasses: function(classes) {
        classes = classes.trim().split(/\s+/);
        var has = true, classList = this.getClasses();
        $.each(classes, function(item) {
            if (!classList.contains(item)) {
                has = false;
                return false;
            }
        });
        return has;
    }

    ,addClasses: function(classes) {
        classes = (this.getAttr('class') || '') + ' ' + classes;
        classes = classes.trim();
        classes = classes.split(/\s+/g);
        classes = $.Array(classes).uniq().join(' ');
        return this.setAttr('class', classes);
    }

    ,removeClasses: function(classes) {
        var classList = this.getClasses();
        if (!classList.length) {
            return this;
        }

        if ('string' == typeof classes) {
            classes = classes.split(/\s+/);

            $.each(classes, function(item) {
                classList.remove(item)
            });
        } else if (classes instanceof RegExp) {
            $.each(classList, function(item) {
                if (classes.test(item)) {
                    classList.remove(item);
                }
            });
        }

        return this;
    }

    ,toggleClasses: function(classes) {
        var classList = this.getClasses();
        if (!classList.length) {
            return this;
        }

        classes = classes.split(/\s+/);

        $.each(classes, function(item) {
            classList.toggle(item)
        });

        return this;
    }

    ,switchClasses: function(bool, classes) {
        if (bool) {
            return this.addClasses(classes);
        }
        return this.removeClasses(classes);
    }

    ,radioClasses: function(classes) {
        this.getParent().children().removeClasses(classes);
        return this.addClasses(classes);
    }

    ,deRadioClasses: function(classes) {
        this.getParent().children().addClasses(classes);
        return this.removeClasses(classes);
    }

    ,setClickRadioClasses: function(classes) {
        this.on('click', function() {
            this.radioClasses(classes);
        });
        return this;
    }

    ,setStyles: function(name, value) {
        if ('string' != typeof name) {
            $.each(name, function(v, k) {
                this.setStyles(k, v);
            }, this);
        } else {
            name = $.getCssProperty(name);
            this.dom.style[name] = value;
        }

        return this;
    }

    ,getStyle: function(name) {
        name = $.getCssProperty(name);
        var result = this.dom.style[name];

        if (!result) {
            result = window.getComputedStyle(this.dom, null).getPropertyValue(name);
        }
        return result;
    }

    ,removeStyles: function() {
        var name;

        for (var i = 0; i < arguments.length; i ++) {
            name = $.getCssProperty(arguments[i], false);
            this.dom.style.removeProperty(name);
        }

        return this;
    }

    ,setWidth: function(width) {
        if ('number' == typeof width) {
            width += 'px';
        }
        return this.setStyles('width', width);
    }

    ,getWidth: function() {
        return this.dom.offsetWidth;
    }

    ,setHeight: function(height) {
        if ('number' == typeof height) {
            height += 'px';
        }
        return this.setStyles('height', height);
    }

    ,getHeight: function() {
        return this.dom.offsetHeight;
    }

    ,setSize: function(width, height) {
        ('undefined' == height) || (height = width);
        return this.setWidth(width).setHeight(height);
    }

    ,getOffsetParent: function() {
        return this.dom.offsetParent;
    }

    ,setTop: function(top) {
        if ('number' == typeof top) {
            top += 'px';
        }
        return this.setStyles('top', top);
    }

    ,getTop: function() {
        return this.dom.offsetTop;
    }

    ,setRight: function(right) {
        if ('number' == typeof right) {
            right += 'px';
        }
        return this.setStyles('right', right);
    }

    ,getRight: function() {
        var right = this.getStyle('right');
        right = parseInt(right);
        return isNaN(right)? undefined : right;
    }

    ,setLeft: function(left) {
        if ('number' == typeof left) {
            left += 'px';
        }
        return this.setStyles('left', left);
    }

    ,getLeft: function(left) {
        return this.dom.offsetLeft;
    }

    /*,getOffset: function() {
        var offset, x = this.dom.offsetLeft, y = this.dom.offsetTop;
        if (offset = this.dom.offsetParent) {
            do {
                x += offset.offsetLeft;
                y += offset.offsetTop;
            } while (offset = offset.offsetParent);
        }
        return {
            x: x
            ,y: y
        };
    }
    */
    ,getOffset: function() {
        return {
            x: this.dom.offsetLeft
            ,y: this.dom.offsetTop
        }
    }

    ,getPageXY: function() {
        var xy = this.getOffset()
            ,offsetParent;

        if (offsetParent = this.dom.offsetParent) {
            do {
                xy.x += offsetParent.offsetLeft;
                xy.y += offsetParent.offsetTop;
            } while (offsetParent = offsetParent.offsetParent);
        }
        return xy;
    }

    ,setParent: function(parent) {
        parent = $.Element.get(parent);
        parent.append(this);
        return parent;
    }

    ,getParent: function() {
        return $.Element.get(this.dom.parentElement);
    }

    ,count: function() {
        return this.dom.childElementCount;
    }

    ,index: function() {
        return [].indexOf.call(this.dom.parentElement.children, this.dom);
    }

    ,first: function(query, uniq) {
        return this.at(0, query, uniq);
    }

    ,last: function(query, uniq) {
        return this.at(this.count() - 1, query, uniq);
    }

    ,at: function(at, query, uniq) {
        query = '>' + (query || '*') + ':nth-child(' + (at + 1) + ')';

        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom, this, uniq);
        }
    }

    ,append: function(els) {
        if (els instanceof Array) {
            return $.each(els, function(el) {
                return this.append(el);
            }, this);
        } else {
            els = $.Element.get(els);
            this.dom.appendChild(els.dom);
            this.trigger('append', els);
            return els;
        }
    }

    ,insert: function(at, el) {
        var atDom = this.dom.children[at];
        if (atDom) {
            el = $.Element.get(el);
            this.dom.insertBefore(el.dom, atDom);
            return el;
        } else {
            return this.append(el);
        }
    }

    ,insertBefore: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom);
        return this;
    }

    ,insertAfter: function(el) {
        el = $.Element.get(el);
        el.dom.parentElement.insertBefore(this.dom, el.dom.nextElementSibling);
        return this;
    }

    ,getNext: function() {
        var dom = this.dom.nextElementSibling;
        if (dom) {
            return $.Element.get(dom);
        }
    }

    ,getPrev: function(uniq) {
        var dom = this.dom.previousElementSibling;
        if (dom) {
            return $.Element.get(dom, this, uniq);
        }
    }

    ,children: function() {
        var els = new $.Elements(this.dom.children);
        return els;
    }

    ,onRender: function(callback) {
        if (this.isRendered()) {
            callback();
        }

        this.on('render', function() {
            callback();
        })
    }

    ,appendTo: function(el) {
        el = $.Element.get(el);
        el.append(this);

        this.trigger('render');
        return el;
    }

    ,wrap: function(el) {
        el || (el = '<div>');
        el = $.Element.get(el);

        this.dom.$wrapEl = el;

        if (this.isRendered()) {
            el.insertBefore(this);
        }
        el.append(this);
        return el;
    }

    ,unwrap: function() {
        if (this.dom.$wrapEl) {
            this.before(this.dom.$wrapEl);
            this.dom.$wrapEl.destroy();
            delete this.dom.$wrapEl;
        }
        return this;
    }

    ,setHtml: function(html) {
        this.dom.innerHTML = html;
        this.trigger('change change:html', this);
        return this;
    }

    ,getHtml: function() {
        return this.dom.innerHTML;
    }

    ,query: function(query) {
        var dom = $.Dom.query(query, this.dom);
        if (dom) {
            return $.Element.get(dom);
        }
    }

    ,queryAll: function(query) {
        var doms = $.Dom.queryAll(query, this.dom);
        if (doms) {
            return new $.Elements(doms);
        }
    }

    ,contains: function(el) {
        return this.dom.contains(el.dom);
    }

    ,findAncestor: function(query) {
        query = '> ' + query;

        var ancestor = this.dom.parentElement, result, matches, dom = this.dom;

        while(true) {
            ancestor = ancestor.parentElement;
            if (!ancestor) {
                return;
            }
            matches = $.Dom.queryAll(query, ancestor);

            $.each(matches, function(item) {
                if (item.contains(dom) && item.$el) {
                    result = item.$el;
                    return false;
                }
            });

            if (result) {
                return result;
            }
        }
    }

    ,isVisible: function() {
        return !('none' == this.getStyle('display') || this.hasClasses('x-hidden'));
    }

    ,hide: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = $.Function.defer(this.hide.bind(this), true === defer? 1 : defer);
            return this;
        }

        if (this.hasClasses('x-hidden')) {
            return this;
        }

        this.trigger('hide');
        this.addClasses('x-hidden');
        return this;
    }

    ,show: function(defer) {
        !this._showHideDefer || (this._showHideDefer.cancel());

        if (defer) {
            this._showHideDefer = $.Function.defer(this.show.bind(this), true === defer? 1 : defer);
            return this;
        }

        if (!this.hasClasses('x-hidden')) {
            return this;
        }

        this.removeClasses('x-hidden');
        this.trigger('show');
        return this;
    }

    ,setHidden: function(bool, defer) {
        return this[bool? 'show' : 'hide'](defer);
    }

    ,toggleDisplay: function(defer) {
        return this.setHidden(!this.isVisible(), defer);
    }

    ,collapse: function(size, side) {
        return this.addClasses('x-collapsed');
    }

    ,expand: function() {
        return this.removeClasses('x-collapsed');
    }

    ,setCollapsed: function(bool) {
        return this[bool? 'collapse' : 'expand']();
    }

    ,toggleCollapse: function() {
        this.toggleClasses('x-collapsed');
    }

    ,mask: function(html) {
        html || (html = '');
        if (!this._maskEl) {
            this._maskEl = this.insert(0, {
                classes: 'x-mask'
                ,width: this.getWidth()
                ,height: this.getHeight()
            });
            this._maskEl.insertBefore(this);
            this._maskEl._messageWrapEl = this._maskEl.insert(0, {
                dom: '<div>'
                ,classes: 'x-mask-message-wrap'
            });

            this._maskEl._messageEl = this._maskEl._messageWrapEl.append({
                dom: '<div>'
                ,classes: 'x-mask-message'
            });
        }

        html? this._maskEl._messageEl.show() : this._maskEl._messageEl.hide();

        if (html instanceof $.Element) {
            this._maskEl._messageEl.append(html);
        } else if (html instanceof $.Component) {
            this._maskEl._messageEl.append(html.el);
        } else {
            this._maskEl._messageEl.setHtml(html);
        }

        return this._maskEl;
    }

    ,unmask: function() {
        if (this._maskEl) {
            this._maskEl.destroy();
            delete this._maskEl;
        }
        return this;
    }

    ,setDraggable: function(options) {
        if (!this.drag) {
            this.drag = new $.Drag(this);
        }
        this.drag.applyOptions(options);
    }

    ,setKeyListener: function(options) {
        if (!this.keyListener) {
            this.keyListener = new $.KeyListener(this, options);
        }
        return this;
    }

    ,setDefaults: function(options) {
        this.on('append', function(el) {
            if (el instanceof $.field.Field) {
                el.applyOptions(options);
            }
        });
        return this;
    }

    ,clone: function(deep) {
        var dom = this.dom.cloneNode(!!deep);
        var el = new $.Element(dom);
        el.removeAttr('id');

        $.each(this, function(v, k) {
            if (k != 'dom') {
                el[k] = v;
            }
        });

        return el;
    }

    ,isRendered: function() {
        return document.body.contains(this.dom);
    }

    ,fx: function(options) {
        if (!this._animation) {
            this._animation = new $.Animation(this);
        }
        this._animation.applyOptions(options);
        return this._animation;
    }

    ,empty: function() {
        this.setHtml('');
    }

    ,destroy: function() {
        this.dom.parentNode.removeChild(this.dom);
    }
});

$.extend($.Element, {
    getDom: function(el) {
        if (el instanceof $.Element) {
            return el.dom;
        }

        if ($.Dom.is(el)) {
            return el;
        }
    }

    ,get: function(obj, root) {
        if (obj instanceof $.Element) {
            return obj;
        }

        if ('string' == typeof obj && !/<(\w+)>/.test(obj)) {
            var query = obj;
            obj = $.Dom.query(query, root && root.dom? root.dom : root);
            if (!obj) {
                throw new Error('Dom with query "' + query + '" not found');
            }
        }

        if ($.Dom.is(obj) && obj.$el) {
            return obj.$el;
        }

        return new $.Element(obj);
    }

    ,events: $.readOnlyObject({
        DOMActivate: 'DOMActivate',
        load: 'load',
        unload: 'unload',
        abort: 'abort',
        error: 'error',
        select: 'select',
        resize: 'resize',
        scroll: 'scroll',

        // Focus Event Types
        blur: 'blur',
        DOMFocusIn: 'DOMFocusIn',
        DOMFocusOut: 'DOMFocusOut',
        focus: 'focus',
        focusin: 'focusin',
        focusout: 'focusout',

        // Mouse Event Types
        click: 'click',
        dblclick: 'dblclick',
        mousedown: 'mousedown',
        mouseenter: 'mouseenter',
        mouseleave: 'mouseleave',
        mousemove: 'mousemove',
        mouseover: 'mouseover',
        mouseout: 'mouseout',
        mouseup: 'mouseup',

        // Wheel Event Types
        wheel: 'wheel',

        //Text Event Types
        textinput: 'textinput',

        // Keyboard Event Types
        keydown: 'keydown',
        keypress: 'keypress',
        keyup: 'keyup',

        // Composition Event Types
        compositionstart: 'compositionstart',
        compositionupdate: 'compositionupdate',
        compositionend: 'compositionend',

        // Mutation Events
        DOMAttrModified: 'DOMAttrModified',
        DOMCharacterDataModified: 'DOMCharacterDataModified',
        DOMNodeInserted: 'DOMNodeInserted',
        DOMNodeInsertedIntoDocument: 'DOMNodeInsertedIntoDocument',
        DOMNodeRemoved: 'DOMNodeRemoved',
        DOMNodeRemovedFromDocument: 'DOMNodeRemovedFromDocument',
        DOMSubtreeModified: 'DOMSubtreeModified',

        // Mutation Name Event Types
        DOMAttributeNameChanged: 'DOMAttributeNameChanged',
        DOMElementNameChanged: 'DOMElementNameChanged',

        // Drag & Drop
        dragstart: 'dragstart',
        drag: 'drag',
        dragenter: 'dragenter',
        dragleave: 'dragleave',
        dragover: 'dragover',
        drop: 'drop',
        dragend: 'dragend',

        // Animation
        animationstart: $.isWebkit? 'webkitAnimationStart': $.isOpera? 'oAnimationStart' : 'animationstart',
        animationend: $.isWebkit? 'webkitAnimationEnd': $.isOpera? 'oAnimationEnd' : 'animationend',
        animationiteration: $.isWebkit? 'webkitAnimationIteration': $.isOpera? 'oAnimationIteration' : 'animationiteration'
    })
});



/**
 * Base class for all Ext components. All subclasses of Component may participate in the automated Ext component
 * lifecycle of creation, rendering and destruction which is provided by the {@link Ext.container.Container Container}
 * class. Components may be added to a Container through the {@link Ext.container.Container#cfg-items items} config option
 * at the time the Container is created, or they may be added dynamically via the
 * {@link Ext.container.Container#method-add add} method.
 *
 * The Component base class has built-in support for basic hide/show and enable/disable and size control behavior.
 *
 * All Components are registered with the {@link Ext.ComponentManager} on construction so that they can be referenced at
 * any time via {@link Ext#getCmp Ext.getCmp}, passing the {@link #id}.
 *
 * All user-developed visual widgets that are required to participate in automated lifecycle and size management should
 * subclass Component.
 *
 * See the Creating new UI controls chapter in [Component Guide][1] for details on how and to either extend
 * or augment Ext JS base classes to create custom Components.
 *
 * Every component has a specific xtype, which is its Ext-specific type name, along with methods for checking the xtype
 * like {@link #getXType} and {@link #isXType}. See the [Component Guide][1] for more information on xtypes and the
 * Component hierarchy.
 *
 * @class $.Component
 */

$.Observable.extend('$.Component component', {
	tag: 'div'
	,baseClasses: 'x-comp'
	,defaultChildType: 'component'
	
	,fallbackFunctions: 'setWidth, getWidth, setHeight, getHeight, getLeft, setLeft, getTop, setTop, getRight, setRight, getAttr, setAttr, setStyles, getStyle, setHtml, addClasses, getClasses, hasClasses, removeClasses, toggleClasses, switchClasses, radioClasses, deRadioClasses, setClickRadioClasses, show, hide, collapse, expand, isRendered, setData, getData, setName, getName, setValue, getValue, index'

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
        if (options instanceof $.Element) {
            this.el = options;
        } else {
            this.el.applyOptions(options);
        }
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

    ,set$data: function(data) {
        this.$data = data;
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


/**
 * @class $.Alert
 * @superclass $.Component
 */

$.Component.extend('$.Alert alert', {
    /**
     * @private
     * @property String baseClasses
     */
    baseClasses: 'x-alert'

    /**
     * @private
     * @method initElement
     * @return $.Alert
     */
    ,initElement: function() {
        this.callSuper();

        this.closeEl = this.el.append({
            dom: '<a>'
            ,classes: 'x-close'
            ,html: '+'
            ,listeners: {
                click: function() {
                    this.hide();
                }.bind(this)
            }
        });

        this.contentEl = this.el.append({
            classes: 'x-content'
        });

        return this;
    }

    /**
     * @method setHtml
     * @param String html
     * @return $.Alert
     */
    ,setHtml: function(html) {
        this.contentEl.setHtml(html);
        return this;
    }

    /**
     * @method setType
     * @param String type
     * @return $.Alert
     */
    ,setType: function(type) {
        this.addClasses('x-' + type);
        return this;
    }
});


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



/**
 * @class $.App
 */

$.Observable.extend('$.App', {
	path: '/assets/app'
	,defaultController: 'index'
	,defaultAction: 'index'
	,actionPrefix: 'Action'
	,namespace: 'App'
	
	,run: function(options) {
		$.extend(this, options);
		$.Loader.addPath(this.namespace, this.path);
		
		$.each(['models', 'collections', 'controllers', 'views', 'plugins'], function(item) {
			$.namespace($.String.format('{0}.{1}', this.namespace, item));
		}, this);
		
		$.Navigator.on('change', function(path) {
			this.dispatch(path);
		}, this);
		
		$.ready(function() {
			this.ready();
			this.dispatch(history.pushState? window.location.pathname : window.location.hash.replace(/^#/, ''));
		}, this);
	}
	
	,ready: $.emptyFn
	
	,dispatch: function(path) {
		var matches, controller, action, id;
		if (matches = path.match(/^\/([\w\-]+)\/?$/)) {  // controller or controller/
			controller = matches[1];
			action = this.defaultAction;
		}else if(matches = path.match(/^\/([\w\-]+)\/(\d+)\/?$/)) { // controller/id or controller/id/
			controller = matches[1];
			action = 'view';
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/(\d+)\/([\w\-]+)\/?\??(.*)$/)) { // controller/id/customaction or controller/id/customaction?params
			controller = matches[1];
			action = matches[3];
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/([\w\-]+)\/?\??(.*)$/)) { // controller/action or controller/action?params
			controller = matches[1];
			action = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/?\?(.*)$/)) {
            controller = matches[1];
            action = this.defaultAction;
        } else {
			controller = this.defaultController;
			action = this.defaultAction;
		}

		var controllerClassName = $.String.format(this.namespace + '.controllers.{0}', $.String.camelize(controller));
		var controllerClass = $.getClass(controllerClassName);
		
		if (!controllerClass) {
			throw new Error($.String.format('Controller {0} not found.', controller));
		}
		
		var controllerInstance = new controllerClass({
			id: id
		});

		var actionMethodName = $.String.camelize(action, true) + this.actionPrefix;
		if (!controllerInstance[actionMethodName]) {
			throw new Error($.String.format('Call undefined action {0} in controller {1}', action, controller));
		}
		controllerInstance.before();
		controllerInstance[actionMethodName]();
		controllerInstance.after();
	}
});

/**
 * @class $.Button
 */

$.Component.extend('$.Button button', {
	tag: 'a'
    ,baseClasses: 'x-button'
    ,defaultOptions: $.readOnlyObject({
        scale: 'small'
    })

    ,initElement: function() {
        this.callSuper();
        this.el.setAttr('tabindex', 0);
        this.textEl = this.el.append({
            dom: '<span>'
            ,classes: 'x-text'
        });
    }
	
	,setType: function(type) {
		this.el.setAttr('type', type);
		return this;
	}
	
	,setClick: function(callback) {
		return this.el.on('click', callback);
	}
	
	,enable: function() {
        this.el.removeAttr('disabled');
		return this;
	}
	
	,disable: function() {
		this.el.setAttr('disabled', 'disabled');
		return this;
	}
	
	,setDisabled: function(bool) {
		return this[bool? 'disable' : 'enable']();
	}

    ,setScale: function(scale) {
        this.setAttr('x-scale', scale);
        return this;
    }

    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    ,setIcon: function(icon) {
        if (!this.iconEl) {
            this.iconEl = this.el.insert(0, {
                dom: '<span>'
                ,classes: 'x-icon'
            });
        }
        this.iconEl.removeClasses(/icon-([\w\-]+)/)
            .addClasses('icon-' + icon);

        return this;
    }

    ,setMenu: function(options) {
        options || (options = {});
        !(options instanceof Array) || (options = {children: options});
        if (!this.menu) {
            this.menu = new $.Menu(options);
            this.add(this.menu);
            this.addClasses('x-button-menu');
        } else {
            this.menu.setOptions(options);
        }
        return this;
    }

    ,setToggleable: function(bool) {
        if (bool) {
            if (!this._toggleableCallback) {
                this._toggleableCallback = function() {
                    this.toggle();
                }.bind(this);
                this.on('click', this._toggleableCallback);
            }
        } else {
            if (this._toggleableCallback) {
                this.removeClasses('x-button-pressed');
                this.un('click', this._toggleableCallback);
                this._toggleableCallback = undefined;
            }
        }

        return this;
    }

    ,press: function() {
        if (this.pressed) {
            return this;
        }

        this.pressed = true;
        this.addClasses('x-button-pressed');
        this.trigger('press toggle', true);
        return this;
    }

    ,release: function() {
        if (!this.pressed) {
            return this;
        }

        this.pressed = false;
        this.removeClasses('x-button-pressed');
        this.trigger('release toggle', false);
        return this;
    }

    ,toggle: function() {
        return this[this.pressed? 'release' : 'press']();
    }

    ,setRadioable: function(bool) {
        if (bool) {
            if (!this._radioableCallback) {
                this._radioableCallback = function() {
                    this.radioClasses('x-button-pressed');
                    var pressed = this.pressed = this.hasClasses('x-button-pressed');
                    this.trigger('toggle', pressed);
                }.bind(this);
                this.on('click', this._radioableCallback);
            }
        } else {
            if (this._radioableCallback) {
                this.removeClasses('x-button-pressed');
                this.un('click', this._radioableCallback);
                this._radioableCallback = undefined;
            }
        }

        return this;
    }
});


/**
 * @class $.Calendar
 */

$.Component.extend('$.Calendar calendar', {
    baseClasses: 'x-calendar'

    ,defaultOptions: $.readOnlyObject({
        format: 'm/d/Y'
        ,timeSelect: false
    })

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('change', function() {
            update();
        });

        var cells;
        var update = function() {
            var value = this.getValue();
            this.monthYearPickerText.setHtml(value.format('F Y'));

            if (this.monthYearPickerPanel.isVisible()) {
                this.monthPickerPanel.child(value.getMonth()).radioClasses('x-selected');
            }

            var year = value.getFullYear()
                ,start = Math.floor(year / 10) * 10;

            $.each(this.yearPickerBody.children(), function(item) {
                item.setValue(start).setHtml(start);
                item.removeClasses('x-selected');
                if (start == year) {
                    item.addClasses('x-selected');
                }
                start++;
            });

            var daysInMonth = value.getDaysInMonth()
                ,firstDay = value.getFirstDateOfMonth().getDay();

            var range = $.Array.range(1, daysInMonth + 1);

            if (firstDay > 0) {
                var daysInMonthOfLastMonth = value.last('1 month').getDaysInMonth();
                for (var i = 0; i < firstDay; i++) {
                    range.unshift(daysInMonthOfLastMonth);
                    daysInMonthOfLastMonth--;
                }
            }

            var notActivePrev = $.Array.range(0, firstDay);
            var notActiveNext = [];
            for (var i = 1, end = 42 - range.length; i <= end; i++) {
                range.push(i);
                notActiveNext.push(range.length - 1);
            }

            if (!cells) {
                cells = this.body.queryAll('a');
            };

            var date = this.getValue().getDate()
                ,cValue
                ,idx;

            $.each(cells, function(cell, index) {
                cValue = range[index];

                cell.setHtml(range[index]).addClasses('x-active').removeClasses('x-selected');

                if (-1 != (idx = notActivePrev.indexOf(index))) {
                    cValue = idx - firstDay + 1;
                    cell.removeClasses('x-active');
                }

                if (-1 != (idx = notActiveNext.indexOf(index))) {
                    cValue = idx + daysInMonth + 1;
                    cell.removeClasses('x-active');
                }

                cell.setValue(cValue);

                if (date == cValue) {
                    cell.addClasses('x-selected');
                }
            });

            this.fullInfo.setHtml(value.format(this.format));

        }.bind(this)

        update();
    }

    ,initElement: function() {
        this.callSuper();

        var me = this;

        this.header = this.add({
            classes: 'x-header'
        });

        this.prevBt = this.header.add({
            xtype: 'button'
            ,classes: 'x-prev'
            ,icon: 'chevron-left'
            ,scale: 'mini'
            ,click: function() {
                me.change(function() {
                    me.getValue().add('-1 month');
                });
            }
        });

        this.mothYearPicker = this.header.add({
            classes: 'x-month-year-picker'
            ,listeners: {
                click: function() {
                    this.toggleDisplayMonthYearPicker();
                }.bind(this)
            }
        });

        this.monthYearPickerText = this.mothYearPicker.add({
            tag: 'span'
            ,classes: 'x-text'
            ,html: this.getValue().format('F Y')
        });

        this.nextBt = this.header.add({
            xtype: 'button'
            ,classes: 'x-next'
            ,icon: 'chevron-right'
            ,scale: 'mini'
            ,click: function() {
                me.change(function() {
                    me.getValue().add('1 month');
                });
            }
        });

        this.monthYearPickerPanel = this.add({
            classes: 'x-month-year-picker-panel x-hidden'
        });

        this.monthPickerPanel = this.monthYearPickerPanel.add({
            classes: 'x-panel x-month-picker-panel'
        });

        $.each($.Date.monthNames, function(name) {
            this.monthPickerPanel.add({
                tag: 'a'
                ,classes: 'x-item'
                ,html: name.substr(0, 3)
                ,listeners: {
                    click: function(e, el) {
                        me.change(function() {
                            me.getValue().setMonth(el.index());
                        });
                    }
                }
            });
        }, this);

        this.yearPickerPanel = this.monthYearPickerPanel.add({
            classes: 'x-panel x-year-picker-panel'
        });

        this.yearPickerPanel.add({
            xtype: 'button'
            ,classes: 'x-prev'
            ,scale: 'mini'
            ,icon: 'chevron-left'
            ,click: function() {
                var year = me.value.getFullYear()
                    ,value;
                $.each(me.yearPickerBody.children(), function(item) {
                    value = parseInt(item.getValue()) - 10;
                    item.setValue(value).setHtml(value).removeClasses('x-selected');

                    if (value == year) {
                        item.radioClasses('x-selected');
                    }
                });
            }
        });

        this.yearPickerPanel.add({
            xtype: 'button'
            ,classes: 'x-next'
            ,scale: 'mini'
            ,icon: 'chevron-right'
            ,click: function() {
                var year = me.value.getFullYear()
                    ,value;
                $.each(me.yearPickerBody.children(), function(item) {
                    value = parseInt(item.getValue()) + 10;
                    item.setValue(value).setHtml(value).removeClasses('x-selected');

                    if (value == year) {
                        item.radioClasses('x-selected');
                    }
                });
            }
        });

        this.yearPickerBody = this.yearPickerPanel.add({
            classes: 'x-body'
            ,children: function() {
                var result = [];
                for (var i = 0; i < 10; i++) {
                    result.push({
                        tag: 'a'
                        ,classes: 'x-item'
                        ,listeners: {
                            click: function(e, el) {
                                this.radioClasses('x-selected');
                                me.change(function() {
                                    me.getValue().setFullYear(el.getValue());
                                });
                            }
                        }
                    });
                }
                return result;
            }()
        });

        this.monthYearPickerPanel.add({
            xtype: 'button'
            ,html: 'Close'
            ,click: function() {
                me.monthYearPickerPanel.hide();
            }
        });

        var hour = new $.field.Text({

        });

        var minute = new $.field.Text({

        });

        this.timePickerPanel = this.add({
            xtype: 'modal'
            ,children: {
                classes: 'x-time-picker-panel'
                ,children: [
                    {
                        classes: 'x-input-group'
                        ,children: [
                            hour
                            ,{
                                html: ':'
                            }
                            ,minute
                        ]
                    },{
                        xtype: 'button'
                        ,html: 'Ok'
                        ,click: function() {
                            me.timePickerPanel.hide();

                            var v = me.getValue()
                                ,h = hour.getValue().toFloat()
                                ,m = minute.getValue().toFloat();

                            me.change(function() {
                                v.setHours(h);
                                v.setMinutes(m);
                            });

                            me.trigger('select');
                        }
                    },{
                        xtype: 'button'
                        ,html: 'Cancel'
                        ,click: function() {
                            me.timePickerPanel.hide();
                            me.trigger('select');
                        }
                    }
                ]
            }

            ,listeners: {
                show: function() {
                    hour.setValue(me.getValue().format('H'));
                    minute.setValue(me.getValue().format('m'));
                }
            }
        });

        this.body = this.add({
            classes: 'x-body'
            ,children: {
                tag: 'table'
                ,children: [
                    {
                        tag: 'thead'
                        ,children: function() {
                            var cells = [];
                            $.each($.Date.dayNames, function(item) {
                                cells.push({
                                    tag: 'th'
                                    ,html: item[0]
                                });
                            });
                            return cells;
                        }()
                    },{
                        tag: 'tbody'
                        ,children: function() {
                            var rows = [];
                            for (var i = 0; i < 6; i++) {
                                rows.push({
                                    tag: 'tr'
                                    ,children: function() {
                                        var cells = [];
                                        for (var i = 0; i < 7; i++) {
                                            cells.push({
                                                tag: 'td'
                                                ,children: {
                                                    tag: 'a'
                                                    ,listeners: {
                                                        click: function(e, el) {
                                                            if (me.timeSelect) {
                                                                me.change(function() {
                                                                    me.getValue().setDate(el.getValue());
                                                                });
                                                                me.timePickerPanel.show();
                                                            } else {
                                                                me.change(function() {
                                                                    me.getValue().setDate(el.getValue());
                                                                });
                                                                me.trigger('select');
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        return cells;
                                    }()
                                });
                            }
                            return rows;
                        }()
                    }
                ]
            }
        });

        this.fullInfo = new $.Component({
            classes: 'x-full-info'
        });

        this.footer = this.add({
            classes: 'x-footer'
            ,children: [
                this.fullInfo
                ,{
                    xtype: 'button'
                    ,html: 'Today'
                    ,click: function() {
                        me.change(function() {
                            me.setValue(new Date);
                        });
                        me.trigger('select');
                    }
                }
            ]
        });
    }

    ,toggleDisplayMonthYearPicker: function() {
        this.monthYearPickerPanel.toggleClasses('x-hidden');
        if (this.monthYearPickerPanel.hasClasses('x-hidden')) {
            return this;
        }

        var year = this.getValue().getFullYear()
            ,start = Math.floor(year / 10) * 10;

        $.each(this.yearPickerBody.children(), function(item) {
            item.setValue(start).setHtml(start);
            if (start == year) {
                item.radioClasses('x-selected');
            }
            start++;
        });

        var month = this.getValue().getMonth();
        this.monthPickerPanel.child(month).radioClasses('x-selected');
    }

    ,setValue: function(value, format) {
        if ('string' == typeof value) {
            this.getValue().from(value, format);
        } else {
            this.value = $.Date(value);
        }
        this.trigger('change');
        return this;
    }

    ,getValue: function() {
        if (!this.value) {
            this.value = $.Date();
        }
        return this.value;
    }

    ,change: function(callback) {
        callback();
        this.trigger('change');
    }

    ,setFormat: function(format) {
        this.format = format;
        this.fullInfo.setHtml(this.getValue().format(this.format));

        return this;
    }

    ,from: function(input, format) {
        this.setValue(input, format);
    }

    ,setTimeSelect: function(bool) {
        this.timeSelect = bool;
        return this;
    }

    ,toString: function() {
        return this.getValue().format(this.format);
    }
});


/**
 * @class $.Collection
 */

$.Observable.extend('$.Collection', {
	url: ''
	,totalProperty: 'total'
	,root: 'rows'
	,total: null
	,constructor: function(data, options) {
        this.callSuper([options]);

		this.models = [];
		this.setData(data || {});
	}

	,getAjax: function() {
		if (!this._ajax) {
			this._ajax = new $.Ajax();
			this._ajax.on('exception', function(xhr, ajax) {
				this.trigger('exception', xhr.statusText, xhr, ajax, this);
			}, this);
		}
		return this._ajax;
	}

	,setData: function(data) {
        this.models = [];
        var model;

		$.each(data, function(item, index) {
            model = new this.model(item);
            model.on('change', function() {
                this.trigger('change:model', model);
            }, this);
			this.models.push(model);
		}, this);

		this.trigger('change', data, this);
		return this;
	}

	,load: function(options) {
        options || (options = {});
        if ('function' == typeof options) {
            options = {callback: options}
        }
		options.url = options.url || this.url || this.model.prototype.url;

        options.success = function(responseText) {
            var response = JSON.parse(responseText);
            me.total = response[me.totalProperty];
            me.setData(response[me.root]);
            me.trigger('load', response[me.root], me);
            if (options.callback) {
                options.callback.call(me, response[me.root], me);
            }
        };

        options.complete = function(xhr, ajax) {
            me.trigger('load:complete', xhr, ajax, me);
        }

		var ajax = this.getAjax();
		var me = this;

        this.trigger('load:start');

		ajax.send(options);
		return this;
	}

	,each: function(callback, scope) {
		scope || (scope = this);
		$.each(this.models, function(model, index, models) {
			return callback.call(scope, model, index, models, this);
		}, this);
		return this;
	}

	,get: function(id) {
		return this.findOneBy(this.model.prototype.idProperty, id);
	}

	,at: function(index) {
		return this.models[index];
	}

	,findOneBy: function(property, value) {
		var result;
		this.each(function(model, index, models) {
			if (model.get(property) === value) {
				result = model;
				return false;
			}
		});
		return result;
	}

	,findBy: function(property, name) {
		var results = [];
		this.each(function(model, index, models) {
			if (model.get(property) === value) {
				result.push(model);
			}
		});
		return results;
	}

	,sort: function(callback, scope) {
		this.models.sort(callback.bind(scope || this));
		this.trigger('sort', this);
	}

	,sortBy: function(property, direction) {
		direction || (direction = 'ASC');
		var callback = function(a, b) {
			var result = 0;

			a = a.get(property);
			b = b.get(property);

			if (a < b) {
				result = -1
			} else if (a > b) {
				result = 1;
			}

			if (direction == 'DESC') {
				result *= -1;
			}
			return result;
		};
		return this.sort(callback);
	}

	,sortDescBy: function(property) {
		return this.sortBy(property, 'DESC');
	}

	,filter: function(callback, scope) {
		return this.models.filter(callback, scope);
	}

    ,indexOf: function(model) {
        return this.models.indexOf(model);
    }

	,toJson: function() {
		var result =[];
		this.each(function(model) {
			result.push(model.toJson());
		});
		return result;
	}

    ,setPaginator: function(options) {
        if (!this.paginator) {
            var me = this;
            this.paginator = new $.Paginator({
                listeners: {
                    pagingchange: function(page) {
                        me.load({params: {page: page}});
                    }
                }
            });

            this.on('load', function() {
                this.paginator.setTotalItem(this.total);
            });

        }
        this.paginator.applyOptions(options);
        return this;
    }

    ,getPaginator: function() {
        this.setPaginator();
        return this.paginator;
    }
});


/**
 * @class $.List
 */

$.Component.extend('$.List list', {
    tag: 'ul'
    ,baseClasses: 'x-list'
    ,defaultChildType: 'list.item'

    ,multiSelect: false

    ,constructor: function() {
        this.callSuper(arguments);

        var me = this;
        this.on('click', function(e) {
            var item = e.getTargetComponent(me.defaultChildType, this);
            if (item) {
                if (item.isSelected()) {
                    me.select(item);
                }
            }
        });
    }

    ,setDirection: function(direction) {
        this.switchClasses(direction == 'horizontal', 'x-horizontal');
        return this;
    }

    ,setMultiSelect: function(bool) {
        this.multiSelect = bool;

        return this;
    }

    ,getSelected: function(at) {
        query = '> .x-selected';

        if ('number' == typeof at) {
            at = 'at(' + at + ')';
        }

        if (at) {
            query += ':' + at;
        }

        return this.query(query);
    }

    ,getSelection: function(bool) {
        var query = bool !== false? '> .x-selected' : '> :not(.x-selected)';
        return this.queryAll(query);
    }

    ,select: function(items) {
        if (undefined === items) {
            items = this.children();
        }

        (items instanceof Array) || (items = [items]);

        if (!this.multiSelect) {
            items = [items[0]];
        }

        $.each(items, function(item, index) {
            if ('number' == typeof item) {
                items[index] = this.child(item);
            }
        }, this);

        items = $.Array(items);
        if (!this.multiSelect) {
            $.each(this.getSelection(), function(item) {
                if (!items.has(item)) {
                    item.deselect();
                }
            });
        }

        $.each(items, function(item) {
            item.select();
        }, this);

        this.trigger('selectionchange', this);
        this.trigger('select', items);

        return this;
    }

    ,clearSelection: function() {
        $.each(this.getSelection(), function(item) {
            item.deselect();
        });
        return this;
    }

    ,toggleSelection: function() {
        var unselection = this.getSelection(false);
        this.clearSelection();

        $.each(unselection, function(item) {
            item.select();
        });

        return this;
    }

    ,selectFirst: function() {
        return this.select(0);
    }

    ,selectLast: function() {
        return this.select(this.lastChild());
    }

    ,getFirstSelected: function() {
        return this.getSelected();
    }

    ,getLastSelected: function() {
        return this.getSelected('last');
    }

    ,getSelectAt: function(at) {
        return this.getSelected(at);
    }

    ,selectNext: function() {
        var selected = this.getFirstSelected()
            ,next;

        if (selected) {
            next = selected.getNext();
        }

        if (!next) {
            next = this.child(0);
        }

        return this.select(next);
    }

    ,selectPrev: function() {
        var selected = this.getFirstSelected()
            ,prev;

        if (selected) {
            prev = selected.getPrev();
        }

        if (!prev) {
            prev = this.lastChild();
        }

        return this.select(prev);
    }
});


/**
 * @class $.ColorPalette
 */

$.List.extend('$.ColorPalette colorpalette', {
    baseClasses: 'x-list x-color-palette'
    ,defaultOptions: $.readOnlyObject({
        colors: [
            '000000', '993300', '333300', '003300', '003366', '000080', '333399', '333333',
            '800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080',
            'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '969696',
            'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0',
            'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'
        ]
        ,multiSelect: false
        ,columns: 8
    })
    ,itemSize: 18

    ,setColors: function(colors) {
        this.empty();

        $.each(colors, function(color) {
            color = '#' + color;
            this.add({
                size: this.itemSize
                ,value: color
                ,radioSelect: true
                ,styles: {
                    backgroundColor: color
                }
            });
        }, this);
    }

    ,setItemSize: function(size) {
        $.each(this.children(), function(item) {
            item.setSize(size);
        });
        this.itemSize = size;
        return this;
    }

    ,setColumns: function(columns) {
        this.setWidth((this.itemSize + 4) * columns);
        return this;
    }

    ,setValue: function(value) {
        var item = this.query('> .x-item[data-value=\\#' + value + ']');
        item.select();
        return this;
    }

    ,getValue: function() {
        var selected = this.getFirstSelected();
        if (selected) {
            return selected.getValue().substr(-6);
        }
    }
});


/**
 * @class $.Controller
 */

$.Observable.extend('$.Controller', {
	before: $.emptyFn
	,after: $.emptyFn
	
	,getParam: function(name) {
		return $.getUrlQueryParam(name);
	}
});


/**
 * @class $.Date
 */

(function() {
    var dayNames = [
        'Sunday'
        ,'Monday'
        ,'Tuesday'
        ,'Wednesday'
        ,'Thursday'
        ,'Friday'
        ,'Saturday'
    ];

    var monthNames = [
        'January'
        ,'February'
        ,'March'
        ,'April'
        ,'May'
        ,'June'
        ,'July'
        ,'August'
        ,'September'
        ,'October'
        ,'November'
        ,'December'
    ]

    $.Date = function(year /* milliseconds, dateString */, month, day, hour, minute, second, millisecond) {
        var d;

        if (year instanceof Date) {
            d = year;
            if (d.clone) {
                return d;
            }
        } else {
            if (year && arguments.length) {
                if (arguments.length == 1) {
                    d = new Date(year);
                } else {
                    d = new Date(year, month, day, hour || 0, minute || 0, second || 0, millisecond || 0);
                }
            } else {
                d = new Date;
            }
        }

        $.extend(d, {
            clone: function() {
                return $.Date(this.getTime());
            }

            ,from: function(input, format) {
                var d = $.Date.parse(input, format);
                this.setTime(d.getTime());
            }

            ,isValid: function() {
                return !isNaN(this.getTime());
            }

            ,next: function(format) {
                return $.Date.parse('next ' + format, this.clone());
            }

            ,last: function(format) {
                return $.Date.parse('last ' + format, this.clone());
            }

            ,add: function(value, type) {
                if (!type) {
                    var operator = value[0];
                    if (operator != '+' && operator != '-') {
                        operator = '+';
                    }

                    var matches = value.match(/(\d+\s+\w+)/g);
                    $.each(matches, function(match) {
                        match = match.split(/\s+/);
                        this.add(operator + match[0], match[1]);
                    }.bind(this));
                } else {
                    var day;
                    value = parseFloat(value);

                    switch (type) {
                        case 'year':
                        case 'years':
                            if (this.getMonth() == 1) {
                                var clone = this.clone();
                                clone.setFullYear(this.getFullYear() + value);
                                if (!clone.isLeapYear() && this.getDate() == 29) {
                                    this.setDate(28);
                                }
                            }
                            this.setFullYear(this.getFullYear() + value);
                            break;

                        case 'month':
                        case 'months':
                            var day = this.getDate()
                                ,month = this.getMonth()
                                ,d = $.Date(this.getFullYear(), month + value, 1)
                                ,daysInMonth = d.getDaysInMonth();

                            if (daysInMonth < day) {
                                this.setDate(daysInMonth);
                            }

                            this.setMonth(month + value);
                            break;

                        case 'week':
                        case 'weeks':
                            this.add(value * 7, 'day');
                            break;

                        case 'day':
                        case 'days':
                            this.setDate(this.getDate() + value);
                            break;

                        case 'hour':
                        case 'hours':
                            this.setHours(this.getHours() + value);
                            break;

                        case 'minute':
                        case 'minutes':
                            this.setMinutes(this.getMinutes() + value);
                            break;

                        case 'second':
                        case 'seconds':
                            this.setSeconds(this.getSeconds() + value);
                            break;

                        case 'millisecond':
                        case 'milliseconds':
                            this.setMilliseconds(this.getMilliseconds() + value);
                    }
                }
                return this;
            }

            ,getSuffix: function() {
                switch (this.getDate()) {
                    case 1:
                    case 21:
                    case 31:
                        return 'st';

                    case 2:
                    case 22:
                        return 'nd';

                    case 3:
                    case 23:
                        return 'rd';

                    default:
                        return 'th';
                }
            }

            ,getDayOfYear: function() {
                var c = new Date(this.getFullYear(), 0, 1);
                return Math.ceil((this - c) / 86400000) - 1;
            }

            ,getWeekOfYear: function() {
                var c = new Date(this.getFullYear(), 0, 1);
                return Math.ceil((((this - c) / 86400000) + c.getDay() + 1) / 7);
            }

            ,getDaysInMonth: function() {
                var c = new Date(this.getFullYear(), this.getMonth() + 1, 0);
                return c.getDate();
            }

            ,getFirstDateOfMonth : function() {
                return $.Date(this.getFullYear(), this.getMonth(), 1);
            }

            ,getLastDateOfMonth : function() {
                return $.Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
            }

            ,getLastDayOfMonth : function() {
                return this.getLastDateOfMonth().getDay();
            }

            ,isLeapYear: function() {
                var y = this.getFullYear();
                return !(y % 4) && (y % 100) || !(y % 400) ? true : false;
            }

            ,toInternetTime: function(n) {
                var s   = this.getUTCSeconds()
                    ,m  = this.getUTCMinutes()
                    ,h  = this.getUTCHours();

                h = (h == 23) ? 0 : h + 1;

                var beats = Math.abs(((h * 60 + m) * 60 + s) / 86.4).toFixed(parseInt(n));
                var length = (n > 0) ? 1 + n : 0;

                return '000'.concat(beats).slice(beats.length - length);
            }

            ,isDst: function() {
                return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == 'D';
            }

            ,getGmtOffset: function(separate) {
                var offset = this.getTimezoneOffset();
                return (offset > 0? '-' : '+')
                    + ('0' + Math.floor(Math.abs(offset / 60))).substr(-2)
                    + (separate? ':' : '')
                    + ('0' + Math.abs(offset % 60)).substr(-2)
            }

            ,getAbbr: function() {
                return this.toString().replace(/(.*) ([A-Z]{1,4})(\-|\+)\d{4} (.*)/, '$2');
            }

            ,format: function(format) {
                return format.replace(/\w/g, function(m, index) {
                    if ('\\' == format.charAt(index - 1)) {
                        return m;
                    }
                    return from(m, format);
                }).stripSlashes();

                function from(code, format) {
                    switch (code) {
                        //Day	---	---
                        case 'd':	// Day of the month, 2 digits with leading zeros	01 to 31
                            var day = d.getDate();
                            return ('0' + day).substr(-2);

                        case 'D':   // A textual representation of a day, three letters	Mon through Sun
                            return dayNames[d.getDay()].substr(0, 3);

                        case 'j':   // 	Day of the month without leading zeros	1 to 31
                            return d.getDate();

                        case 'l':   //  (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
                            return dayNames[d.getDay()];

                        case 'N':   // 	ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)	1 (for Monday) through 7 (for Sunday)
                            return d.getDay() + 1;

                        case 'S':   // 	English ordinal suffix for the day of the month, 2 characters	st, nd, rd or th. Works well with j
                            return d.getSuffix();

                        case 'w':   // 	Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
                            return d.getDay();

                        case 'z':   // 	The day of the year (starting from 0)	0 through 365
                            return d.getDayOfYear();

                        // Week	---	---
                        case 'W':   // 	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
                            return d.getWeekOfYear();

                        //Month	---	---
                        case 'F':   // 	A full textual representation of a month, such as January or March	January through December
                            return monthNames[d.getMonth()];

                        case 'm':   // 	Numeric representation of a month, with leading zeros	01 through 12
                            return ('0' + (d.getMonth() + 1)).substr(-2);

                        case 'M':   // 	A short textual representation of a month, three letters	Jan through Dec
                            return monthNames[d.getMonth()].substr(0, 3);

                        case 'n':   // 	Numeric representation of a month, without leading zeros	1 through 12
                            return d.getMonth() + 1;

                        case 't':   // 	Number of days in the given month	28 through 31
                            return d.getDaysInMonth();

                        //Year	---	---
                        case 'L':   // 	Whether it's a leap year	1 if it is a leap year, 0 otherwise.
                            return d.isLeapYear()? 1 : 0;

                        case 'o':   // 	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
                            var result = d.getFullYear()
                                ,woy = d.getWeekOfYear()
                                ,m = d.getMonth();

                            if (woy == 1 && m > 0) {
                                result += 1;
                            } else if (woy >= 52 && m < 11) {
                                result -= 1;
                            }

                            return result;

                        case 'Y':   // 	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
                            return d.getFullYear();

                        case 'y':   // 	A two digit representation of a year	Examples: 99 or 03
                            return (d.getFullYear() + '').substr(-2);

                        //Time	---	---
                        case 'a':   // 	Lowercase Ante meridiem and Post meridiem	am or pm
                        case 'A':   // 	Uppercase Ante meridiem and Post meridiem	AM or PM
                            var h = d.getHours()
                                ,result = h < 12? 'am' : 'pm';

                            return 'A' == code? result.toUpperCase() : result;

                        case 'B':   // 	Swatch Internet time	000 through 999
                            return d.toInternetTime();

                        case 'g':   // 	12-hour format of an hour without leading zeros	1 through 12
                        case 'G':   // 	24-hour format of an hour without leading zeros	0 through 23
                        case 'h':   // 	12-hour format of an hour with leading zeros	01 through 12
                        case 'H':   // 	24-hour format of an hour with leading zeros	00 through 23
                            var h = d.getHours();

                            if ('G' == code) {
                                return h;
                            }

                            if ('H' == code) {
                                return ('0' + h).substr(-2);
                            }

                            if (h < 1) {
                                h += 12;
                            } else if (h > 12) {
                                h -= 12;
                            }

                            if ('g' == code) {
                                return h;
                            }

                            return ('0' + h).substr(-2);

                        case 'i':   // 	Minutes with leading zeros	00 to 59
                            return ('0' + d.getMinutes()).substr(-2);

                        case 's':   // 	Seconds, with leading zeros	00 through 59
                            return ('0' + d.getSeconds()).substr(-2);

                        case 'u':   // 	Microseconds (added in PHP 5.2.2)	Example: 654321
                            return d.getMilliseconds() * 1000;

                        // Timezone	---	---
                        case 'e':   // 	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
                            return d.toString().replace(/\((.*)\)$/, '$2');

                        case 'I':   //  (capital i)	Whether or not the date is in daylight saving time	1 if Daylight Saving Time, 0 otherwise.
                            return d.isDst()? 1 : 0;

                        case 'O':   // 	Difference to Greenwich time (GMT) in hours	Example: +0200
                            return d.getGmtOffset();

                        case 'P':   // 	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
                            return d.getGmtOffset(true);
                            return;

                        case 'T':   // 	Timezone abbreviation	Examples: EST, MDT ...
                            return d.getAbbr();
                            return;

                        case 'Z':   // 	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
                            return d.getTimezoneOffset() * -60;

                        // Full Date/Time	---	---
                        case 'c':   // 	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
                            return d.format('Y-m-d\\TH:i:sP');

                        case 'r':   // 	» RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
                            return d.format('D, d M Y H:i:s O');

                        case 'U':   // 	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()
                            return Math.round(d.getTime() / 1000);

                        default:
                            return code;
                    }
                }
            }
        });
        return d;
    };

    $.extend($.Date, {
        dayNames: dayNames
        ,monthNames: monthNames

        ,parse: function(input, format) {
            if (/^(\+|\-|next |last )/.test(input)) {
                format instanceof Date || (format = new Date);
                var d = $.Date(format);

                if (input[0] == '+' || input[0] == '-') {
                    return d.add(input);
                }

                var matches = input.match(/(next|last)\s+(\d+)?\s*(\w+)/)
                    ,operator = 'last' == matches[1]? '-' : '+'
                    ,value = parseInt(matches[2]) || 1
                    ,index = dayNames.indexOf(matches[3])
                    ,offset
                    ,fm;

                if (-1 == index) {
                    index = dayNames.map(function(i) {return i.substr(0, 3)}).indexOf(matches[3]);
                }

                if (-1 != index) {
                    var day = d.getDay();
                    offset = index - day;
                    if (offset <= 0) {
                        offset += 7;
                    }

                    if (value) {
                        offset += (7 * (value - 1));
                    }

                    fm = $.String.format('{0}{1} days', operator, offset);
                }

                index = monthNames.indexOf(matches[3]);
                if (-1 == index) {
                    index = monthNames.map(function(i) {return i.substr(0, 3)}).indexOf(matches[3]);
                }

                if (-1 != index) {
                    var month = d.getMonth();
                    offset = index - month;
                    if (offset <= 0) {
                        offset += 12;
                    }

                    if (value) {
                        offset += (12 * (value - 1));
                    }

                    fm = $.String.format('{0}{1} months', operator, offset);
                }

                if (!fm) {
                    fm = $.String.format('{0}{1} {2}', operator, value, matches[3]);
                }

                return d.add(fm);
            }

            if (!format || 'c' == format || 'r' == format || 'u' == format) {
                return $.Date(input);
            }

            var index = 0
                ,map = {};

            format = $.String.escapeRegex(format).replace(/\w/g, function(m, index) {
                if ('\\' == format.charAt(index - 1)) {
                    return m;
                }
                return from(m, format);
            });


            function from(code, format) {
                var name, pattern;
                index++;

                switch (code) {
                    //Day	---	---
                    case 'd':	// Day of the month, 2 digits with leading zeros	01 to 31
                        name = 'day';
                        pattern = '\\d{2}';
                        break;

                    case 'D':   // A textual representation of a day, three letters	Mon through Sun
                        name = 'shortDayName';
                        pattern = dayNames.map(function(i) {return i.substr(0, 3)}).join('|');
                        break;

                    case 'j':   // 	Day of the month without leading zeros	1 to 31
                        name = 'day';
                        pattern = '\\d{1,2}';
                        break;

                    case 'l':   //  (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
                        name = 'dayName';
                        pattern = dayNames.join('|');
                        break;

                    case 'z':   // 	The day of the year (starting from 0)	0 through 365
                        name = 'dayOfYear';
                        pattern = '\\d{1,3}';
                        break;

                    // Week	---	---
                    case 'W':   // 	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
                        name = 'weekOfYear';
                        pattern = '\\d{1,2}';
                        break;

                    //Month	---	---
                    case 'F':   // 	A full textual representation of a month, such as January or March	January through December
                        name = 'monthName';
                        pattern = monthNames.join('|');
                        break;

                    case 'm':   // 	Numeric representation of a month, with leading zeros	01 through 12
                        name = 'month';
                        pattern = '\\d{2}';
                        break;

                    case 'M':   // 	A short textual representation of a month, three letters	Jan through Dec
                        name = 'shortMonthName';
                        pattern = monthNames.map(function(i) {return i.substr(0,3)}).join('|');
                        break;

                    case 'n':   // 	Numeric representation of a month, without leading zeros	1 through 12
                        name = 'month';
                        pattern = '\\d{1,2}';
                        break;

                    //Year	---	---
                    case 'o':   // 	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
                    case 'Y':   // 	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
                        name = 'fullYear';
                        pattern = '\\d{4}';
                        break;

                    case 'y':   // 	A two digit representation of a year	Examples: 99 or 03
                        name = 'shortYear';
                        pattern = '\\d{2}';
                        break;

                    //Time	---	---
                    case 'a':   // 	Lowercase Ante meridiem and Post meridiem	am or pm
                    case 'A':   // 	Uppercase Ante meridiem and Post meridiem	AM or PM
                        name = 'meridiem';
                        pattern = 'am|AM|pm|PM';
                        break;

                    case 'B':   // 	Swatch Internet time	000 through 999
                        name = 'internetTime';
                        pattern = '\\d{3}';
                        break;

                    case 'g':   // 	12-hour format of an hour without leading zeros	1 through 12
                    case 'h':   // 	12-hour format of an hour with leading zeros	01 through 12
                        name = 'hour12';
                        pattern = '\\d{1,2}';
                        break;

                    case 'G':   // 	24-hour format of an hour without leading zeros	0 through 23
                    case 'H':   // 	24-hour format of an hour with leading zeros	00 through 23
                        name = 'hour';
                        pattern = '\\d{2}';
                        break;

                    case 'i':   // 	Minutes with leading zeros	00 to 59
                        name = 'minutes';
                        pattern = '\\d{2}';
                        break;

                    case 's':   // 	Seconds, with leading zeros	00 through 59
                        name = 'seconds';
                        pattern = '\\d{2}';
                        break;

                    case 'u':   // 	Microseconds (added in PHP 5.2.2)	Example: 654321
                        name = 'microseconds';
                        pattern = '\\d{6}';
                        break;

                    // Timezone	---	---
                    case 'e':   // 	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
                        name = 'abbr';
                        pattern = '[\\w/]+';
                        break;

                    case 'O':   // 	Difference to Greenwich time (GMT) in hours	Example: +0200
                        name = 'gmtOffset';
                        pattern = '\\+\\d{4}';
                        break;

                    case 'P':   // 	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
                        name = 'gmtOffsetSeparate';
                        pattern = '\\+\\d{2}:\\d{2}';
                        break;

                    case 'T':   // 	Timezone abbreviation	Examples: EST, MDT ...
                        name = 'abbr';
                        pattern = '[A-Z]{1,5}';
                        break;

                    case 'Z':   // 	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
                        name = 'timezoneOffset';
                        pattern = '\\-?\\d{5}';
                        break;

                    default:
                        return format;
                }

                map[name] = index;
                return '(' + pattern + ')';
            }

            var regExp = new RegExp('^' + format + '$')
                ,matches = input.match(regExp);

            if (!matches) {
                return false;
            }

            $.each(map, function(index, name) {
                map[name] = matches[index];
            });

            if (map.meridiem) {
                map.meridiem = map.meridiem.toLowerCase();
            }

            var now = new Date()
                ,Y = now.getFullYear()
                ,m = now.getMonth() + 1
                ,d = now.getDate()
                ,H, i, s, P, milliseconds;

            H = i = s = 0;
            P = '+00:00';

            $.each(map, function(value, name) {
                switch (name) {
                    case 'day':
                        d = parseFloat(value);
                        break;

                    case 'weekOfYear': // @todo implement it?
                        break;

                    case 'monthName':
                        m = monthNames.indexOf(value);
                        break;

                    case 'month':
                        m = parseFloat(value);
                        break;

                    case 'shortMonthName':
                        m = monthNames.map(function(i) {return i.substr(0, 3)}).indexOf(value);
                        break;

                    case 'fullYear':
                        Y = parseFloat(value);
                        break;

                    case 'shortYear':
                        Y = parseFloat(value);
                        Y += (Y < 70? 2000 : 1900);
                        break;

                    case 'internetTime': // @todo implement it?
                        break;

                    case 'hour12':
                        H = parseFloat(value);
                        if (map.meridiem) {
                            if (H == 12 && map.meridiem == 'am') {
                                H = 0;
                            }

                            if (H > 1 && H < 12 && map.meridiem == 'pm') {
                                H += 12;
                            }
                        }
                        break;

                    case 'hour':
                        H = parseFloat(value);
                        break;

                    case 'minutes':
                        i = parseFloat(value);
                        break;

                    case 'seconds':
                        s = parseFloat(value);
                        break;

                    case 'microseconds':
                        milliseconds = parseFloat(value) / 1000;
                        break;

                    case 'abbr':
                        value = $.Date.abbrs[value];
                        P = (value > 0? '+' : '-') + ('0' + Math.floor(Math.abs(value))).substr(-2) + ':' + ('0' + (value % 1) * 60).substr(-2);
                        break;

                    case 'gmtOffset':
                        P = value.replace(/(\d{2})/, '$1:');
                        break;

                    case 'gmtOffsetSeparate':
                        P = value;
                        break;

                    case 'timezoneOffset':
                        value = parseFloat(value) / 3600;
                        P = (value > 0? '+' : '-') + ('0' + Math.floor(Math.abs(value))).substr(-2) + ':' + ('0' + (value % 1) * 60).substr(-2);
                        break;
                }
            });

            var dateString = $.String.format('{Y}-{m}-{d}T{H}:{i}:{s}{P}', {
                Y: ('00' + Y).substr(-4)
                ,m: ('0' + m).substr(-2)
                ,d: ('0' + d).substr(-2)
                ,H: ('0' + H).substr(-2)
                ,i: ('0' + i).substr(-2)
                ,s: ('0' + s).substr(-2)
                ,P: P
            });

            var result = $.Date(dateString);

            if (map.dayOfYear) {
                result.setMonth(0, map.dayOfYear + 1);
            }

            if (milliseconds) {
                result.setMilliseconds(milliseconds);
            }

            return result;
        }
    });


})();
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
;


/**
 * @class $.Drag
 */

$.Observable.extend('$.Drag', {
    data: null

    ,constructor: function(el, options) {
        this.el = el;
        this.initElement();

        this.callSuper([options]);
    }

    ,initElement: function() {
        this.el.addClasses('x-draggable').setAttr('draggable', true);
        this.offsetX = this.offsetY = 0;

        var mouseMoveCallback = function(e) {
            this.x = e.pageX - this.offsetX;
            this.y = e.pageY - this.offsetY;
            this.trigger('drag', new $.Event(e));
        }.bind(this)

        var mouseUpCallback = function(e) {
            window.removeEventListener('mousemove', mouseMoveCallback, false);
            window.removeEventListener('mouseup', mouseUpCallback, false);
            this.trigger('end', new $.Event(e));
        }.bind(this);

        this.el.on('dragstart', function(e) {
            if (this.locked) {
                return false;
            }
            e.stop();

            this.offsetX = e.pageX - this.el.getLeft();
            this.offsetY = e.pageY - this.el.getTop();

            window.addEventListener('mousemove', mouseMoveCallback, false);
            window.addEventListener('mouseup', mouseUpCallback, false);
            this.trigger('start', new $.Event(e));

        }.bind(this));
    }

    ,lock: function() {
        this.el.setAttr('locked', true);
        this.locked = true;
        return this;
    }

    ,unlock: function() {
        this.el.removeAttr('locked');
        this.locked = false;
        return this;
    }

    ,setLockX: function(bool) {
        this.lockX = bool;
        return this;
    }

    ,setLockY: function(bool) {
        this.lockY = bool;
        return this;
    }

    ,setData: function(data) {
        this.data = data;
        return this;
    }
});


/**
 * @class $.Event
 */

$.Class.extend('$.Event', {
    constructor: function(event) {
        this.event = event;

        for (var i in event) {
            if (undefined !== this[i] || i == 'layerX' || i == 'layerY') {
                continue;
            }

            if ('function' == typeof event[i]) {
                this[i] = event[i].bind(event);
            } else {
                this[i] = event[i];
            }
        }
    }

    ,getXY: function() {
        if (!this.xy) {
            this.xy = {x: this.pageX, y: this.pageY};
        }
        return this.xy;
    }

    ,getOffset: function(el) {
        var e = this.event;
        el || (el = e.target);
        el = $.Element.get(el);

        var pageXY = el.getPageXY();
        pageXY.x = e.pageX - pageXY.x;
        pageXY.y = e.pageY - pageXY.y;

        return pageXY;
    }

    ,stop: function() {
        this.event.preventDefault();
        return this;
    }

    ,cancelBubble: function() {
        this.event.cancelBubble = true;
        return this;
    }

    ,getKey: function() {
        var e = this.event;
        return e.key || e.charCode || e.keyCode || e.which;
    }

    ,canModifyText: function() {
        var e = $.Event;
        var cannotModifyKeys = [
            e.KEY_ESCAPE,
            e.KEY_CONTROL,
            e.KEY_SHIFT,
            e.KEY_ALT,
            e.KEY_ENTER,
            e.KEY_LEFT,
            e.KEY_RIGHT,
            e.KEY_UP,
            e.KEY_DOWN
        ];

        return !$.Array(cannotModifyKeys).has(this.getKey());
    }

    ,getTargetComponent: function(componentClass, rootComponent) {
        if (!componentClass && !rootComponent) {
            if (this.target.dom.$comp) {
                return this.target.dom.$comp;
            }
            return;
        }

        if ('string' == typeof componentClass) {
            componentClass = $.alias(componentClass);
        }

        var target = this.target;
        if (target.$comp && target.$comp instanceof componentClass) {
            return target.$comp;
        }

        var domRoot = rootComponent.el.dom;
        while (target = target.parentElement) {
            if (!domRoot.contains(target)) {
                return;
            }

            if (target.$comp && target.$comp instanceof componentClass) {
                return target.$comp;
            }
        }
    }
});

$.extend($.Event, {
    KEY_0: 48
    ,KEY_1: 49
    ,KEY_2: 50
    ,KEY_3: 51
    ,KEY_4: 52
    ,KEY_5: 53
    ,KEY_6: 54
    ,KEY_7: 55
    ,KEY_8: 56
    ,KEY_9: 57
    ,KEY_A: 65
    ,KEY_ACCEPT: 30
    ,KEY_ADD: 107
    ,KEY_ALT: 18
    ,KEY_B: 66
    ,KEY_BACK_QUOTE: 192
    ,KEY_BACK_SLASH: 220
    ,KEY_BACK_SPACE: 8
    ,KEY_C: 67
    ,KEY_CANCEL: 3
    ,KEY_CAPS_LOCK: 20
    ,KEY_CLEAR: 12
    ,KEY_CLOSE_BRACKET: 221
    ,KEY_COMMA: 188
    ,KEY_CONTEXT_MENU: 93
    ,KEY_CONTROL: 17
    ,KEY_CONVERT: 28
    ,KEY_D: 68
    ,KEY_DECIMAL: 110
    ,KEY_DELETE: 46
    ,KEY_DIVIDE: 111
    ,KEY_DOWN: 40
    ,KEY_E: 69
    ,KEY_END: 35
    ,KEY_ENTER: 13
    ,KEY_EQUALS: 61
    ,KEY_ESCAPE: 27
    ,KEY_EXECUTE: 43
    ,KEY_F: 70
    ,KEY_F1: 112
    ,KEY_F10: 121
    ,KEY_F11: 122
    ,KEY_F12: 123
    ,KEY_F13: 124
    ,KEY_F14: 125
    ,KEY_F15: 126
    ,KEY_F16: 127
    ,KEY_F17: 128
    ,KEY_F18: 129
    ,KEY_F19: 130
    ,KEY_F2: 113
    ,KEY_F20: 131
    ,KEY_F21: 132
    ,KEY_F22: 133
    ,KEY_F23: 134
    ,KEY_F24: 135
    ,KEY_F3: 114
    ,KEY_F4: 115
    ,KEY_F5: 116
    ,KEY_F6: 117
    ,KEY_F7: 118
    ,KEY_F8: 119
    ,KEY_F9: 120
    ,KEY_FINAL: 24
    ,KEY_G: 71
    ,KEY_H: 72
    ,KEY_HANGUL: 21
    ,KEY_HANJA: 25
    ,KEY_HELP: 6
    ,KEY_HOME: 36
    ,KEY_I: 73
    ,KEY_INSERT: 45
    ,KEY_J: 74
    ,KEY_JUNJA: 23
    ,KEY_K: 75
    ,KEY_KANA: 21
    ,KEY_KANJI: 25
    ,KEY_L: 76
    ,KEY_LEFT: 37
    ,KEY_M: 77
    ,KEY_META: 224
    ,KEY_MODECHANGE: 31
    ,KEY_MULTIPLY: 106
    ,KEY_N: 78
    ,KEY_NONCONVERT: 29
    ,KEY_NUMPAD0: 96
    ,KEY_NUMPAD1: 97
    ,KEY_NUMPAD2: 98
    ,KEY_NUMPAD3: 99
    ,KEY_NUMPAD4: 100
    ,KEY_NUMPAD5: 101
    ,KEY_NUMPAD6: 102
    ,KEY_NUMPAD7: 103
    ,KEY_NUMPAD8: 104
    ,KEY_NUMPAD9: 105
    ,KEY_NUM_LOCK: 144
    ,KEY_O: 79
    ,KEY_OPEN_BRACKET: 219
    ,KEY_P: 80
    ,KEY_PAGE_DOWN: 34
    ,KEY_PAGE_UP: 33
    ,KEY_PAUSE: 19
    ,KEY_PERIOD: 190
    ,KEY_PRINT: 42
    ,KEY_PRINTSCREEN: 44
    ,KEY_Q: 81
    ,KEY_QUOTE: 222
    ,KEY_R: 82
    ,KEY_RETURN: 14
    ,KEY_RIGHT: 39
    ,KEY_S: 83
    ,KEY_SCROLL_LOCK: 145
    ,KEY_SELECT: 41
    ,KEY_SEMICOLON: 59
    ,KEY_SEPARATOR: 108
    ,KEY_SHIFT: 16
    ,KEY_SLASH: 191
    ,KEY_SLEEP: 95
    ,KEY_SPACE: 32
    ,KEY_SUBTRACT: 109
    ,KEY_T: 84
    ,KEY_TAB: 9
    ,KEY_U: 85
    ,KEY_UP: 38
    ,KEY_V: 86
    ,KEY_W: 87
    ,KEY_X: 88
    ,KEY_Y: 89
    ,KEY_Z: 90
});


/**
 * @class $.Fieldset
 */

$.Component.extend('$.Fieldset fieldset', {
	baseClasses: 'x-fieldset'
	,tag: 'fieldset'
	
	,initElement: function() {
		this.callSuper();
		this.legendEl = this.el.append('<legend>');
	}
	
	,setLegend: function(options) {
		this.legendEl.applyOptions(options);
		return this;
	}
});


/**
 * @class $.Form
 */

$.Component.extend('$.Form form', {
	tag: 'form'
	,baseClasses: 'x-form'

    ,defaultOptions: $.readOnlyObject({
        preventSubmitOnInvalid: true
        ,ajaxSubmit: true
    })

	,constructor: function() {
		this.callSuper(arguments);

        this.on('validate', function(invalidFields) {
            if (this._submitting) {
                return;
            }

            var buttons = this.queryAll('.x-button');

            $.each(buttons, function(bt) {
                if (bt.options.disableOnFormInvalid) {
                    bt.setDisabled(!!invalidFields.length);
                }
            }, this);
        });

        this.on('submit:start', function() {
            this._submitting = true;
            var buttons = this.queryAll('.x-button');
            $.each(buttons, function(bt) {
                if (bt.options.disableOnSubmitting) {
                    bt.disable();
                }
            }, this);
        });

        this.on('submit:complete', function(isValid) {
            this._submitting = false;
            var buttons = this.queryAll('.x-button');
            $.each(buttons, function(bt) {
                if (bt.options.disableOnSubmitting) {
                    bt.enable();
                }
            }, this);
        });
	}

	,initElement: function() {
		this.callSuper();
		
		var setter;
		$.each(['action', 'method'], function(name) {
			setter = 'set' + $.String.camelize(name);
			this[setter] = function(value) {
				this.el.setAttr(name, value);
				return this;
			}
		}, this);
	}
	
	,getFields: function() {
		function getFrom(comp) {
			var fields = [];
			if (comp.items) {
				$.each(comp.items, function(item) {
					if (item instanceof $.field.Field) {
						fields.push(item);
					}
					fields = fields.concat(getFrom(item));
				});
			}
			return fields;
		}
		return getFrom(this);
	}
	
	,getField: function(name /* or index */) {
		var fields = this.getFields();
		
		if ('number' == typeof name) {
			return fields[name];
		}
		
		var result;
		$.each(fields, function(field) {
			if (field.getName() == name) {
				result = field;
				return false;
			}
		});
		return result;
	}
	
	,setSubmittingMask: function(html) {
		this.on({
			'submit:start': function() {
				this.el.mask(html);
			}
			,'submit:complete': function() {
				this.el.unmask();
			}
		});
		return this;
	}
	
	,setValidateEvery: function(miliseconds) {
		if (!this._validateTask) {
			this._validateTask = new $.Task({
				interval: miliseconds
				,callback: function() {
                    this.isValid();
				}.bind(this)
			});
		}
		
		this._validateTask.stop();
		this._validateTask.interval = miliseconds;
		this._validateTask.start();
		return this;
	}
	
	,isValid: function() {
		var invalidFields = [];
		var fields = this.getFields();
		$.each(fields, function(field) {
			if (false === field.isValid()) {
				invalidFields.push(field);
			}
		});

		this.trigger('validate', invalidFields);
		if (invalidFields.length) {
			this.trigger('invalid', invalidFields);
			return false;
		}
		
		this.trigger('valid');
		return true;
	}
	
	,setValues: function(values) {
		if ('function' == typeof values.toJson) {
			values = values.toJson();
		}
		
		var value;
		$.each(this.getFields(), function(field) {
			value = values[field.getName()];
			if (undefined === value || null === value || NaN === value) {
				value = '';
			}
			field.setValue(value);
		});
		
		this._firstValues || (this._firstValues = values);
		
		return this;
	}
	
	,getValues: function() {
		var values = {};
		$.each(this.getFields(), function(field) {
			values[field.getName()] = field.getValue();
		});
		return values;
	}
	
	,setModel: function(model) {
		if (!this.bindToModel) {
			this.bindToModel = function() {
				this.model.set(this.getValues());
			}.bind(this);
			this.save = function() {
				this.model.save.apply(this.model, arguments);
			};
		}
		
		model.on('change', function() {
			this.setValues(model);
		}, this);
		this.model = model;
		
		return this;
	}
	
	,getAjaxHandler: function(options) {
		if (!this._ajaxHandler) {
			this._ajaxHandler = new $.Ajax(options);
		}
		
		this._ajaxHandler.applyOptions(options);
		return this._ajaxHandler;
	}
	
	,submit: function(options) {
		if (this.trigger('submit:before') === false) {
			return this;
		}
		
		if (this.preventSubmitOnInvalid && !this.isValid()) {
			return this;
		}
		
		options || (options = {});
		$.defaults(options, {
			url: this.el.getAttr('action') || ''
			,method: this.el.getAttr('method') || 'GET'
			,jsonData: this.getValues()
		});
		
		$.extend(options, {
			start: function() {
				this.trigger('submit:start', ajax);
			}.bind(this)

            ,complete: function() {
				this.trigger('submit:complete', ajax);
			}.bind(this)

            ,success: function() {
				this.trigger('submit:success', ajax);;
			}.bind(this)

            ,exception: function() {
				this.trigger('submit:exception', ajax);
			}.bind(this)
		});
		
		var ajax = this.getAjaxHandler(options);
		ajax.send();
	}
	
	,setPreventSubmitOnInvalid: (function() {
		var callback = function(e) {
			if (!this.isValid()) {
				e.stop();
			}
		}
		var prevented = false;
		
		return function(bool) {
			if (bool && !prevented) {
				this.el.on('submit', callback, this);
				prevented = true;
			}
			
			if (!bool && prevented) {
				this.el.un('submit', callback, this);
				prevented = false;
			}
			this.preventSubmitOnInvalid = bool;
			return this;
		}
	})()
	
	,setAjaxSubmit: (function() {
		var callback = function(e) {
			e.stop();
			this.submit();
		}
		
		var enabled = false;
		return function(bool) {
			if (bool && !enabled) {
				this.el.on('submit', callback, this);
				enabled = true;
			}
			
			if (!bool && enabled) {
				this.el.un('submit', callback, this);
				enabled = false;
			}
			return this;
		}
	})()
	
	,reset: function(toFirstValue) {
		this.el.dom.reset();
		if (false !== toFirstValue && this._firstValues) {
			this.setValues(this._firstValues);
		}
		return this;
	}
	
	,destroy: function() {
		if (this._validateTask) {
			this._validateTask.stop();
		}
		return this.callSuper(arguments);
	}
});


/**
 *
 * @class $.KeyListener
 */

$.KeyListener = $.Class.extend({
    alias: $.readOnlyObject({
        esc:        $.Event.KEY_ESCAPE
        ,enter:     $.Event.KEY_ENTER
        ,space:     $.Event.KEY_SPACE
        ,del:       $.Event.KEY_DELETE
        ,back:      $.Event.KEY_BACK_SPACE
        ,tab:       $.Event.KEY_TAB
        ,left:      $.Event.KEY_LEFT
        ,right:     $.Event.KEY_RIGHT
        ,up:        $.Event.KEY_UP
        ,down:      $.Event.KEY_DOWN
    })

    ,defaultOptions: $.readOnlyObject({
        listenOn: 'keypress'
    })

    ,constructor: function(el, options) {
        this.el = $.Element.get(el);
        this.listeners = [];
        this.initOptions(options);
    }

    ,setListenOn: function(event) {
        if (this.listenOn && this._callback) {
            this.el.un(this.listenOn, this._callback);
        }

        this.listenOn = event;
        var me = this;
        this._callback = function(e) {
            if (me.stopEvent) {
                e.stop();
            }

            var alt = e.altKey
                ,ctrl = e.ctrlKey
                ,shift = e.shiftKey
                ,key = e.key || e.charCode || e.keyCode || e.which;

            $.each(me.listeners, function(item) {
                if (item.alt && !alt || item.ctrl && !ctrl || item.shift && !shift) {
                    return;
                }

                if (undefined !== item.key) {
                    if (item.key != key) {
                        return;
                    }
                }

                item.callback.call(item.scope || null, e);
            }, me);
        }

        this.el.on(this.listenOn, this._callback);
    }

    ,on: function(options, callback, scope) {
        if( 'number' == typeof options) {
            this.listeners.push({
                key: options
                ,callback: callback
                ,scope: scope
            });
        } else if ('string' != typeof options) {
            this.listeners.push(options);
        } else {
            var _options;

            options = options.split(',');
            $.each(options, function(option) {
                _options = {};
                option = option.trim().split(/\s+/);
                option = $.Array(option);

                _options.alt = option.has('alt');
                _options.ctrl = option.has('ctrl');
                _options.shilft = option.has('shift');

                option.remove('alt', 'ctrl', 'shift');

                var key = option[0];
                if (undefined !== key) {
                    if (undefined !== this.alias[key.toLowerCase()]) {
                        key = this.alias[key];
                    }

                    if (!(/\d/.test(key))) {
                        key = key.charCodeAt(0);
                    }
                    _options.key = key;
                }

                _options.callback = callback;
                _options.scope = scope;

                this.on(_options);
            }, this);
        }
        return this;
    }

    ,setStopEvent: function(bool) {
        this.stopEvent = bool;
        return this;
    }

    ,setEsc: function(callback, scope) {
        return this.on(this.alias.esc, callback, scope);
    }

    ,setEnter: function(callback, scope) {
        return this.on(this.alias.enter, callback, scope);
    }

    ,setSpace: function(callback, scope) {
        return this.on(this.alias.space, callback, scope);
    }

    ,setDel: function(callback, scope) {
        return this.on(this.alias.del, callback, scope);
    }

    ,setBack: function(callback, scope) {
        return this.on(this.alias.back, callback, scope);
    }

    ,setTab: function(callback, scope) {
        return this.on(this.alias.tab, callback, scope);
    }

    ,setLeft: function(callback, scope) {
        return this.on(this.alias.left, callback, scope);
    }

    ,setRight: function(callback, scope) {
        return this.on(this.alias.right, callback, scope);
    }

    ,setUp: function(callback, scope) {
        return this.on(this.alias.up, callback, scope);
    }

    ,setDown: function(callback, scope) {
        return this.on(this.alias.down, callback, scope);
    }
});


/**
 * @class $.Loader
 */

$.Observable.extend('$.Loader', {
	load: function(className) {
		var c = $.getClass(className);
		
		if (c) {
			return c;
		}
		
		var parts = className.split('.');
		
		var path = $.Loader.paths[parts[0]];
		path += '/' + parts.join('/') + '.js';
		var content;
		var ajax = new $.Ajax({
			url: path
			,async: false
			,success: function(responseText, xhr) {
				content = responseText;
				
				/*var scriptTag = document.createElement('script');
				scriptTag.innerHTML = responseText;
				document.head.appendChild(scriptTag);*/
			}
		});
		
		ajax.send();
		
		eval(content);
		
		return $.getClass(className);
	}
});
$.Loader.paths = {Js: '/assets/src'}
$.Loader.addPath = function(prefix, path) {
	$.Loader.paths[prefix] = path;
}
;


/**
 * @class $.Loading
 */

$.Component.extend('$.Loading', {
    baseClasses: 'x-loading'

    ,initElement: function() {
        this.callSuper();

        this.spinnerEl = this.append({
            classes: 'x-spinner'
        });

        this.messageEl = this.append({
            dom: '<span>'
            ,classes: 'x-message'
        });

        for (var i = 0; i < 12; i ++) {
            this.spinnerEl.append({
                styles: {
                    transform: 'rotate(' + (i * 30) + 'deg) translate(0, -142%)'
                    ,animationDelay: (0.08333333333333333 * i) + 's'
                }
            });
        }
    }

    ,setDuration: function(duration) {
        var delay = 0.08333333333333333 * duration;

        this.spinnerEl.children().each(function(el) {
            el.setStyles({
                animationDuration: duration + 's'
                ,animationDelay: (delay * el.index()) + 's'
            });
        });
        return this;
    }

    ,setColor: function(color) {
        this.spinnerEl.children().each(function(el) {
            el.setStyles({
                background: color
            });
        });
        return this;
    }

    ,setMessage: function(message) {
        if ('string' == typeof message) {
            message = {html: message};
        }
        this.messageEl.applyOptions(message);
        return this;
    }

    ,setSize: function(size) {
        this.spinnerEl.setSize(size);
        return this;
    }
});


/**
 * @class $.Menu
 */

$.List.extend('$.Menu menu', {
	baseClasses: 'x-list x-menu'
	,defaultChildType: 'menu.item'

    ,initElement: function() {
        this.callSuper();

        this.el.setKeyListener({
            up: this.focusPrev.bind(this)
            ,down: this.focusNext.bind(this)
            ,stopEvent: true
        });
    }

    ,getFocused: function() {
        var focused = this.el.query('> li > a:focus');
        if (focused) {
            var el = focused.getParent('.x-menu-item');
            return el.dom.$comp;
        }
    }

    ,focusNext: function() {
        var focused = this.getFocused()
            ,next;

        if (focused) {
            next = focused.getNext();
        }

        if (!next) {
            next = this.child(0);
        }

        next.el.query('> a').focus();
        return this;
    }

    ,focusPrev: function() {
        var focused = this.getFocused()
            ,prev;

        if (focused) {
            prev = focused.getPrev();
        }

        if (!prev) {
            prev = this.lastChild();
        }

        prev.el.query('> a').focus();
        return this;
    }

    ,setHideGutter: function(bool) {
        this.switchClasses(bool, 'x-hide-gutter');
        return this;
    }
});


/**
 * @class $.MenuBar
 */

$.Component.extend('$.MenuBar', {
	baseClasses: 'x-menubar menubar'
});


/**
 * @class $.Modal
 */

$.Component.extend('$.Modal modal', {
    baseClasses: 'x-modal'

    ,initElement: function() {
        this.callSuper();
        this.el.hide();
    }
    ,show: function() {
        this.el.show();

        if (!this._wrapEl) {
            this._wrapEl = this.el.wrap({
                classes: 'x-inner'
            }).wrap({
                classes: 'x-modal-wrap x-hidden'
            });

            var me = this;
            this._wrapEl.on({
                show: function() {
                    me.trigger('show', me);
                }
                ,hide: function() {
                    me.trigger('hide', me);
                }
            });
        }

        if (!this._wrapEl.isRendered()) {
            document.body.appendChild(this._wrapEl.dom);
        }

        this._wrapEl.show();
        return this;
    }

    ,hide: function() {
        this._wrapEl.hide();

        return this;
    }

    ,setListeners: function() {
        this.callSuper(arguments);

    }
});


/**
 * @class $.Model
 */

$.Observable.extend('$.Model', {
	url: ''
	,idProperty: 'id'

	,constructor: function(data, options) {
		this._data = data? data : {};
        this.callSuper([options]);
	}
	
	,id: function(value) {
		if (undefined === value) {
			return this.get(this.idProperty);
		}
		
		return this.set(this.idProperty, value);
	}
	
	,isNew: function() {
		return this.id() === undefined;
	}
	
	,get: function(name) {
		return this._data[name];
	}
	
	,set: function(name, value) {
		if (undefined === value) {
			for (var i in name) {
				this.set(i, name[i]);
			}
		} else {
			this._data[name] = value;
			this.trigger('change', name, value);
			this.trigger('change:' + name, value);
			this.trigger('change:*', name, value);
		}
		
		return this;
	}
	
	,escape: function(name) {
		return $.escape(this.get(name));
	}
	
	,getAjax: function() {
		if (!this._ajax) {
			this._ajax = new $.Ajax();
			this._ajax.on('exception', function(xhr, ajax) {
				this.trigger('exception', xhr.statusText, xhr, ajax, this);
			}, this);
		}
		return this._ajax;
	}
	
	,load: function(options) {
        options || (options = {});

        if ('function' == typeof options) {
            options = {callback: options}
        }

        options.url || (options.url = this.url + '/' + this.id());
		var ajax = this.getAjax()
            ,me = this;

        options.success =  function(responseText) {
            var data = JSON.parse(responseText);
            me.set(data);
            me.trigger('load', data, me);

            if (options.callback) {
                options.callback.call(me, data, me);
            }
        }
        ajax.send(options);
		return this;
	}
	
	,save: function(url) {
		if (!url) {
			url = this.url;
			if (this.id()) {
				url += '/' + this.id();
			}
		}
		
		var ajax = this.getAjax();
		var me = this;
		ajax.send({
			url: url
			,method: this.isNew()? 'POST' : 'PUT'
			,jsonData: this._data 
			,success: function(responseText) {
				var data = JSON.parse(responseText);
				me.set(data);
				me.trigger('save', me);
			}
		});
		return this;
	}
	
	,destroy: function(url) {
		url || (url = this.url + '/' + this.id());
		var ajax = this.getAjax();
		var me = this;
		ajax.send({
			url: url
			,method: 'DELETE'
			,success: function() {
				me.trigger('destroy', me.id(), me);
			}
		});
		return this;
	}
	
	,toJson: function() {
		return this._data;
	}
});


/**
 * @class $.NavBar
 */

$.Component.extend('$.NavBar navbar', {
	baseClasses: 'x-navbar'

	,initElement: function() {
		this.callSuper();

		this.innerComponent = this.add({
			'classes': 'x-navbar-inner'
		});
	}
	
	,add: function() {
		if (!this.innerComponent) {
			return this.callSuper(arguments);
		}
		var c = this.innerComponent.add.apply(this.innerComponent, arguments);
		return c;
	}

    ,setFixed: function(bool) {
        this.switchClasses(bool, 'x-fixed');
        return this;
    }
});


/**
 * @class $.Notify
 */

$.Alert.extend('$.Notify notify', {
    baseClasses: 'x-notify x-alert'

    ,defaultOptions: $.readOnlyObject({
        appendTo: 'body'
        ,hidden: true
        ,hideDelay: 5000
    })

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('show', function() {
            this.updatePosition();
        });
    }

    ,setPosition: function(position) {
        this.position = position;
        return this;
    }

    ,updatePosition: function() {
        if (!this.position) {
            return this;
        }

        var pos = {
            top: 'auto'
            ,right: 'auto'
            ,bottom: 'auto'
            ,left: 'auto'
        };

        var position = this.position;

        if ('string' != typeof position) {
            (position instanceof Array) || (position = [position]);
            pos.top = position[0];
            pos.left = position[1];
        } else {
            position = position.split(' ');

            if (position[0] == 'center') {
                pos.top = ((window.innerHeight - this.getHeight()) / window.innerHeight * 50) + '%';
            } else {
                pos[position[0]] = 0;
            }

            if (position[1] == 'center') {
                pos.left = ((window.innerWidth - this.getWidth()) /window.innerWidth * 50) + '%';
            } else {
                pos[position[1]] = 0;
            }
        }

        for (var i in pos) {
            if ('number' == typeof pos[i]) {
                pos[i] = pos[i] + 'px';
            }
        }

        this.setStyles(pos);

        return this;
    }

    ,setHideDelay: function(miniseconds) {
        if (this.isVisible()) {
            $.Function.defer(this.hide.bind(this), miniseconds);
        }
        this.on('show', function() {
            $.Function.defer(this.hide.bind(this), miniseconds);
        });
    }
});


/**
 * @class $.Paging
 */

$.Class.extend('$.Paging', {
    totalItem: 1
    ,currentPage: 1
    ,itemPerPage: 10

    ,setTotalItem: function(total) {
        total = parseInt(total);
        if (isNaN(total)) {
            total = 0;
        }

        if (total === this.totalItem) {
            return this;
        }

        this.totalItem = total;

        this.trigger('pagingchange:total', total, this);

        this.goToFirstPage();
        return this;
    }

    ,setCurrentPage: function(number) {
        number = parseInt(number);
        if (isNaN(number)) {
            number = 0;
        }
        this.currentPage = number;
        return this;
    }

    ,setItemPerPage: function(number) {
        number = parseInt(number);
        if (isNaN(number)) {
            number = 0;
        }
        this.itemPerPage = number;
        return this;
    }

    ,getTotalPage: function() {
        if (!this.totalItem) {
            return 0;
        }

        return Math.ceil(this.totalItem / this.itemPerPage);
    }

    ,isFirstPage: function() {
        if (!this.totalItem) {
            return;
        }
        return this.currentPage == 1;
    }

    ,isLastPage: function() {
        if (!this.totalItem) {
            return;
        }

        return this.currentPage == this.getTotalPage();
    }

    ,goToPage: function(page, callback, scope) {
        page = parseInt(page);
        if (isNaN(page) || page <= 0) {
            page = 1;
        } else {
            var totalPage = this.getTotalPage();
            if (page > totalPage) {
                page = totalPage;
            }
        }

        if (callback) {
            callback.call(scope || null, page, this);
        }

        this.currentPage = page;

        this.trigger('pagingchange', page, this);

        return this;
    }

    ,goToNextPage: function(callback, scope) {
        if (this.currentPage == this.getTotalPage()) {
            return this;
        }

        return this.goToPage(this.currentPage + 1, callback, scope);
    }

    ,goToPrevPage: function(callback, scope) {
        if (this.currentPage == 1) {
            return this;
        }

        return this.goToPage(this.currentPage - 1, callback, scope);
    }

    ,goToFirstPage: function(callback, scope) {
        if (this.currentPage == 1) {
            return this;
        }

        return this.goToPage(1, callback, scope);
    }

    ,goToLastPage: function(callback, scope) {
        var totalPage = this.getTotalPage();
        if (this.currentPage == totalPage) {
            return this;
        }

        return this.goToPage(totalPage, callback, scope);
    }

    ,refreshPage: function() {
        return this.goToPage(this.currentPage);
    }
});



/**
 * @class $.Paginator
 */

$.Component.extend('$.Paginator paginator', {
    baseClasses: 'x-paginator'
    ,defaultChildType: 'button'
    ,includes: [$.Paging]
    ,infoHtml: 'Displaying page {currentPage} of {totalPage} pages, {startIndex} - {endIndex} of {totalItem} items'

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('pagingchange', function(page) {
            this.input.setValue(page);

            if (this.isFirstPage()) {
                this.firstBt.disable();
                this.prevBt.disable();
                this.nextBt.enable();
                this.lastBt.enable();
            } else if (this.isLastPage()) {
                this.firstBt.enable();
                this.prevBt.enable();
                this.nextBt.disable();
                this.lastBt.disable();
            } else {
                this.firstBt.enable();
                this.prevBt.enable();
                this.nextBt.enable();
                this.lastBt.enable();
            }
        }.bind(this));

        this.on('pagingchange pagingchange:total', function() {
            this.updatePagingInfo();
        }.bind(this));

        this.on('pagingchange:total', function(total) {
            this.input.setDisabled(!total);
        }.bind(this));
    }

    ,initElement: function() {
        this.callSuper();

        var me = this;
        this.firstBt = this.add({
            classes: 'x-first'
            ,icon: 'step-backward'
            ,disabled: true
            ,click: function() {
                me.goToFirstPage();
            }
        });

        this.prevBt = this.add({
            classes: 'x-prev'
            ,icon: 'chevron-left'
            ,disabled: true
            ,click: function() {
                me.goToPrevPage();
            }
        });

        this.input = this.add({
            xtype: 'field.text'
            ,classes: 'x-input'
            ,disabled: true
            ,listeners: {
                change: function() {
                    me.goToPage(this.getValue());
                }
            }
        });

        this.nextBt = this.add({
            classes: 'x-next'
            ,icon: 'chevron-right'
            ,scale: 'small'
            ,disabled: true
            ,click: function() {
                me.goToNextPage();
            }
        });

        this.lastBt = this.add({
            classes: 'x-last'
            ,icon: 'step-forward'
            ,scale: 'small'
            ,disabled: true
            ,click: function() {
                me.goToLastPage();
            }
        });

        this.info = this.add({
            xtype: 'component'
            ,classes: 'x-info'
        });
    }

    ,updatePagingInfo: function() {
        var cur = this.currentPage
            ,per = this.itemPerPage
            ,startIndex = (cur - 1) * per + 1;

        var info = {
                currentPage: cur
                ,totalPage: this.getTotalPage()
                ,startIndex: startIndex
                ,endIndex: startIndex + per - 1
                ,totalItem: this.totalItem
            };

        this.info.setHtml($.String.format(this.infoHtml, info));
        return this;
    }
});


/**
 * @class $.ProgressBar
 */

$.Component.extend('$.ProgressBar progressbar', {
    baseClasses: 'x-progressbar'
    
    ,constructor: function(options) {
        options = $.extend({
            width: 200 
        }, options);
        
        this.callSuper([options]);
    }

    ,initElement: function() {
        this.callSuper();

        this.textBackEl = this.el.append({
            classes: 'x-progressbar-text-back'
        });

        this.barEl = this.el.append({
            classes: 'x-progressbar-bar'
        });

        this.textEl = this.barEl.append({
            classes: 'x-progressbar-text'
            ,width: this.el.getWidth()
        });
    }

    ,setWidth: function() {
        this.el.setWidth.apply(this.el, arguments);
        this.textEl.setWidth.apply(this.textEl, arguments);
        return this;
    }

    ,setPercentage: function(percentage) {
        this.percentage = percentage;
        this.barEl.setWidth(percentage + '%');
        return this;
    }

    ,setStriped: function(bool) {
        this.switchClasses(bool, 'x-progressbar-striped');
        return this;
    }

    ,setAnimate: function(bool) {
        this.switchClasses(bool, 'x-progressbar-animate');
        return this;
    }

    ,setTransition: function() {
        this.switchClasses(bool, 'x-progressbar-transition');
        return this;
    }

    ,setHtml: function(html) {
        if (undefined !== html) {
            this.html = html;
        }

        html = $.String.format(html, Math.round(this.percentage) + '%');
        this.textBackEl.setHtml(html);
        this.textEl.setHtml(html);

        return this;
    }

    ,setLoop: function(options) {
        if (false === options) {
            if (this.progressTask) {
                this.progressTask.stop();
            }
            return this;
        }

        if (true === options) {
            if (this.progressTask) {
                this.progressTask.start();
                return this;
            }
            options = {};
        } else if ('number' == typeof options) {
            options = {count: options};
        }

        if (this.progressTask) {
            this.progressTask.stop();
        }

        options = $.extend({
            duration: 5000
            ,count: 1
        }, options);


        var step = 2000 / options.duration;

        this.percentage || (this.percentage = 0);

        var task = this.progressTask = new $.Task({
            interval: 20
            ,callback: function() {
                this.setPercentage(this.percentage)
                    .setHtml(this.html || '{0}');

                if (this.percentage > 100) {
                    options.count--;
                    this.percentage = 0;
                }

                if (options.count == 0) {
                    this.setAnimate(false);
                    task.stop();
                    return;
                }

                this.percentage += step;
            }.bind(this)
        });

        task.start();

        return this;
    }
});
/**
 * @class $.ReadOnlyObject
 */

$.ReadOnlyObject = function(values) {
    var obj = {};
    for (var i in values) {
        if ('prototype' != i && values.hasOwnProperty(i)) {
            Object.defineProperty(obj, i, {
                value: values[i]
                ,writeable: false
            })
        }
    }
    return obj;
}
;


/**
 * @class $.Router
 */

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


/**
 * @class $.Section
 */

$.Component.extend('$.Section section', {
    tag: 'section'
    ,baseClasses: 'x-section'

    ,initElement: function() {
        this.callSuper();

        this.headerComponent = this.add({
            dom: '<header>'
            ,classes: 'x-header'
        });

        this.bodyComponent = this.add({
            dom: '<div>'
            ,classes: 'x-body'
        });
    }

    ,setHeader: function(options) {
        options || (options = {});
        if ('string' == typeof options) {
            options = {html: options};
        }

        this.headerComponent.applyOptions(options);
        return this.headerComponent;
    }

    ,setBody: function(options) {
        options || (options = {});
        if ('string' == typeof options) {
            options = {html: options};
        }

        this.bodyComponent.applyOptions(options);
        return this.bodyComponent;
    }

    ,setCollapsible: function(bool) {
        if (bool) {
            if (!this._collapsibleCallback) {
                this._collapsibleCallback = function() {
                    var isCollapsed = this.isCollapsed();

                    if (bool == 'radio') {
                        this.deRadioClasses('x-collapsed');
                        this.removeClasses('x-collapsed');
                    } else if (bool == 'checkbox') {
                        this.toggleClasses('x-collapsed');
                        if (isCollapsed) {
                            this.deRadioClasses('x-collapsed');
                        }
                    } else {
                        this.toggleClasses('x-collapsed');
                    }

                    this.trigger('toggleCollapse', isCollapsed);
                }.bind(this)
            }

            this.headerComponent.on('click', this._collapsibleCallback);
        } else {
            if (this._collapsibleCallback) {
                this.headerComponent.un('click', this._collapsibleCallback);
            }
        }
        return this;
    }

    ,setCollapsed: function(bool) {
        if (!this._collapsibleCallback) {
            this.setCollapsible(true);
        }

        this.switchClasses(bool, 'x-collapsed');

        return this;
    }

    ,isCollapsed: function() {
        return this.hasClasses('x-collapsed');
    }
});


/**
 * @class $.Slider
 */

$.Component.extend('$.Slider slider', {
    baseClasses: 'x-slider'

    ,defaultOptions: $.readOnlyObject({
        direction: 'horizontal'
        ,step: 1
        ,min: 0
        ,max: 100
        ,value: 0
    })

    ,constructor: function() {
        this.callSuper(arguments);
        this.onRender(this.updatePosition.bind(this));
    }

    ,initElement: function() {
        this.callSuper();

        this.sliderRule = this.el.append({
            classes: 'x-rule'
            ,listeners: {
                click: function(e) {
                    if (e.target != this.sliderThumb.dom) {
                        this.movedTo(e.getOffset(this.sliderRuleInner));
                    }
                    this.sliderThumb.focus();
                }.bind(this)
            }
        });

        this.sliderRuleInner = this.sliderRule.append({
            classes: 'x-inner'
        });

        this.sliderRuleBar = this.sliderRuleInner.append({
            classes: 'x-bar'
        });

        this.sliderThumb = this.sliderRule.append({
            classes: 'x-thumb'
            ,focusable: true
            ,draggable: {
                constrain: true
                ,listeners: {
                    drag: function(e) {
                        this.movedTo(e.getOffset(this.sliderRuleInner), false);
                    }.bind(this)
                }
            }
            ,keyListener: {
                listenOn: 'keypress'
                ,stopEvent: true
                ,right: this.goNext.bind(this)
                ,up:    this.goNext.bind(this)
                ,left:  this.goPrev.bind(this)
                ,down:  this.goPrev.bind(this)
            }
        });

        var inputWrapEl = this.append({
            classes: 'x-input-wrap'
        });

        this.inputEl = inputWrapEl.append({
            dom: '<input>'
            ,classes: 'x-input'
            ,attr: {
                type: 'text'
            }
            ,listeners: {
                focus: function(e) {
                    this.select();
                }

                ,change: function(e, el) {
                    this.setValue(el.getValue());
                }.bind(this)
            }
        })

        this.trigger('render:input');
    }

    ,setWidth: function(value) {
        if (this.direction == 'vertical') {
            return this.setHeight(value);
        }
        return this.callSuper([value]);
    }

    ,setMin: function(value) {
        this.min = value;
        return this;
    }

    ,setMax: function(value) {
        this.max = value;
        return this;
    }

    ,movedTo: function(xy) {
        var pos = 'horizontal' == this.direction? xy.x : this.sliderRuleInner.getHeight() - xy.y;
        var ratio = (this.max - this.min) / this.sliderRuleInner['horizontal' == this.direction? 'getWidth' : 'getHeight']();;
        var value = ratio * pos + this.min;

        this.setValue(value);
    }

    ,updatePosition: function() {
        var value = this.getValue();
        var pos = ((value - this.min) / (this.max - this.min) * 100);

        if ('horizontal' == this.direction) {
            this.sliderRuleBar.setWidth(pos + '%');
            this.sliderThumb.setLeft(pos + '%');
        } else {
            this.sliderRuleBar.setHeight(pos + '%');
            this.sliderThumb.setTop((100 - pos) + '%');
        }

    }

    ,setValue: function(value) {
        value = Math.round(value / this.step) * this.step;

        (value > this.min) || (value = this.min);
        (value < this.max) || (value = this.max);

        this.callSuper([value]);

        this.inputEl.setValue(value);

        this.updatePosition();

        var oldValue = this.getValue();
        if (oldValue !== value) {
            this.trigger('change', value, oldValue);
        }
        return this;
    }

    ,getValue: function() {
        var value = parseInt(this.callSuper());
        return isNaN(value)? 0 : value;
    }

    ,setStep: function(value) {
        this.step = value;
        return this;
    }

    ,setDirection: function(direction) {
        this.direction = direction;
        this.addClasses('x-' + direction);

        if ('horizontal' == direction) {
            this.sliderThumb.drag.setLockX(false).setLockY(true);
        } else {
            this.sliderThumb.drag.setLockX(true).setLockY(false);
        }

        return this;
    }

    ,setInput: function(options) {
        this.callSuper(arguments);
        if (undefined !== options.width) {
            this.sliderEl.setWidth(options.width);
        }
    }

    ,goNext: function() {
        return this.setValue(this.getValue() + this.step);
    }

    ,goPrev: function() {
        return this.setValue(this.getValue() - this.step);
    }
});


/**
 * @class $.Tab
 */

$.Component.extend('$.Tab tab', {
    tag: 'article'
    ,baseClasses: 'x-tab'
    ,defaultChildType: 'section'

    ,constructor: function(options) {
        options = $.extend({
            defaults: {
                collapsible: 'radio'
                ,collapsed: true
            }
            ,activeItem: 0
        }, options || {}, true);

        this.callSuper([options]);
    }

    ,setActiveItem: function(tab) {
        if (this._isInitItem) {
            if ('number' == typeof tab) {
                tab = this.child(tab);
            }

            tab.setCollapsed(false);
        } else {
            this.on('inititem', function() {
                this.setActiveItem(tab);
            });
        }
    }

    ,getActiveItem: function() {
        return this.query('> :not(.x-collapsed)');
    }
});


/**
 * @class $.Table
 */

$.List.extend('$.Table table', {
    tag: 'table'
    ,baseClasses: 'x-list x-table'

    ,defaultOptions: $.readOnlyObject({
        striped: true
    })

    ,initElement: function() {
        this.callSuper();

        this.headerComponent = this.add(new $.table.Header(this));
        this.bodyComponent = this.add(new $.table.Body(this));

    }

    ,setColumns: function(columns) {
        this.columns = [];

        $.each(columns, function(options) {
            options.xtype || (options.xtype = 'table.column');

            this.columns.push(new ($.alias(options.xtype))(this, options));
        }, this);

        this.headerComponent.add(this.columns);
    }

    ,setData: function(data) {
        this.bodyComponent.setData(data);
        return this;
    }

    ,setCollection: function(collection) {
        this.bodyComponent.setCollection(collection);

        if (this.maskOnLoad) {
            collection.on('load:start', function() {
                this.mask('boolean' == typeof this.maskOnLoad? 'Loading...' : this.maskOnLoad);
            }, this);

            collection.on('load:complete', function() {
                this.unmask();
            }, this);
        }

        return this;
    }

    ,setMaskOnLoad: function(mask) {
        this.maskOnLoad = mask;
    }

    ,setStriped: function(bool) {
        return this.switchClasses(bool, 'x-striped');
    }
});


/**
 * @class $.Task
 */

$.Observable.extend('$.Task', {
	interval: 500

	,start: function() {
		this._intervalId = setInterval(this.callback, this.interval);
		return this;
	}

    ,setInterval: function(interval) {
        this.interval = interval;
        return this;
    }

    ,setCallback: function(callback) {
        this.callback = callback;
        return this;
    }
	
	,stop: function() {
		clearInterval(this._intervalId);
		return this;
	}
});

$.extend($.Task, {
	start: function(options) {
		var task = new $.Task(options);
		task.start();
		return task;
	}
	,stop: function(task) {
		task.stop();
		return task;
	}
});


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


/**
 * @class $.Tip
 */

$.Component.extend('$.Tip tip', {
	baseClasses: 'x-tip'
	
	,setTarget: function(el) {
		this.targetEl = el;
		return this;
	}
	
	,setDisplayOn: function(displayOn) {
		this.targetEl.on(displayOn, function() {
			this.show();
		}, this);
	}
});


/**
 * @class $.Tree
 */

$.List.extend('$.Tree tree', {
    baseClasses: 'x-list x-tree'
    ,defaultChildType: 'tree.item'

    ,getSelection: function(bool) {
        var query = bool !== false? '.x-tree-item.x-selected' : ':not(.x-tree-item.x-selected)';
        return this.queryAll(query);
    }
});
/**
 * @class $.Util
 */

$.Util = {
	buildUrl: function(obj, url) {
		var query = [];
		for (var i in obj) {
			query.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}
		query = query.join('&');


        if (undefined !== url) {
            url += '';
            if (url === '') {
				query = '?' + query;
			}else if (-1 == url.indexOf('?')) {
				url += '?'
			} else if (url[url.length - 1] != '?') {
				url += '&';
			}
			query = url + query;
		}
		
		return query;
	}
};
/**
 * @class $.Validator
 */

$.Observable.extend('$.Validator', {
	getValue: $.emptyFn
	,validate: $.emptyFn

	,setEvery: function(miliseconds) {
		if (this._task) {
			this._task.stop();
		} else {
			this._task = new $.Task({
				callback: this.isValid.bind(this)
			});
		}
		
		this._task.interval = miliseconds;
		this._task.start();
		
		return this;
	}

    ,setField: function(field) {
        this.field = field;
        return this;
    }

    ,setGetValue: function(fn) {
        this.getValue = fn;
        return this;
    }

    ,setCallback: function(fn) {
        this.callback = fn;
        return this;
    }

    ,setValidCallback: function(fn) {
        this.validCallback = fn;
        return this;
    }

    ,setInvalidCallback: function(fn) {
        this.invalidCallback = fn;
        return this;
    }

	,isValid: function() {
		var isValid = this.validate();
		
		if (this.callback) {
			this.callback(isValid, this);
		}
		
		if (this.validCallback && isValid) {
			this.validCallback(this);
		}
		
		if (this.invalidCallback && !isValid) {
			this.invalidCallback(this);
		}
		return isValid;
	}
	
	,getMessages: function() {
		return this.messages;
	}
});

$.Validator.types = {};

/**
 * @class $.button.Group
 */

$.Component.extend('$.button.Group button.group', {
    baseClasses: 'x-button-group'
    ,defaultChildType: 'button'

    ,constructor: function(options) {
        options = $.extend({
            scale: 'small'
        }, options);

        this.callSuper([options]);
    }
    
    ,setScale: function(scale) {
        $.each(this.children(), function(button) {
            button.setScale(scale);
        });

        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.scale = scale;

        return this;
    }

    ,setToggleable: function(bool) {
        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.toggleable = bool;

        $.each(this.children(), function(button) {
            button.setToggleable(bool);
        });
        return this;
    }

    ,setRadioable: function(bool) {
        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.radioable = bool;

        $.each(this.children(), function(button) {
            button.setRadioable(bool);
        });
        return this;
    }
});


/**
 * @class $.drag.Anywhere
 */

$.Drag.extend('$.drag.Anywhere', {
    constructor: function() {
        this.callSuper(arguments);

        this.on('start', function() {
            if (this._constrainTo) {
                this.setConstrain(this._constrainTo);
            }
        });

        this.on('drag', function() {
            var x = this.x
                y = this.y;

            if (this.constrain) {
                var ct = this.constrain;

                if (!this.lockX) {
                    var elWidth = this.el.getWidth();

                    if (ct.xMin > x) {
                        x = ct.xMin;
                    } else if (ct.xMax < x + elWidth) {
                        x = ct.xMax - elWidth;
                    }
                }

                if (!this.lockY) {
                    var elHeight = this.el.getHeight();

                    if (ct.yMin > y) {
                        y = ct.yMin;
                    } else if (ct.yMax < y + elHeight) {
                        y = ct.yMax - elHeight;
                    }
                }
            }

            if (!this.lockX) {
                this.el.setLeft(x);
            }

            if (!this.lockY) {
                this.el.setTop(y);
            }
        });
    }

    ,initElement: function() {
        this.callSuper(arguments);
        this.el.addClasses('x-anywhere');
    }

    ,setConstrain: function(to) {
        this._constrainTo = to;

        if (to === true) {
            to = this.el.getParent();
            var position = to.getStyle('position');
            if(position == 'relative' || position == 'absolute') {
                var toLeft = 0;
                var toTop = 0;
            }
        }
        var ct = {};
        if (to instanceof $.Component || to instanceof $.Element) {
            ct.xMin = undefined != toLeft? toLeft: to.getLeft();
            ct.xMax = ct.xMin + to.getWidth();

            ct.yMin = undefined != toTop? toTop: to.getTop();
            ct.yMax = ct.yMin + to.getHeight();
        } else if (to instanceof Array) {
            ct.xMin = to[0];
            ct.xMax = to[1];
            ct.yMin = to[2];
            ct.yMax = to[3];
        }

        this.constrain = ct;
        return this;
    }
        
});


/**
 * @class $.field.Field
 */

$.Component.extend('$.field.Field', {
	baseClasses: 'x-field'

    ,on: function(eventName) {
        if ('change' == eventName) {
            this.inputEl.on.apply(this.inputEl, arguments);
        } else {
            this.callSuper(arguments);
        }
        return this;
    }

    ,initElement: function() {
        this.callSuper();
        this.fieldWrap = this.add({
            classes: 'x-wrap'
        });
    }

	,setName: function(name) {
		this.inputEl.setAttr('name', name);
		return this;
	}

	,getName: function() {
		return this.inputEl.getAttr('name');
	}

	,setValue: function(value) {
        var oldValue = this.getValue();
        if (oldValue === value) {
            return this;
        }
		this.inputEl.dom.value = value;
        this.trigger('change', value, oldValue);
		return this;
	}

	,getValue: function() {
		return this.inputEl.dom.value;
	}

	,setInput: function(options) {
		this.inputEl.applyOptions(options);
		return this;
	}

    ,setDisabled: function(bool) {
        this.inputEl.switchAttr(bool, 'disabled');
    }

    ,enable: function() {
        return this.setDisabled(false);
    }

    ,disable: function() {
        return this.setDisabled(true);
    }
	
	,setValidates: function(validates) {
		this.validators = [];
		
		(validates instanceof Array) || (validates = [validates]);
		$.each(validates, function(validate) {
			('string' != typeof validate) || (validate = {type: validate});
			var options = $.defaults(
				validate, {
					field: this
                    ,getValue: this.getValue.bind(this)

                    ,callback: function(isValid, validator) {
						this.trigger('validate', isValid, validator);
					}.bind(this)

                    ,validCallback: function(validator) {
						this.trigger('valid', validator);
					}.bind(this)

                    ,invalidCallback: function(validator) {
						this.trigger('invalid', validator);
					}
				}
			);

			var validator = new $.Validator.types[validate.type](options);
			this.validators.push(validator);
		}, this); 
	}
	
	,isValid: function() {
		if (!this.validators) {
			return true;
		}
		
		var isValid = true;
		$.each(this.validators, function(validator) {
			if (false === validator.isValid()) {
				isValid = false;
				return false;
			}
		}, this);

		return isValid;
	}

    ,focus: function() {
        this.inputEl.dom.focus();
        return this;
    }
});
/**
 * @class $.field.mixins.Labelable
 */

$.define('$.field.mixins.Labelable', {
    setLabel: function(options) {
        if ('string' == typeof options) {
            options = {html: options};
        }

        if (!this.labelEl) {
            this.labelEl = this.el.insert(0, {
                dom: '<label>'
                ,classes: 'x-label'
            });

            this.labelEl.setAlign = function(align) {
                switch (align) {
                    case 'top':
                        this.setStyles('display', 'block');
                        break;

                    case 'left':
                        this.setStyles('display', 'inline-block');
                        break;
                }
            }
        }
        this.labelEl.applyOptions(options);
        return this;
    }
});
/**
 * @class $.field.mixins.BoxLabelable
 */

$.define('$.field.mixins.BoxLabelable', {
    setBoxLabel: function(options) {
        if ('string' == typeof options) {
            options = {html: options};
        }

        if (!this.boxLabelEl) {
            this.addClasses('x-boxlabelable');
            this.boxLabelEl = new $.Element({
                dom: '<label>'
                ,classes: 'x-box-label'
            });

            this.boxLabelEl.insertAfter(this.inputEl);
        }
        this.boxLabelEl.applyOptions(options);
        return this;
    }
});




/**
 * @class $.field.Checkbox
 */

$.field.Field.extend('$.field.Checkbox field.checkbox', {
	baseClasses: 'x-field x-field-checkbox'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.BoxLabelable
    ]

	,checkedValue: 1
	,uncheckedValue: 0
	
	,initElement: function() {
		this.callSuper();
		var input = this.fieldWrap.add({
            tag: 'input'
            ,attr: {
                type: 'checkbox'
            }
        });
		this.inputEl = input.el;
		this.inputEl.setWidth = this.inputEl.setHeight = $.emptyFn;
	}
	
	,setValue: function(value) {
		this.inputEl.dom.checked = !!value;
		return this;
	}
	
	,getValue: function() {
		return this.inputEl.dom.checked? this.checkedValue : this.uncheckedValue;
	}

    ,isChecked: function() {
        return this.inputEl.dom.checked;
    }
	
	,setChecked: function(bool) {
		this.inputEl.dom.checked = !!bool;
		return this;
	}

    ,setCheckedValue: function(value) {
        this.checkedValue = value;
        return this;
    }

    ,setUncheckedValue: function(value) {
        this.uncheckedValue = value;
        return this;
    }
});
/**
 * @class $.field.plugins.ValidateIndicator
 */

$.define('$.field.plugins.ValidateIndicator', {
	constructor: function(field) {
        if (field.isRenderd) {
            render();
        } else {
            field.on('render:input', function() {
                render();
            });
        }

        var render = function() {
            var el = field.el.append('<span>');
            el.addClasses('x-field-validate-indicator');

            var tip = new $.Tip({
                target: el
                ,displayOn: 'hover'
            });
            tip.el.hide();
            el.append(tip.el);

            field.on('validate', function(isValid, validator) {
                if (isValid) {
                    tip.el.hide();
                } else {
                    tip.setHtml(validator.messages.join('<br />'));
                    tip.el.show();
                }
            });
        }.bind(this);
	}
});
/**
 * @class $.field.mixins.SelectOnFocusable
 */

$.define('$.field.mixins.SelectOnFocusable', {
    setSelectOnFocus: function(bool) {
        if (bool && !this._selectOnFocusCallback) {
            this._selectOnFocusCallback = function() {
                this.dom.select();
            }
            this.inputEl.on('focus', this._selectOnFocusCallback);
        } else if (!bool && this._selectOnFocusCallback) {
            this.inputEl.un('focus', this._selectOnFocusCallback);
        }
        return this;
    }
});
/**
 * @class $.field.mixins.Placeholderable
 */

$.define('$.field.mixins.Placeholderable', {
	setPlaceholder: function(value) {
        this.inputEl.setAttr('placeholder', value);
    }

    ,getPlaceholder: function() {
        return this.inputEl.getAttr('placeholder');
    }
});






/**
 * @class $.field.Text
 */

$.field.Field.extend('$.field.Text field.text', {
	baseClasses: 'x-field x-field-text'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.Placeholderable
        ,$.field.mixins.SelectOnFocusable
    ]
	,plugins: [
		//'$.field.plugins.Labelable'
		'$.field.plugins.ValidateIndicator'
	]

	,initElement: function() {
        this.callSuper();
		var input = this.fieldWrap.add({
            tag: 'input'
            ,attr: {
                type: 'text'
            }
        });
		this.inputEl = input.el;

        this.trigger('render:input');
	}
});


/**
 * @class $.field.Trigger
 */

$.field.Text.extend('$.field.Trigger trigger', {
    baseClasses: 'x-field x-field-text x-field-trigger'

    ,initElement: function() {
        this.callSuper();

        this.triggerButton = this.fieldWrap.add({
            xtype: 'button'
            ,classes: 'x-trigger-button'
            ,icon: 'chevron-down'
        });

        this.triggerButton.on('click', function() {
            this.inputEl.focus();
        }, this);
    }

    ,setTriggerButton: function(options) {
        this.triggerButton.applyOptions(options);
        return this;
    }
});


/**
 * @class $.field.DateTime
 */

$.field.Trigger.extend('$.field.DateTime field.datetime', {
    baseClasses: 'x-field x-field-text x-field-trigger x-field-datetime'

    ,initElement: function() {
        this.callSuper();

        var me = this;
        this.calendar = this.fieldWrap.add({
            xtype: 'calendar'
            ,classes: 'x-hidden'
            ,listeners: {
                mousedown: function() {
                    this.inputEl.un('blur', hideOnBlurCallback);
                }.bind(this)

                ,select: function() {
                    me.setValue(me.calendar.toString());
                    this.hide();
                }

                ,show: function() {
                    if (!me.isValid()) {
                        return;
                    }

                    var value = me.getValue();
                    if (value && me.calendar.toString() != value) {
                        me.calendar.setValue(value);
                    }
                }
            }
        });

        var hideOnBlurCallback = function(e) {
            this.calendar.hide(100);
        }.bind(this);

        this.triggerButton.on('mousedown', function() {
            this.inputEl.un('blur', hideOnBlurCallback);
        }, this);

        this.triggerButton.on('mouseup', function() {
            this.calendar.toggleDisplay();
            this.inputEl.on('blur', hideOnBlurCallback);
        }, this);
    }

    ,setCalendar: function(options) {
        this.calendar.applyOptions(options);
        return this;
    }

    ,setFormat: function(format) {
        this.calendar.setFormat(format);
        return this;
    }

    ,setTimeSelect: function(bool) {
        this.calendar.setTimeSelect(bool);
        return this;
    }
});



/**
 * @class $.field.Group
 */

$.field.Field.extend('$.field.Group field.group', {
    baseClasses: 'x-field x-field-group'
    ,includes: [$.field.mixins.Labelable]

    ,setInput: function(options) {
        this.fieldWrap.applyOptions(options);
    }

    ,getField: function(name /* or index */) {
        var query = '> .x-field';
        if ('number' == typeof name) {
            query += ':at({0})'.format(name);
        } else if (/\w+/.test(name)) {
            query += '[name={0}]'.format(name);
        } else {
            query += ' ' + name;
        }
        return this.fieldWrap.query(query);
    }

    ,getName: function() {
        return this.el.getName();
    }

    ,setName: function(name) {
        this.el.setName(name);
        return this;
    }

    ,setValue: function(value) {
        var fieldName, fields = this.fieldWrap.children();

        $.each(fields, function(field, index) {
            fieldName = field.getName() || index;
            field.setValue(value[fieldName]);
        });

        return this;
    }

    ,getValue: function() {
        var fields = this.fieldWrap.children();
        var value = [], fieldName, fieldValue;

        $.each(fields, function(field) {
            fieldValue = field.getValue();

            if (fieldName = field.getName()) {
                value.push({name: fieldName, value: fieldValue});
            } else {
                value.push(fieldValue);
            }
        });
        return value;
    }

    ,setColumns: function(number) {
        var styles = number;
        if ('number' == typeof number) {
            styles = {columnCount: number}
        }
        this.fieldWrap.setStyles(styles);
        return this;
    }

    ,setChildren: function() {
        this.fieldWrap.defaults = $.extend({}, this.defaults);
        this.fieldWrap.setChildren.apply(this.fieldWrap, arguments);
        return this;
    }
});


/**
 * @class $.field.Hidden
 */

$.field.Field.extend('$.field.Hidden field.hidden', {
	baseClasses: 'x-field x-field-hidden'
	,initElement: function() {
		this.callSuper();
		this.inputEl = this.el.append('<input>');
		this.inputEl.setAttr('type', 'hidden');

        this.trigger('render:input');
    }
});


/**
 * @class $.field.Radio
 */

$.field.Checkbox.extend('$.field.Radio field.radio', {
	baseClasses: 'x-field x-field-radio'

	,initElement: function() {
        this.callSuper();

		this.inputEl.setAttr('type', 'radio');
	}
});



/**
 * @class $.field.Range
 */

$.field.Field.extend('$.field.Range field.range', {
    baseClasses: 'x-field x-field-range'
    ,includes: [$.field.mixins.Labelable]

    ,initElement: function() {
        this.callSuper();

        this.slider = this.fieldWrap.add(new $.Slider());
        this.inputEl = this.slider.inputEl;

        // fallback methods
        var fallbackMethods = ['setMin', 'setMax', 'setValue', 'getValue', 'setStep', 'goNext', 'goPrev'];
        $.each(fallbackMethods, function(method) {
            this[method] = this.slider[method].bind(this.slider);
        }, this);
    }

    ,setInput: function(options) {
        this.slider.applyOptions(options);
        return this;
    }
});


/**
 * @class $.field.Select
 */

$.field.Trigger.extend('$.field.Select field.select', {
    baseClasses: 'x-field x-field-text x-field-trigger x-field-select'
    ,filterRegex: '(.*){0}(.*)$'
    ,nameField: 'id'
    ,valueField: 'id'
    ,htmlField: 'value'

    ,defaultOptions: $.readOnlyObject({
        menu: {
            styles: {
                maxHeight: '150px'
            }
        }
        ,menuAlign: 'left'
    })

    ,initElement: function() {
        this.callSuper();

        this.menu = this.fieldWrap.add({
            xtype: 'menu'
            ,classes: 'x-hidden'
            ,hideGutter: true
            ,listeners: {
                show: function() {
                    this.clearSelection();
                }
            }
        });

        var hideOnBlurCallback = function(e) {
            this.menu.hide(100);
        }.bind(this);

        this.inputEl.on('blur', hideOnBlurCallback);

        this.triggerButton.on({
            mousedown: function() {
                this.inputEl.un('blur', hideOnBlurCallback);
            }.bind(this)

            ,mouseup: function() {
                this.menu.toggleDisplay();

                $.each(this.menu.children(), function(item) {
                    item.show();
                });
                this.inputEl.on('blur', hideOnBlurCallback);
            }.bind(this)
        });

        this.inputEl.on('keyup', function(e) {
            var key = e.getKey();
            if (!e.canModifyText()) {
                return;
            }
            this.filter();
        }, this);

        var me = this;
        this.inputEl.setKeyListener({
            up: function() {
                me.menu.selectPrev();
            }
            ,down: function() {
                me.menu.selectNext();
            }
            ,esc: function() {
                me.menu.hide();
            }
            ,enter: function(e) {
                var selected = me.menu.getFirstSelected();
                if (selected) {
                    e.stop();
                    me.select(selected);
                    me.menu.hide();
                }
            }
        });
    }

    ,setMenu: function(options) {
        this.menu.applyOptions(options);
        return this;
    }

    ,setMenuAlign: function(align) {
        this.menuAlign = align;
        return this;
    }

    ,setData: function(data) {
        this.menu.empty();
        var menuItem, me = this;

        $.each(data, function(item) {
            if ('string' == typeof item) {
                item = {
                    name: item
                    ,value: item
                    ,html: item
                }
            } else if (item instanceof Array) {
                item = {
                    name: item[0]
                    ,value: item[0]
                    ,html: item[1]
                }
            } else {
                item = {
                    name: item[this.nameField]
                    ,value: item[this.valueField]
                    ,html: item[this.htmlField]
                }
            }

            menuItem = this.menu.add(item);

            menuItem.anchorEl.on('click', function(e) {
                e.stop();

                me.setValue(this.getData('value'));
            }.bind(menuItem));

        }, this);
    }

    ,renderer: function(v) {
        return v;
    }

    ,filter: function() {
        var value = this.getValue()
            ,found = false
            ,regex = new RegExp($.String.format(this.filterRegex, value))
            ,menuItems = this.menu.children();

        $.each(menuItems, function(item) {
            if (regex.test(item.textEl.getHtml())) {
                item.show();
                found = true;
            } else {
                item.hide();
            }
        });

        if (!found) {
            this.menu.hide();
        } else {
            this.menu.show();
        }
    }

    ,select: function(item) {
        this.setValue(item.getData('value'));
        return this;
    }
});






/**
 * @class $.field.TextArea
 */

$.field.Field.extend('$.field.TextArea field.textarea', {
	baseClasses: 'x-field x-field-textarea'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.Placeholderable
        ,$.field.mixins.SelectOnFocusable
    ]
    ,plugins: [
		'$.field.plugins.ValidateIndicator'
	]

    ,initElement: function() {
		this.callSuper();
        var input = this.fieldWrap.add({
            tag: 'textarea'
        });
        this.inputEl = input.el;


        this.trigger('render:input');
    }

    ,setResizable: function(direction) {
        if (true === direction) {
            direction = 'both';
        } else if (false === direction) {
            direction = 'none';
        }

        this.inputEl.setStyles('resize', direction);
        return this;
    }
});


/**
 * @class $.field.group.Checkbox
 */

$.field.Group.extend('$.field.group.Checkbox field.group.checkbox', {
    defaultOptions: $.readOnlyObject({
        defaults: {
            xtype: 'field.checkbox'
        }
    })

    ,getValue: function(all) {
        var fields = this.fieldWrap.children();
        var value = [], fieldName, fieldValue;

        $.each(fields, function(field) {
            if (!all && !field.isChecked()) {
                return;
            }

            fieldValue = field.getValue();
            fieldName = field.getName();

            if (fieldName) {
                value.push({name: fieldName, value: fieldValue});
            } else {
                value.push(fieldValue);
            }
        });
        return value;
    }
});


/**
 * @class $.field.group.Radio
 */

$.field.Group.extend('$.field.group.Radio field.group.radio', {
    defaultOptions: $.readOnlyObject({
        defaults: {
            xtype: 'field.radio'
            ,name: $.uniq('x-random-radio-name')
        }
    })

    ,getValue: function() {
        var fields = this.fieldWrap.children();
        var value;

        $.each(fields, function(field) {
            if (field.isChecked()) {
                value = field.getValue();
                return false;
            }
        });
        return value;
    }
});


/**
 * @class $.list.Item
 */

$.Component.extend('$.list.Item list.item', {
    tag: 'li'
    ,baseClasses: 'x-item'

    ,constructor: function() {
        this.callSuper(arguments);

        this.getElementHandlerSelect().on('click', function(e) {
            if (this.clickToToggle) {
                this.toggleSelect();
            } else {
                this.select();
            }
        }, this);
    }

    ,setClickToToggle: function(bool) {
        this.clickToToggle = bool;
        return this;
    }

    ,getElementHandlerSelect: function() {
        return this.el;
    }

    ,isSelected: function() {
        return this.hasClasses('x-selected');
    }

    ,setSelected: function(bool) {
        var isSelected = this.isSelected();
        if (bool && isSelected || !bool && !isSelected) {
            return this;
        }

        this.switchClasses(bool, 'x-selected');

        this.trigger('selectionchange', bool, this);
        this.trigger(bool? 'select' : 'deselect', this);

        return this;
    }

    ,select: function() {
        return this.setSelected(true);
    }

    ,deselect: function() {
        return this.setSelected(false);
    }

    ,toggleSelect: function() {
        return this[this.isSelected()? 'deselect' : 'select']();
    }
});


/**
 * @class $.menu.Item
 */

$.list.Item.extend('$.menu.Item menu.item', {
    baseClasses: 'x-item x-menu-item'
    ,defaultChildType: 'menu'

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('click', function() {
            var menu = this.findAncestor('.x-menu');
            if (menu && menu.findAncestor('.x-menu')) {
                menu.hide();
                menu.defer('show', 100);
            }
        }, this);
    }

    ,initElement: function() {
        this.callSuper();
        this.anchorEl = this.el.append({
            dom: '<a>'
            ,attr: {
                //href: '#'
                tabIndex: 0
            }
        });

        this.iconEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-icon'
            ,html: '&nbsp;'
        });

        this.textEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-text'
        });

        this.el.setKeyListener({
            right: this.focusMenu.bind(this)
        });
    }

    ,setIcon: function(icon) {
        this.iconEl.removeClasses(/^icon(.*)$/)
            .addClasses('icon-' + icon);
        return this;
    }

    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    ,setHref: function(href) {
        this.anchorEl.setAttr('href', href);
        return this;
    }

    ,setPushState: function(url) {
        this.setHref(url);

        if (!this._pushStateCallback) {
            this._pushStateCallback = function(e) {
                e.cancelBubble();
                e.stop();
                $.Navigator.navigate(this.anchorEl.getAttr('href'));
            }.bind(this);

            this.on('click', this._pushStateCallback);
        }
        return this;
    }

    ,setChildren: function(children) {
        var childClass = $.alias(this.defaultChildType);

        if (!(children instanceof childClass)) {
            children = new childClass({children: children});
        }
        this.child = this.add(children);
        this.setData('hasChild', true);
        return this;
    }

    ,focusMenu: function() {
        var menu = this.query('> .x-menu');
        if (menu) {
            menu.next();
        }
    }
});


/**
 * @class $.table.Body
 */

$.List.extend('$.table.Body table.body', {
    tag: 'tbody'
    ,baseClasses: 'x-body'
    ,defaultChildType: 'table.row'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,initElement: function() {
        this.callSuper();
        this.el.wrap();
    }

    ,setData: function(data) {
        this.data = data;
        this.empty();

        var row;
        $.each(data, function(rowData) {
            this.add(row = new $.table.Row(this.table));
            row.setData(rowData);
        }, this);
    }

    ,setCollection: function(collection) {
        this.collection = collection;
        var row;

        collection.on('change', function() {
            this.empty();

            $.each(collection.models, function(model) {
                this.add(new $.table.Row(this.table, {
                    model: model
                }));
            }, this);

        }.bind(this));
    }
});


/**
 * @class $.table.Cell
 */

$.Component.extend('$.table.Cell table.cell', {
    tag: 'td'
    ,baseClasses: 'x-cell'

    ,setAlign: function(align) {
        return this.setStyles('textAlign', align);
    }
});


/**
 * @class $.table.Column
 */

$.table.Cell.extend('$.table.Column table.column', {
    defaultCellType: 'table.row.cell'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,setDataField: function(name) {
        this.dataField = name;
        return this;
    }

    ,setEditable: function(bool) {
        this.editable = bool;
    }

    ,setAlign: function(align) {
        this.callSuper(arguments);
        this.align = align;
    }

    ,setWidth: function(width) {
        this.callSuper(arguments);
        this.width = width;
    }

    ,setHidden: function(bool) {
        this.callSuper(arguments);

        if (this.isRendered()) {
            var index = this.index();

            $.each(this.table.bodyComponent.children(), function(row) {
                row.child(index).setHidden(bool);
            });
        }

        this.hidden = bool;
        return this;
    }

    ,setRenderer: function(renderer) {
        this.renderer = renderer;
        return this;
    }

    ,hide: function() {
        return this.setHidden(true);
    }

    ,show: function() {
        return this.setHidden(false);
    }

    ,createCell: function(row, index) {
        var cellClass = $.alias(this.defaultCellType);

        return new cellClass(row, {
            renderer: this.renderer
            ,html: row.data[this.dataField]
            ,editable: this.editable
            ,align: this.align
            ,hidden: this.hidden
            ,width: this.width
        });
    }
});


/**
 * @class $.table.Header
 */

$.Component.extend('$.table.Header table.header', {
    tag: 'thead'
    ,baseClasses: 'x-header'
    ,defaultChildType: 'table.column.header'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }
});


/**
 * @class $.table.Row
 */

$.list.Item.extend('$.table.Row table.row', {
    tag: 'tr'
    ,baseClasses: 'x-item x-row'
    ,defaultChildType: 'table.row.cell'

    ,constructor: function(table, options) {
        this.table = table;
        this.callSuper([options]);
    }

    ,setData: function(data) {
        this.empty();
        this.data = data;

        $.each(this.table.columns, function(column, index) {
            this.add(column.createCell(this, index));
        }, this);
    }

    ,setModel: function(model) {
        this.model = model;

        this.setData(model.toJson());

        model.on('change', function() {
            this.setData(model.toJson());
        }.bind(this));

        model.on('destroy', function() {
            this.destroy();
        }.bind(this));
    }

    ,index: function() {
        if (!this.isRendered()) {
            if (this.table.bodyComponent.data)  {
                return this.table.bodyComponent.data.indexOf(this.data);
            } else {
                return this.table.bodyComponent.collection.indexOf(this.model);
            }
        }
        return this.callSuper();
    }
});


/**
 * @class $.table.column.Header
 */

$.table.Column.extend('$.table.column.Header table.column.header', {

});


/**
 * @class $.table.column.RowNumberer
 */

$.table.Column.extend('$.table.column.RowNumberer table.column.rownumberer', {
    initElement: function() {
        this.callSuper();
        this.addClasses('x-numberer');
    }

    ,createCell: function(row) {
        var cell = this.callSuper(arguments);
        cell.addClasses('x-numberer');
        cell.setHtml(row.index());
        return cell;
    }
});



/**
 * @class $.table.row.Cell
 */

$.table.Cell.extend('$.table.row.Cell table.row.cell', {
    constructor: function(row, options) {
        this.row = row;
        this.callSuper([options]);
    }

    ,renderer: function(value, row) {
        return value;
    }

    ,setEditable: function(bool) {
        this.setAttr('contenteditable', !!bool);
        return this;
    }

    ,setRenderer: function(renderer) {
        if (renderer) {
            this.renderer = renderer;
        }
        return this;
    }

    ,setHtml: function(html) {
        html = this.renderer(html, this.row);
        return this.callSuper([html]);
    }
});


/**
 * @class $.tree.Item
 */

$.list.Item.extend('$.tree.Item tree.item', {
    baseClasses: 'x-item x-tree-item'
    ,defaultChildType: 'tree'

    ,initElement: function() {
        this.callSuper();

        this.bowEl = this.el.append({
            dom: '<span>'
            ,classes: 'x-bow'
            ,listeners: {
                click: function(e) {
                    e.cancelBubble();
                    this.toggleCollapse();

                }.bind(this)
            }
        });

        this.anchorEl = this.el.append({
            dom: '<a>'
            ,attr: {
                //href: '#'
                tabIndex: 0
            }
        });

        this.iconEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-icon'
            ,html: '&nbsp;'
        });

        this.textEl = this.anchorEl.append({
            dom: '<span>'
            ,classes: 'x-text'
        });
    }

    ,getElementHandlerSelect: function() {
        return this.anchorEl;
    }

    ,setIcon: function(icon) {
        this.iconEl.removeClasses(/^icon(.*)$/)
            .addClasses('icon-' + icon);
        return this;
    }

    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    ,setHref: function(href) {
        this.anchorEl.setAttr('href', href);
        return this;
    }

    ,setPushState: function(url) {
        this.setHref(url);

        if (!this._pushStateCallback) {
            this._pushStateCallback = function(e) {
                e.stop();
                $.Navigator.navigate(this.anchorEl.getAttr('href'));
            }.bind(this);

            this.on('click', this._pushStateCallback);
        }
        return this;
    }

    ,setChildren: function(children) {
        if (children instanceof $.Collection) {
            var me = this;
            children.load(function() {
                me.setChildren(this.toJson());
            });
        } else {
            var childClass = $.alias(this.defaultChildType);

            if (!(children instanceof childClass)) {
                children = new childClass({children: children});
            }
            this.tree = this.add(children);
            this.setData('hasChild', true);
            return this;
        }
    }

    ,isExpanded: function() {
        return this.hasClasses('x-expanded');
    }

    ,toggleCollapse: function() {
        if (this.isExpanded()) {
            return this.collapse();
        }
        return this.expand();
    }

    ,expand: function() {
        this.addClasses('x-expanded');
        this.trigger('toggleexpand', true);
        this.trigger('expand');
    }

    ,collapse: function() {
        this.removeClasses('x-expanded');
        this.trigger('collapse');
        this.trigger('toggleexpand', false);
    }

    ,setExpanded: function(bool) {
        return this[bool? 'expand' : 'collapse']();
    }
});


/**
 * @class $.validator.Regex
 */

$.Validator.types['regex'] =

$.Validator.extend('$.validator.Regex', {
	pattern: null
	,message: 'This field should be valid pattern {0}'
	,validate: function() {
		var value = this.getValue();
		if (undefined === value || null === value || '' === value) {
			this.messages = [];
			return true;
		}
		
		var isValid = this.pattern.test(value);
		this.messages = isValid? [] : [$.String.format(this.message, this.pattern.toString())];
		return isValid;
	}
});


/**
 * @class $.validator.Alpha
 */

$.Validator.types['aplpha'] =
$.validator.Regex.extend('$.validator.Alpha', {
	pattern: /^[a-zA-Z_]+$/
	,message: 'This field should only contain letters and _'
});


/**
 * @class $.validator.AlphaNum
 */

$.Validator.types['aplphanum'] =

$.validator.Regex.extend('$.validator.AlphaNum', {
	message: 'This field should only contain letters, numbers and _'
	,pattern: /^[a-zA-Z0-9_]+$/
});


/**
 * @class $.validator.Date
 */

$.Validator.types['date'] =

    $.Validator.extend('$.validator.Date', {
        min: null
        ,max: null
        ,minMessage: 'The date in this field must be equal to or after {0}'
        ,maxMessage: 'The date in this field must be equal to or before {0}'
        ,invalidMessage: '{0} is not a valid date - it must be in the format {1}'

        ,setMin: function(min) {
            this.min = min;
            return this;
        }

        ,setMax: function(max) {
            this.max = max;
            return this;
        }

        ,validate: function() {
            var value = this.getValue();

            this.messages = [];
            if (undefined === value || null === value || '' === value) {
                return true;
            }

            var isValid = true
                ,format = this.field.calendar.format
                ,d = $.Date.parse(value, format);

            if (false === d || !d.isValid()) {
                this.messages.push($.String.format(this.invalidMessage, value, format));
                isValid = false;
            } else {
                if (this.min) {
                    if ('string' == typeof this.min) {
                        this.min = $.Date.parse(this.min, this.field.calendar.format);
                    }
                    if (this.min.getTime() > d.getTime()) {
                        this.messages.push($.String.format(this.minMessage, this.min.format(format)));
                        isValid = false;
                    }
                }

                if (this.max) {
                    if ('string' == typeof this.max) {
                        this.max = $.Date.parse(this.max, this.field.calendar.format);
                    }

                    if (this.max.getTime() < d.getTime()) {
                        this.messages.push($.String.format(this.maxMessage, this.max.format(format)));
                        isValid = false;
                    }
                }
            }

            return isValid;
        }
    });


/**
 * @class $.validator.Email
 */

$.Validator.types['email'] =

$.validator.Regex.extend('$.validator.Email', {
	message: 'This field should be an e-mail address'
	,pattern: /^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/
});


/**
 * @class $.validator.Length
 */

$.Validator.types['length'] =

$.Validator.extend('$.validator.Length', {
	min: null
	,max: null
	,minMessage: 'This field should be have length greater than {0}'
	,maxMessage: 'This field should be have length less than {0}'
	
	,validate: function() {
		var value = this.getValue();
		this.messages = [];
		if (undefined === value || null === value || '' === value) {
			return true;
		}
		
		var isValid = true;
		
		if (this.min && this.min > value.length) {
			this.messages.push($.String.format(this.minMessage, this.min));
			isValid = false;
		}
		
		if (this.max && this.max < value.length) {
			this.messages.push($.String.format(this.maxMessage, this.max));
			isValid = false;
		}
		
		return isValid;
	}
});


/**
 * @class $.validator.Number
 */

$.Validator.types['number'] =

$.Validator.extend('$.validator.Number', {
	min: null
	,max: null
	,invalidMessage: 'This field should be a number'
	,minMessage: 'This field should be greater than {0}'
	,maxMessage: 'This field should be less than {0}'
	
	,validate: function() {
		var value = this.getValue();
		this.messages = [];
		
		if (undefined === value || null === value || '' === value) {
			return true;
		}
		
		var isValid = true;
		
		if (!/\d+/.test(value)) {
			this.messages.push(this.invalidMessage);
			isValid = false;
		}
		
		value = parseInt(value);
		if (this.min && this.min > value) {
			this.messages.push($.String.format(this.minMessage, this.min));
			isValid = false;
		}
		
		if (this.max && this.max < value) {
			this.messages.push($.String.format(this.maxMessage, this.max));
			isValid = false;
		}
		
		return isValid;
	}
});


/**
 * @class $.validator.Require
 */

$.Validator.types['require'] =

$.Validator.extend('$.validator.Require', {
	message: 'This field is required'
	
	,validate: function() {
		var isValid = this.getValue() !== '';
		this.messages = isValid? [] : [this.message];
		return isValid;
	}
});


/**
 * @class $.validator.Url
 */

$.Validator.types['url'] =

$.validator.Regex.extend('$.validator.Url', {
	message: 'This field should be a URL'
	,pattern: /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i
});





