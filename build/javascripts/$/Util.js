/**
 * @class $.Util
 */
$.Util = {
	buildUrl: function(obj, url) {
		var query = [];
		for (var i in obj) {
			query.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}
		query = query.join('&');


        if (undefined !== url) {
            url += '';
            if (url === '') {
				query = '?' + query;
			}else if (-1 == url.indexOf('?')) {
				url += '?'
			} else if (url[url.length - 1] != '?') {
				url += '&';
			}
			query = url + query;
		}
		
		return query;
	}
};