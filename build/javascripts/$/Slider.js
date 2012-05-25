//= require ./Component

/**
 * @class $.Slider
 */
$.Component.extend('$.Slider slider', {
    baseClasses: 'x-slider'

    ,defaultOptions: $.readOnlyObject({
        direction: 'horizontal'
        ,step: 1
        ,min: 0
        ,max: 100
        ,value: 0
    })

    ,constructor: function() {
        this.callSuper(arguments);
        this.onRender(this.updatePosition.bind(this));
    }

    ,initElement: function() {
        this.callSuper();

        this.sliderRule = this.el.append({
            classes: 'x-rule'
            ,listeners: {
                click: function(e) {
                    if (e.target != this.sliderThumb.dom) {
                        this.movedTo(e.getOffset(this.sliderRuleInner));
                    }
                    this.sliderThumb.focus();
                }.bind(this)
            }
        });

        this.sliderRuleInner = this.sliderRule.append({
            classes: 'x-inner'
        });

        this.sliderRuleBar = this.sliderRuleInner.append({
            classes: 'x-bar'
        });

        this.sliderThumb = this.sliderRule.append({
            classes: 'x-thumb'
            ,focusable: true
            ,draggable: {
                constrain: true
                ,listeners: {
                    drag: function(e) {
                        this.movedTo(e.getOffset(this.sliderRuleInner), false);
                    }.bind(this)
                }
            }
            ,keyListener: {
                listenOn: 'keypress'
                ,stopEvent: true
                ,right: this.goNext.bind(this)
                ,up:    this.goNext.bind(this)
                ,left:  this.goPrev.bind(this)
                ,down:  this.goPrev.bind(this)
            }
        });

        var inputWrapEl = this.append({
            classes: 'x-input-wrap'
        });

        this.inputEl = inputWrapEl.append({
            dom: '<input>'
            ,classes: 'x-input'
            ,attr: {
                type: 'text'
            }
            ,listeners: {
                focus: function(e) {
                    this.select();
                }

                ,change: function(e, el) {
                    this.setValue(el.getValue());
                }.bind(this)
            }
        })

        this.trigger('render:input');
    }

    ,setWidth: function(value) {
        if (this.direction == 'vertical') {
            return this.setHeight(value);
        }
        return this.callSuper([value]);
    }

    ,setMin: function(value) {
        this.min = value;
        return this;
    }

    ,setMax: function(value) {
        this.max = value;
        return this;
    }

    ,movedTo: function(xy) {
        var pos = 'horizontal' == this.direction? xy.x : this.sliderRuleInner.getHeight() - xy.y;
        var ratio = (this.max - this.min) / this.sliderRuleInner['horizontal' == this.direction? 'getWidth' : 'getHeight']();;
        var value = ratio * pos + this.min;

        this.setValue(value);
    }

    ,updatePosition: function() {
        var value = this.getValue();
        var pos = ((value - this.min) / (this.max - this.min) * 100);

        if ('horizontal' == this.direction) {
            this.sliderRuleBar.setWidth(pos + '%');
            this.sliderThumb.setLeft(pos + '%');
        } else {
            this.sliderRuleBar.setHeight(pos + '%');
            this.sliderThumb.setTop((100 - pos) + '%');
        }

    }

    ,setValue: function(value) {
        value = Math.round(value / this.step) * this.step;

        (value > this.min) || (value = this.min);
        (value < this.max) || (value = this.max);

        this.callSuper([value]);

        this.inputEl.setValue(value);

        this.updatePosition();

        var oldValue = this.getValue();
        if (oldValue !== value) {
            this.trigger('change', value, oldValue);
        }
        return this;
    }

    ,getValue: function() {
        var value = parseInt(this.callSuper());
        return isNaN(value)? 0 : value;
    }

    ,setStep: function(value) {
        this.step = value;
        return this;
    }

    ,setDirection: function(direction) {
        this.direction = direction;
        this.addClasses('x-' + direction);

        if ('horizontal' == direction) {
            this.sliderThumb.drag.setLockX(false).setLockY(true);
        } else {
            this.sliderThumb.drag.setLockX(true).setLockY(false);
        }

        return this;
    }

    ,setInput: function(options) {
        this.callSuper(arguments);
        if (undefined !== options.width) {
            this.sliderEl.setWidth(options.width);
        }
    }

    ,goNext: function() {
        return this.setValue(this.getValue() + this.step);
    }

    ,goPrev: function() {
        return this.setValue(this.getValue() - this.step);
    }
});