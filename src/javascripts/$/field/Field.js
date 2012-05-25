//= require ../Component

/**
 * @class $.field.Field
 */
$.Component.extend('$.field.Field', {
	baseClasses: 'x-field'

    ,on: function(eventName) {
        if ('change' == eventName) {
            this.inputEl.on.apply(this.inputEl, arguments);
        } else {
            this.callSuper(arguments);
        }
        return this;
    }

    ,initElement: function() {
        this.callSuper();
        this.fieldWrap = this.add({
            classes: 'x-wrap'
        });
    }

	,setName: function(name) {
		this.inputEl.setAttr('name', name);
		return this;
	}

	,getName: function() {
		return this.inputEl.getAttr('name');
	}

	,setValue: function(value) {
        var oldValue = this.getValue();
        if (oldValue === value) {
            return this;
        }
		this.inputEl.dom.value = value;
        this.trigger('change', value, oldValue);
		return this;
	}

	,getValue: function() {
		return this.inputEl.dom.value;
	}

	,setInput: function(options) {
		this.inputEl.applyOptions(options);
		return this;
	}

    ,setDisabled: function(bool) {
        this.inputEl.switchAttr(bool, 'disabled');
    }

    ,enable: function() {
        return this.setDisabled(false);
    }

    ,disable: function() {
        return this.setDisabled(true);
    }
	
	,setValidates: function(validates) {
		this.validators = [];
		
		(validates instanceof Array) || (validates = [validates]);
		$.each(validates, function(validate) {
			('string' != typeof validate) || (validate = {type: validate});
			var options = $.defaults(
				validate, {
					field: this
                    ,getValue: this.getValue.bind(this)

                    ,callback: function(isValid, validator) {
						this.trigger('validate', isValid, validator);
					}.bind(this)

                    ,validCallback: function(validator) {
						this.trigger('valid', validator);
					}.bind(this)

                    ,invalidCallback: function(validator) {
						this.trigger('invalid', validator);
					}
				}
			);

			var validator = new $.Validator.types[validate.type](options);
			this.validators.push(validator);
		}, this); 
	}
	
	,isValid: function() {
		if (!this.validators) {
			return true;
		}
		
		var isValid = true;
		$.each(this.validators, function(validator) {
			if (false === validator.isValid()) {
				isValid = false;
				return false;
			}
		}, this);

		return isValid;
	}

    ,focus: function() {
        this.inputEl.dom.focus();
        return this;
    }
});