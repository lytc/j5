$.Observable.extend('$.Loader', {
	load: function(className) {
		var c = $.getClass(className);
		
		if (c) {
			return c;
		}
		
		var parts = className.split('.');
		
		var path = $.Loader.paths[parts[0]];
		path += '/' + parts.join('/') + '.js';
		var content;
		var ajax = new $.Ajax({
			url: path
			,async: false
			,success: function(responseText, xhr) {
				content = responseText;
				
				/*var scriptTag = document.createElement('script');
				scriptTag.innerHTML = responseText;
				document.head.appendChild(scriptTag);*/
			}
		});
		
		ajax.send();
		
		eval(content);
		
		return $.getClass(className);
	}
});
$.Loader.paths = {Js: '/assets/src'}
$.Loader.addPath = function(prefix, path) {
	$.Loader.paths[prefix] = path;
}