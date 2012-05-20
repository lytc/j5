//= require ../Drag

$.Drag.extend('$.drag.Anywhere', {
    constructor: function() {
        this.callSuper(arguments);

        this.on('start', function() {
            if (this._constrainTo) {
                this.setConstrain(this._constrainTo);
            }
        });

        this.on('drag', function() {
            var x = this.x
                y = this.y;

            if (this.constrain) {
                var ct = this.constrain;

                if (!this.lockX) {
                    var elWidth = this.el.getWidth();

                    if (ct.xMin > x) {
                        x = ct.xMin;
                    } else if (ct.xMax < x + elWidth) {
                        x = ct.xMax - elWidth;
                    }
                }

                if (!this.lockY) {
                    var elHeight = this.el.getHeight();

                    if (ct.yMin > y) {
                        y = ct.yMin;
                    } else if (ct.yMax < y + elHeight) {
                        y = ct.yMax - elHeight;
                    }
                }
            }

            if (!this.lockX) {
                this.el.setLeft(x);
            }

            if (!this.lockY) {
                this.el.setTop(y);
            }
        });
    }

    ,initElement: function() {
        this.callSuper(arguments);
        this.el.addClasses('x-anywhere');
    }

    ,setConstrain: function(to) {
        this._constrainTo = to;

        if (to === true) {
            to = this.el.getParent();
            var position = to.getStyle('position');
            if(position == 'relative' || position == 'absolute') {
                var toLeft = 0;
                var toTop = 0;
            }
        }
        var ct = {};
        if (to instanceof $.Component || to instanceof $.Element) {
            ct.xMin = undefined != toLeft? toLeft: to.getLeft();
            ct.xMax = ct.xMin + to.getWidth();

            ct.yMin = undefined != toTop? toTop: to.getTop();
            ct.yMax = ct.yMin + to.getHeight();
        } else if (to instanceof Array) {
            ct.xMin = to[0];
            ct.xMax = to[1];
            ct.yMin = to[2];
            ct.yMax = to[3];
        }

        this.constrain = ct;
        return this;
    }
        
});