var $ = function() {

};

$.isIterable = function(obj) {
    var iterators = [Array, NodeList, HTMLCollection];

    for (var i = 0; i < iterators.length; i ++) {
        if (obj instanceof iterators[i] || $.getType(obj) == $.getType(iterators[i])) {
            return true;
        }
    }
    return false;
};

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

$.extend = function(dest /*, *sources */) {
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
    version: '1.0'
    ,emptyFn: function() {}

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

    ,getType: function(obj) {
        return Object.prototype.toString.call(obj).match(/\[\w+\s(\w+)\]/)[1];
    }

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

    ,hasClass: function(className) {
        return undefined !== this.getClass(className);
    }

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

    ,readOnlyObject: function(values) {
        var obj = {};
        for (var i in values) {
            if ('prototype' != i && values.hasOwnProperty(i)) {
                Object.defineProperty(obj, i, {
                    value: values[i]
                    ,writable: false
                    ,enumerable: true
                })
            }
        }
        return obj;
    }
    
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
        isWebkit: isWebkit
        ,isChrome: isChrome
        ,isFirefox: isFirefox
        ,isOpera: isOpera

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

        ,getType: function(obj) {
            var type = Object.prototype.toString.call(obj);
            return type.match(/\[object\s+(\w+)\]/)[1];
        }

        ,isNodeList: function(obj) {
            return 'NodeList' == this.getType(obj);
        }

        ,getCssPrefix: function(dasherize) {
            var prefix = $.cssPrefix;
            if (dasherize) {
                prefix = '-' + prefix.toLowerCase() + '-';
            }
            return prefix;
        }
    });

    $.cssPrefix = isWebkit? 'Webkit' : isFirefox? 'Moz' : 'O';
})();