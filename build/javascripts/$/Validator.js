/**
 * @class $.Validator
 */
$.Observable.extend('$.Validator', {
	getValue: $.emptyFn
	,validate: $.emptyFn

	,setEvery: function(miliseconds) {
		if (this._task) {
			this._task.stop();
		} else {
			this._task = new $.Task({
				callback: this.isValid.bind(this)
			});
		}
		
		this._task.interval = miliseconds;
		this._task.start();
		
		return this;
	}

    ,setField: function(field) {
        this.field = field;
        return this;
    }

    ,setGetValue: function(fn) {
        this.getValue = fn;
        return this;
    }

    ,setCallback: function(fn) {
        this.callback = fn;
        return this;
    }

    ,setValidCallback: function(fn) {
        this.validCallback = fn;
        return this;
    }

    ,setInvalidCallback: function(fn) {
        this.invalidCallback = fn;
        return this;
    }

	,isValid: function() {
		var isValid = this.validate();
		
		if (this.callback) {
			this.callback(isValid, this);
		}
		
		if (this.validCallback && isValid) {
			this.validCallback(this);
		}
		
		if (this.invalidCallback && !isValid) {
			this.invalidCallback(this);
		}
		return isValid;
	}
	
	,getMessages: function() {
		return this.messages;
	}
});

$.Validator.types = {};