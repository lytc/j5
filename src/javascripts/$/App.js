//= require ./Observable
//= require ./Navigator

/**
 * @class $.App
 * @superclass $.Observable
 */
$.Observable.extend('$.App', {
    /**
     * @property String path
     * @default ''
     */
	path: '/assets/app'

    /**
     * @property String defaultController
     * @default index
     */
	,defaultController: 'index'

    /**
     * @property String defaultAction
     * @default index
     */
	,defaultAction: 'index'

    /**
     * @property String Action
     * @default Action
     */
	,actionPrefix: 'Action'

    /**
     * @property String namespace
     * @default App
     */
	,namespace: 'App'

    /**
     * @property Function ready
     * @default $.emptyFn
     */
    ,ready: $.emptyFn

    /**
     * @method run
     * @param Object [options]
     * @return $.App
     */
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
        return this;
	}

    /**
     * @method dispatch
     * @param String path
     * @return $.App
     */
	,dispatch: function(path) {
		var matches, controller, action, id;
		if (matches = path.match(/^\/([\w\-]+)\/?$/)) {  // controller or controller/
			controller = matches[1];
			action = this.defaultAction;
		}else if(matches = path.match(/^\/([\w\-]+)\/(\d+)\/?$/)) { // controller/id or controller/id/
			controller = matches[1];
			action = 'view';
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/(\d+)\/([\w\-]+)\/?\??(.*)$/)) { // controller/id/customaction or controller/id/customaction?params
			controller = matches[1];
			action = matches[3];
			id = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/([\w\-]+)\/?\??(.*)$/)) { // controller/action or controller/action?params
			controller = matches[1];
			action = matches[2];
		} else if (matches = path.match(/^\/([\w\-]+)\/?\?(.*)$/)) {
            controller = matches[1];
            action = this.defaultAction;
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