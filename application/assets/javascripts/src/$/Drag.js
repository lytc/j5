//= require ./Observable

$.Observable.extend('$.Drag', {
    data: null

    ,constructor: function(el, options) {
        this.el = el;
        this.initElement();

        this.callSuper([options]);
    }

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
    }

    ,lock: function() {
        this.el.setAttr('locked', true);
        this.locked = true;
        return this;
    }

    ,unlock: function() {
        this.el.removeAttr('locked');
        this.locked = false;
        return this;
    }

    ,setLockX: function(bool) {
        this.lockX = bool;
        return this;
    }

    ,setLockY: function(bool) {
        this.lockY = bool;
        return this;
    }

    ,setData: function(data) {
        this.data = data;
        return this;
    }
});