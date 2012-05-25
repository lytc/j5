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