//= require ./Observable

/**
 * @class $.Drag
 */
$.Observable.extend('$.Drag', {
    /**
     * @property Mixed data
     */
    data: null

    /**
     * @method constructor
     * @param Element|$.Element el
     * @param Object [options]
     * @return $.Drag
     */
    ,constructor: function(el, options) {
        this.el = el;
        this.initElement();

        this.callSuper([options]);
    }

    /**
     * @protected
     * @method initElement
     * @return $.Drag
     */
    ,initElement: function() {
        this.el.addClasses('x-draggable').setAttr('draggable', true);
        this.offsetX = this.offsetY = 0;

        var mouseMoveCallback = function(e) {
            this.x = e.pageX - this.offsetX;
            this.y = e.pageY - this.offsetY;
            this.trigger('drag', new $.Event(e));
        }.bind(this)

        var mouseUpCallback = function(e) {
            window.removeEventListener('mousemove', mouseMoveCallback, false);
            window.removeEventListener('mouseup', mouseUpCallback, false);
            this.trigger('end', new $.Event(e));
        }.bind(this);

        this.el.on('dragstart', function(e) {
            if (this.locked) {
                return false;
            }
            e.stop();

            this.offsetX = e.pageX - this.el.getLeft();
            this.offsetY = e.pageY - this.el.getTop();

            window.addEventListener('mousemove', mouseMoveCallback, false);
            window.addEventListener('mouseup', mouseUpCallback, false);
            this.trigger('start', new $.Event(e));

        }.bind(this));
        return this;
    }

    /**
     * @method look
     * @return $.Drag
     */
    ,lock: function() {
        this.el.setAttr('locked', true);
        this.locked = true;
        return this;
    }

    /**
     * @method unlock
     * @return $.Drag
     */
    ,unlock: function() {
        this.el.removeAttr('locked');
        this.locked = false;
        return this;
    }

    /**
     * @method setLockX
     * @param Boolean
     * @return $.Drag
     */
    ,setLockX: function(bool) {
        this.lockX = bool;
        return this;
    }

    /**
     * @method setLockY
     * @param Boolean
     * @return $.Drag
     */
    ,setLockY: function(bool) {
        this.lockY = bool;
        return this;
    }

    /**
     * @method setData
     * @param Mixed data
     * @return $.Drag
     */
    ,setData: function(data) {
        this.data = data;
        return this;
    }
});