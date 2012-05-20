//= require ./Component

$.Component.extend('$.Modal modal', {
    baseClasses: 'x-modal'

    ,initElement: function() {
        this.callSuper();
        this.el.hide();
    }
    ,show: function() {
        this.el.show();

        if (!this._wrapEl) {
            this._wrapEl = this.el.wrap({
                classes: 'x-inner'
            }).wrap({
                classes: 'x-modal-wrap x-hidden'
            });

            var me = this;
            this._wrapEl.on({
                show: function() {
                    me.trigger('show', me);
                }
                ,hide: function() {
                    me.trigger('hide', me);
                }
            });
        }

        if (!this._wrapEl.isRendered()) {
            document.body.appendChild(this._wrapEl.dom);
        }

        this._wrapEl.show();
        return this;
    }

    ,hide: function() {
        this._wrapEl.hide();

        return this;
    }

    ,setListeners: function() {
        this.callSuper(arguments);

    }
});