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