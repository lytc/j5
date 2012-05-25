//= require ./Observable

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