/**
 * @class $.Array
 */
$.Array = {
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
            if (!result.has(item)) {
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

$.each($.Array, function(fn, name) {
    if (!Array.prototype[name]) {
        Array.prototype[name] = function() {
            var args = arguments;
            [].unshift.call(args, this);

            return fn.apply(this, args);
        }
    }
});