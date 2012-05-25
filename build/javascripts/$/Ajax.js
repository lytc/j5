//= require ./Observable

/**
 * @class $.Ajax
 * @superclass $.Observable
 */
$.Observable.extend('$.Ajax', {
    /**
     * @property Object defaultOptions
     */
    defaultOptions: $.readOnlyObject({
        url: ''
        ,method: 'GET'
        ,async: true
        ,disableCacheParamName: '_' + (new Date).getTime()
        ,headers: {'X-Requested-With': 'XMLHttpRequest'}
    })

    /**
     * @property Function start
     */
    ,start: $.emptyFn

    /**
     * @property Function complete
     */
    ,complete: $.emptyFn

    /**
     * @property Function success
     */
    ,success: $.emptyFn

    /**
     * @property Function exception
     */
    ,exception: $.emptyFn

    /**
     * @private
     * @property String simpleSetters
     */
    ,simpleSetters: 'params, start, complete, success, exception'

    /**
     * @method getXhr
     * @return XMLHttpRequest
     */
    ,getXhr: function() {
		if (!this._xhr) {
			this._xhr = new XMLHttpRequest();
			var me = this;

			this._xhr.onreadystatechange = function() {
				if (this.readyState == this.DONE) {
					me.complete(this, me);
					me.trigger('complete', this, me);
					var status = this.status;
					if ((status >= 200 && status < 300) || status == 304) {
						me.success(this.responseText, this, me);
						me.trigger('success', this.responseText, this, me);
					} else {
						me.exception(this, me);
						me.trigger('exception', this, me);
					}
				}
			}
		}
		return this._xhr;
	}

    /**
     * @method setHeaders
     * @param String|Object name
     * @param String [value]
     * @return $.Ajax
     */
	,setHeaders: function(name, value) {
		this.headers || (this.headers = {});
		if (undefined === value) {
			for (var i in name) {
				this.setHeaders(i, name[i]);
			}
		} else {
			this.headers[name] = value;
		}
		return this;
	}

    /**
     * @method abort
     * @return $.Ajax
     */
	,abort: function() {
		this.getXhr().abort();
        return this;
	}

    /**
     * @method send
     * @param Object [options]
     * @return $.Ajax
     */
	,send: function(options) {
        if (options) {
            this.applyOptions(options);
        }

        var xhr = this.getXhr();

        if (this.trigger('start', xhr, this) === false || this.start(xhr, this) === false) {
            return this;
        }

        var data = this.rawData || this.xmlData || null
        if (this.jsonData) {
            data = JSON.stringify(this.jsonData);
        }

        if (this.form) {
            data = new FormData(this.form);
        }

        if (undefined == this.headers['Content-Type'] && (this.options.method == 'POST' || this.options.method == 'PUT')) {
            var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (this.rawData) {
                contentType = 'text/plain';
            } else if (this.xmlData) {
                contentType = 'text/xml';
            } else if (this.jsonData) {
                contentType = 'application/json';
            }

            this.setHeaders('Content-Type', contentType);
        }

        var url = this.options.url;
        if (this.options.method == 'GET' || this.options.method == 'HEAD') {
            if (this.options.disableCacheParamName) {
                this.params || (this.params = {});
                this.params[this.options.disableCacheParamName] = (new Date).getTime();
            }
            if (this.params) {
                url = $.Util.buildUrl(this.params, url);
            }
        }

        xhr.open(this.options.method, url, this.options.async);

        for (var i in this.headers) {
            xhr.setRequestHeader(i, this.headers[i]);
        }

        xhr.send(data);
        return this;
	}
});