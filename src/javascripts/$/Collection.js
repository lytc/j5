//= require ./Ajax

/**
 * @class $.Collection
 * @superclass $Observable
 */
$.Observable.extend('$.Collection', {
    /**
     * @property String url
     */
	url: ''

    /**
     * @property String totalProperty
     * @default total
     */
	,totalProperty: 'total'

    /**
     * @property String root
     * @default rows
     */
	,root: 'rows'

    /**
     * @property Number total
     * @default null
     */
	,total: null

    /**
     * @method constructor
     * @param Object [data]
     * @param Object [options]
     * @return $.Collection
     */
	,constructor: function(data, options) {
        this.callSuper([options]);

		this.models = [];
		this.setData(data || {});
	}

    /**
     * @method getAjax
     * @return $.Ajax
     */
	,getAjax: function() {
		if (!this._ajax) {
			this._ajax = new $.Ajax();
			this._ajax.on('exception', function(xhr, ajax) {
				this.trigger('exception', xhr.statusText, xhr, ajax, this);
			}, this);
		}
		return this._ajax;
	}

    /**
     * @method setData
     * @param Object data
     * @return $.Collection
     */
	,setData: function(data) {
        this.models = [];
        var model;

		$.each(data, function(item, index) {
            model = new this.model(item);
            model.on('change', function() {
                this.trigger('change:model', model);
            }, this);
			this.models.push(model);
		}, this);

		this.trigger('change', data, this);
		return this;
	}

    /**
     * @method load
     * @param Object options
     * @return $.Collection
     */
	,load: function(options) {
        options || (options = {});
        if ('function' == typeof options) {
            options = {callback: options}
        }
		options.url = options.url || this.url || this.model.prototype.url;

        options.success = function(responseText) {
            var response = JSON.parse(responseText);
            me.total = response[me.totalProperty];
            me.setData(response[me.root]);
            me.trigger('load', response[me.root], me);
            if (options.callback) {
                options.callback.call(me, response[me.root], me);
            }
        };

        options.complete = function(xhr, ajax) {
            me.trigger('load:complete', xhr, ajax, me);
        }

		var ajax = this.getAjax();
		var me = this;

        this.trigger('load:start');

		ajax.send(options);
		return this;
	}

    /**
     * @method each
     * @param Function callback
     * @param Mixed [scope]
     * @return $.Collection
     */
	,each: function(callback, scope) {
		scope || (scope = this);
		$.each(this.models, function(model, index, models) {
			return callback.call(scope, model, index, models, this);
		}, this);
		return this;
	}

    /**
     * @method get
     * @param String id
     * @return Mixed
     */
	,get: function(id) {
		return this.findOneBy(this.model.prototype.idProperty, id);
	}

    /**
     * @method at
     * @param Number index
     * @return Mixed
     */
	,at: function(index) {
		return this.models[index];
	}

    /**
     * @method findOneBy
     * @param String property
     * @param Mixed value
     * @return $.Model|Boolean
     */
	,findOneBy: function(property, value) {
		var result;
		this.each(function(model, index, models) {
			if (model.get(property) === value) {
				result = model;
				return false;
			}
		});
		return result;
	}

    /**
     * @method findBy
     * @param String property
     * @return Array
     */
	,findBy: function(property) {
		var results = [];
		this.each(function(model, index, models) {
			if (model.get(property) === value) {
				result.push(model);
			}
		});
		return results;
	}

    /**
     * @method sort
     * @param Function callback
     * @param Mixed scope
     * @return $.Collection
     */
	,sort: function(callback, scope) {
		this.models.sort(callback.bind(scope || this));
		this.trigger('sort', this);
        return this;
	}

    /**
     * @method sortBy
     * @param String property
     * @param String direction
     * @default ASC
     * @return $.Collection
     */
	,sortBy: function(property, direction) {
		direction || (direction = 'ASC');
		var callback = function(a, b) {
			var result = 0;

			a = a.get(property);
			b = b.get(property);

			if (a < b) {
				result = -1
			} else if (a > b) {
				result = 1;
			}

			if (direction == 'DESC') {
				result *= -1;
			}
			return result;
		};
		return this.sort(callback);
	}

    /**
     * @method sortDescBy
     * @param String property
     * @return $.Collection
     */
	,sortDescBy: function(property) {
		return this.sortBy(property, 'DESC');
	}

    /**
     * @method filter
     * @param Function callback
     * @param Mixed scope
     * @return Array
     */
	,filter: function(callback, scope) {
		return this.models.filter(callback, scope);
	}

    /**
     * @method indexOf
     * @param $.Model model
     * @return Number
     */
    ,indexOf: function(model) {
        return this.models.indexOf(model);
    }

    /**
     * @method toJson
     * @return Array
     */
	,toJson: function() {
		var result =[];
		this.each(function(model) {
			result.push(model.toJson());
		});
		return result;
	}

    /**
     * @method setPaginator
     * @param Object [options]
     * @return $.Collection
     */
    ,setPaginator: function(options) {
        if (!this.paginator) {
            var me = this;
            this.paginator = new $.Paginator({
                listeners: {
                    pagingchange: function(page) {
                        me.load({params: {page: page}});
                    }
                }
            });

            this.on('load', function() {
                this.paginator.setTotalItem(this.total);
            });

        }
        this.paginator.applyOptions(options);
        return this;
    }

    /**
     * @param getPaginator
     * @return $.Paginator
     */
    ,getPaginator: function() {
        this.setPaginator();
        return this.paginator;
    }
});