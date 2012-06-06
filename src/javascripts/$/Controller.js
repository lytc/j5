//= require ./Observable

/**
 * @class $.Controller
 */
$.Observable.extend('$.Controller', {
    /**
     * @property Function before
     * @default $.emptyFn
     */
	before: $.emptyFn

    /**
     * @method Function after
     * @default $.emptyFn
     */
	,after: $.emptyFn

    /**
     * @method getParam
     * @param String name
     * @return Mixed
     */
	,getParam: function(name) {
		return $.getUrlQueryParam(name);
	}
});