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