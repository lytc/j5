//= require ./Observable

$.Observable.extend('$.Task', {
	interval: 500

	,start: function() {
		this._intervalId = setInterval(this.callback, this.interval);
		return this;
	}

    ,setInterval: function(interval) {
        this.interval = interval;
        return this;
    }

    ,setCallback: function(callback) {
        this.callback = callback;
        return this;
    }
	
	,stop: function() {
		clearInterval(this._intervalId);
		return this;
	}
});

$.extend($.Task, {
	start: function(options) {
		var task = new $.Task(options);
		task.start();
		return task;
	}
	,stop: function(task) {
		task.stop();
		return task;
	}
});