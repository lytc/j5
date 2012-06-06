//= require ./Component
/**
 * @class $.Button
 * @superclass $.Component
 */
$.Component.extend('$.Button button', {
    /**
     * @property String tag
     * @default a
     */
	tag: 'a'

    /**
     * @property String baseClasses
     * @default x-button
     */
    ,baseClasses: 'x-button'

    /**
     * @property Object defaultOptions
     * @default {scale: 'small'}
     */
    ,defaultOptions: $.readOnlyObject({
        scale: 'small'
    })

    /**
     * @private
     * @method initElement
     * @return $.Button
     */
    ,initElement: function() {
        this.callSuper();
        this.el.setAttr('tabindex', 0);
        this.textEl = this.el.append({
            dom: '<span>'
            ,classes: 'x-text'
        });
        return this;
    }

    /**
     * @method setType
     * @params String type
     * @return $.Button
     */
	,setType: function(type) {
		this.el.setAttr('type', type);
		return this;
	}

    /**
     * @method setClick
     * @param Function callback
     * @return $.Button
     */
	,setClick: function(callback) {
		this.el.on('click', callback);
        return this;
	}

    /**
     * @method enable
     * @return $.Button
     */
	,enable: function() {
        this.el.removeAttr('disabled');
		return this;
	}

    /**
     * @method disable
     * @return $.Button
     */
	,disable: function() {
		this.el.setAttr('disabled', 'disabled');
		return this;
	}

    /**
     * @method setDisabled
     * @param Boolean bool
     * @return $.Button
     */
	,setDisabled: function(bool) {
		return this[bool? 'disable' : 'enable']();
	}

    /**
     * @method setScale
     * @param String scale
     * @return $.Button
     */
    ,setScale: function(scale) {
        this.setAttr('x-scale', scale);
        return this;
    }

    /**
     * @method setHtml
     * @param String html
     * @return $.Button
     */
    ,setHtml: function(html) {
        this.textEl.setHtml(html);
        return this;
    }

    /**
     * @method setIcon
     * @param String icon
     * @return $.Button
     */
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

    /**
     * @method setMenu
     * @param Object options
     * @return $.Button
     */
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

    /**
     * @method setToggleable
     * @param Boolean bool
     * @return $.Button
     */
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

    /**
     * @method press
     * @return $.Button
     */
    ,press: function() {
        if (this.pressed) {
            return this;
        }

        this.pressed = true;
        this.addClasses('x-button-pressed');
        this.trigger('press toggle', true);
        return this;
    }

    /**
     * @method release
     * @return $.Button
     */
    ,release: function() {
        if (!this.pressed) {
            return this;
        }

        this.pressed = false;
        this.removeClasses('x-button-pressed');
        this.trigger('release toggle', false);
        return this;
    }

    /**
     * @method toggle
     * @return $.Button
     */
    ,toggle: function() {
        return this[this.pressed? 'release' : 'press']();
    }

    /**
     * @method setRadioable
     * @param Boolean bool
     * @return $.Button
     */
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