//= require ./Component

$.Component.extend('$.Form form', {
	tag: 'form'
	,baseClasses: 'x-form'

    ,defaultOptions: $.readOnlyObject({
        preventSubmitOnInvalid: true
        ,ajaxSubmit: true
    })

	,constructor: function() {
		this.callSuper(arguments);

        this.on('validate', function(invalidFields) {
            if (this._submitting) {
                return;
            }

            var buttons = this.queryAll('.x-button');

            $.each(buttons, function(bt) {
                if (bt.options.disableOnFormInvalid) {
                    bt.setDisabled(!!invalidFields.length);
                }
            }, this);
        });

        this.on('submit:start', function() {
            this._submitting = true;
            var buttons = this.queryAll('.x-button');
            $.each(buttons, function(bt) {
                if (bt.options.disableOnSubmitting) {
                    bt.disable();
                }
            }, this);
        });

        this.on('submit:complete', function(isValid) {
            this._submitting = false;
            var buttons = this.queryAll('.x-button');
            $.each(buttons, function(bt) {
                if (bt.options.disableOnSubmitting) {
                    bt.enable();
                }
            }, this);
        });
	}

	,initElement: function() {
		this.callSuper();
		
		var setter;
		$.each(['action', 'method'], function(name) {
			setter = 'set' + $.String.camelize(name);
			this[setter] = function(value) {
				this.el.setAttr(name, value);
				return this;
			}
		}, this);
	}
	
	,getFields: function() {
		function getFrom(comp) {
			var fields = [];
			if (comp.items) {
				$.each(comp.items, function(item) {
					if (item instanceof $.field.Field) {
						fields.push(item);
					}
					fields = fields.concat(getFrom(item));
				});
			}
			return fields;
		}
		return getFrom(this);
	}
	
	,getField: function(name /* or index */) {
		var fields = this.getFields();
		
		if ('number' == typeof name) {
			return fields[name];
		}
		
		var result;
		$.each(fields, function(field) {
			if (field.getName() == name) {
				result = field;
				return false;
			}
		});
		return result;
	}
	
	,setSubmittingMask: function(html) {
		this.on({
			'submit:start': function() {
				this.el.mask(html);
			}
			,'submit:complete': function() {
				this.el.unmask();
			}
		});
		return this;
	}
	
	,setValidateEvery: function(miliseconds) {
		if (!this._validateTask) {
			this._validateTask = new $.Task({
				interval: miliseconds
				,callback: function() {
                    this.isValid();
				}.bind(this)
			});
		}
		
		this._validateTask.stop();
		this._validateTask.interval = miliseconds;
		this._validateTask.start();
		return this;
	}
	
	,isValid: function() {
		var invalidFields = [];
		var fields = this.getFields();
		$.each(fields, function(field) {
			if (false === field.isValid()) {
				invalidFields.push(field);
			}
		});

		this.trigger('validate', invalidFields);
		if (invalidFields.length) {
			this.trigger('invalid', invalidFields);
			return false;
		}
		
		this.trigger('valid');
		return true;
	}
	
	,setValues: function(values) {
		if ('function' == typeof values.toJson) {
			values = values.toJson();
		}
		
		var value;
		$.each(this.getFields(), function(field) {
			value = values[field.getName()];
			if (undefined === value || null === value || NaN === value) {
				value = '';
			}
			field.setValue(value);
		});
		
		this._firstValues || (this._firstValues = values);
		
		return this;
	}
	
	,getValues: function() {
		var values = {};
		$.each(this.getFields(), function(field) {
			values[field.getName()] = field.getValue();
		});
		return values;
	}
	
	,setModel: function(model) {
		if (!this.bindToModel) {
			this.bindToModel = function() {
				this.model.set(this.getValues());
			}.bind(this);
			this.save = function() {
				this.model.save.apply(this.model, arguments);
			};
		}
		
		model.on('change', function() {
			this.setValues(model);
		}, this);
		this.model = model;
		
		return this;
	}
	
	,getAjaxHandler: function(options) {
		if (!this._ajaxHandler) {
			this._ajaxHandler = new $.Ajax(options);
		}
		
		this._ajaxHandler.applyOptions(options);
		return this._ajaxHandler;
	}
	
	,submit: function(options) {
		if (this.trigger('submit:before') === false) {
			return this;
		}
		
		if (this.preventSubmitOnInvalid && !this.isValid()) {
			return this;
		}
		
		options || (options = {});
		$.defaults(options, {
			url: this.el.getAttr('action') || ''
			,method: this.el.getAttr('method') || 'GET'
			,jsonData: this.getValues()
		});
		
		$.extend(options, {
			start: function() {
				this.trigger('submit:start', ajax);
			}.bind(this)

            ,complete: function() {
				this.trigger('submit:complete', ajax);
			}.bind(this)

            ,success: function() {
				this.trigger('submit:success', ajax);;
			}.bind(this)

            ,exception: function() {
				this.trigger('submit:exception', ajax);
			}.bind(this)
		});
		
		var ajax = this.getAjaxHandler(options);
		ajax.send();
	}
	
	,setPreventSubmitOnInvalid: (function() {
		var callback = function(e) {
			if (!this.isValid()) {
				e.stop();
			}
		}
		var prevented = false;
		
		return function(bool) {
			if (bool && !prevented) {
				this.el.on('submit', callback, this);
				prevented = true;
			}
			
			if (!bool && prevented) {
				this.el.un('submit', callback, this);
				prevented = false;
			}
			this.preventSubmitOnInvalid = bool;
			return this;
		}
	})()
	
	,setAjaxSubmit: (function() {
		var callback = function(e) {
			e.stop();
			this.submit();
		}
		
		var enabled = false;
		return function(bool) {
			if (bool && !enabled) {
				this.el.on('submit', callback, this);
				enabled = true;
			}
			
			if (!bool && enabled) {
				this.el.un('submit', callback, this);
				enabled = false;
			}
			return this;
		}
	})()
	
	,reset: function(toFirstValue) {
		this.el.dom.reset();
		if (false !== toFirstValue && this._firstValues) {
			this.setValues(this._firstValues);
		}
		return this;
	}
	
	,destroy: function() {
		if (this._validateTask) {
			this._validateTask.stop();
		}
		return this.callSuper(arguments);
	}
});