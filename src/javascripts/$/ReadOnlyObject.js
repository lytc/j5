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