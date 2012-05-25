//= require ./Component
/**
 * @class $.Button
 */
$.Component.extend('$.Button button', {
	tag: 'a'
    ,baseClasses: 'x-button'
    ,defaultOptions: $.readOnlyObject({
        scale: 'small'
    })

    ,initElement: function() {
        this.callSuper();
        this.el.setAttr('tabindex', 0);
        this.textEl = this.el.append({
            dom: '<span>'
            ,classes: 'x-text'
        });
    }
	
	,setType: function(type) {
		this.el.setAttr('type', type);
		return this;
	}
	
	,setClick: function(callback) {
		return this.el.on('click', callback);
	}
	
	,enable: function() {
        this.el.removeAttr('disabled');
		return this;
	}
	
	,disable: function() {
		this.el.setAttr('disabled', 'disabled');
		return this;
	}
	
	,setDisabled: function(bool) {
		return this[bool? 'disable' : 'enable']();
	}

    ,setScale: function(scale) {
        this.setAttr('x-scale', scale);
        return this;
    }

    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    ,setIcon: function(icon) {
        if (!this.iconEl) {
            this.iconEl = this.el.insert(0, {
                dom: '<span>'
                ,classes: 'x-icon'
            });
        }
        this.iconEl.removeClasses(/icon-([\w\-]+)/)
            .addClasses('icon-' + icon);

        return this;
    }

    ,setMenu: function(options) {
        options || (options = {});
        !(options instanceof Array) || (options = {children: options});
        if (!this.menu) {
            this.menu = new $.Menu(options);
            this.add(this.menu);
            this.addClasses('x-button-menu');
        } else {
            this.menu.setOptions(options);
        }
        return this;
    }

    ,setToggleable: function(bool) {
        if (bool) {
            if (!this._toggleableCallback) {
                this._toggleableCallback = function() {
                    this.toggle();
                }.bind(this);
                this.on('click', this._toggleableCallback);
            }
        } else {
            if (this._toggleableCallback) {
                this.removeClasses('x-button-pressed');
                this.un('click', this._toggleableCallback);
                this._toggleableCallback = undefined;
            }
        }

        return this;
    }

    ,press: function() {
        if (this.pressed) {
            return this;
        }

        this.pressed = true;
        this.addClasses('x-button-pressed');
        this.trigger('press toggle', true);
        return this;
    }

    ,release: function() {
        if (!this.pressed) {
            return this;
        }

        this.pressed = false;
        this.removeClasses('x-button-pressed');
        this.trigger('release toggle', false);
        return this;
    }

    ,toggle: function() {
        return this[this.pressed? 'release' : 'press']();
    }

    ,setRadioable: function(bool) {
        if (bool) {
            if (!this._radioableCallback) {
                this._radioableCallback = function() {
                    this.radioClasses('x-button-pressed');
                    var pressed = this.pressed = this.hasClasses('x-button-pressed');
                    this.trigger('toggle', pressed);
                }.bind(this);
                this.on('click', this._radioableCallback);
            }
        } else {
            if (this._radioableCallback) {
                this.removeClasses('x-button-pressed');
                this.un('click', this._radioableCallback);
                this._radioableCallback = undefined;
            }
        }

        return this;
    }
});