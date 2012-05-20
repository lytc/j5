//= require ./Class

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