//= require ./Component

/**
 * @class $.NavBar
 */
$.Component.extend('$.NavBar navbar', {
	baseClasses: 'x-navbar'

	,initElement: function() {
		this.callSuper();

		this.innerComponent = this.add({
			'classes': 'x-navbar-inner'
		});
	}
	
	,add: function() {
		if (!this.innerComponent) {
			return this.callSuper(arguments);
		}
		var c = this.innerComponent.add.apply(this.innerComponent, arguments);
		return c;
	}

    ,setFixed: function(bool) {
        this.switchClasses(bool, 'x-fixed');
        return this;
    }
});