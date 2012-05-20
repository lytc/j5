//= require ./Observable
//= require ./Navigator

$.Observable.extend('$.App', {
	path: '/assets/app'
	,defaultController: 'index'
	,defaultAction: 'index'
	,actionPrefix: 'Action'
	,namespace: 'App'
	
	,run: function(options) {
		$.extend(this, options);
		$.Loader.addPath(this.namespace, this.path);
		
		$.each(['models', 'collections', 'controllers', 'views', 'plugins'], function(item) {
			$.namespace($.String.format('{0}.{1}', this.namespace, item));
		}, this);
		
		$.Navigator.on('change', function(path) {
			this.dispatch(path);	
		}, this);
		
		$.ready(function() {
			this.ready();
			this.dispatch(history.pushState? window.location.pathname : window.location.hash.replace(/^#/, ''));
		}, this);
	}
	
	,ready: $.emptyFn
	
	,dispatch: function(path) {
		var matches, controller, action, id;
		if (matches = path.match(/^\/([\w\-]+)$/)) {
			controller = matches[1];
			action = this.defaultAction;
		}else if(matches = path.match(/^\/([\w\-]+)\/(\d+)$/)) {
			controller = matches[1];
			action = 'view';
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/(\d+)\/([\w\-]+)\/?\??(.*)$/)) {
			controller = matches[1];
			action = matches[3];
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/([\w\-]+)\/?\??(.*)$/)) {
			controller = matches[1];
			action = matches[2];
		} else {
			controller = this.defaultController;
			action = this.defaultAction;
		}
		
		var controllerClassName = $.String.format(this.namespace + '.controllers.{0}', $.String.camelize(controller));
		var controllerClass = $.getClass(controllerClassName);
		
		if (!controllerClass) {
			throw new Error($.String.format('Controller {0} not found.', controller));
		}
		
		var controllerInstance = new controllerClass({
			id: id
		});
		
		var actionMethodName = $.String.camelize(action, true) + this.actionPrefix;
		if (!controllerInstance[actionMethodName]) {
			throw new Error($.String.format('Call undefined action {0} in controller {1}', action, controller));
		}
		controllerInstance.before();
		controllerInstance[actionMethodName]();
		controllerInstance.after();
	}
});