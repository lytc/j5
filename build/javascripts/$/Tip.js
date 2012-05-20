//= require ./Component

$.Component.extend('$.Tip tip', {
	baseClasses: 'x-tip'
	
	,setTarget: function(el) {
		this.targetEl = el;
		return this;
	}
	
	,setDisplayOn: function(displayOn) {
		this.targetEl.on(displayOn, function() {
			this.show();
		}, this);
	}
});