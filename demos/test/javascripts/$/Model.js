//= require ./Ajax

$.Observable.extend('$.Model', {
	url: ''
	,idProperty: 'id'

	,constructor: function(data, options) {
		this._data = data? data : {};
        this.callSuper([options]);
	}
	
	,id: function(value) {
		if (undefined === value) {
			return this.get(this.idProperty);
		}
		
		return this.set(this.idProperty, value);
	}
	
	,isNew: function() {
		return this.id() === undefined;
	}
	
	,get: function(name) {
		return this._data[name];
	}
	
	,set: function(name, value) {
		if (undefined === value) {
			for (var i in name) {
				this.set(i, name[i]);
			}
		} else {
			this._data[name] = value;
			this.trigger('change', name, value);
			this.trigger('change:' + name, value);
			this.trigger('change:*', name, value);
		}
		
		return this;
	}
	
	,escape: function(name) {
		return $.escape(this.get(name));
	}
	
	,getAjax: function() {
		if (!this._ajax) {
			this._ajax = new $.Ajax();
			this._ajax.on('exception', function(xhr, ajax) {
				this.trigger('exception', xhr.statusText, xhr, ajax, this);
			}, this);
		}
		return this._ajax;
	}
	
	,load: function(url) {
		url || (url = this.url + '/' + this.id());
		var ajax = this.getAjax();
		var me = this;
		ajax.send({
			url: url
			,success: function(responseText) {
				var data = JSON.parse(responseText);
				me.set(data);
				me.trigger('load', data, me);
			}
		});
		return this;
	}
	
	,save: function(url) {
		if (!url) {
			url = this.url;
			if (this.id()) {
				url += '/' + this.id();
			}
		}
		
		var ajax = this.getAjax();
		var me = this;
		ajax.send({
			url: url
			,method: this.isNew()? 'POST' : 'PUT'
			,jsonData: this._data 
			,success: function(responseText) {
				var data = JSON.parse(responseText);
				me.set(data);
				me.trigger('save', me);
			}
		});
		return this;
	}
	
	,destroy: function(url) {
		url || (url = this.url + '/' + this.id());
		var ajax = this.getAjax();
		var me = this;
		ajax.send({
			url: url
			,method: 'DELETE'
			,success: function() {
				me.trigger('destroy', me.id(), me);
			}
		});
		return this;
	}
	
	,toJson: function() {
		return this._data;
	}
});