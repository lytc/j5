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