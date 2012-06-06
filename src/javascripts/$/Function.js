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
            var callArgs = args || [].slice.call(arguments, 0),
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

$.each($.Function, function(fn, name) {
    if (!Function.prototype[name]) {
        Function.prototype[name] = function() {
            var args = arguments;
            [].unshift.call(args, this);

            return fn.apply(this, args);
        }
    }
});