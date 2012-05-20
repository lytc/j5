//= require ./Observable

$.Observable.extend('$.Animation', {
    delay: 0
    ,direction: 'normal'// [ normal | reverse | alternate | alternate-reverse ] [, [ normal | reverse | alternate | alternate-reverse ] ]*
    ,duration: 1
    ,fillMode: 'forwards' // [ none | forwards | backwards | both ] [, [ none | forwards | backwards | both ] ]*
    ,iterationCount: 1 // [ infinite | <number> ] [, [ infinite | <number> ] ]*
    ,playState: 'running' // [ running | paused ] [, [ running | paused ] ]*
    ,timingFunction: 'ease' // [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>) ] [, [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>)] ]*
    ,onIteration: $.emptyFn
    ,onEnd: $.emptyFn
    ,keyframe: null
    ,concurrent: true

    ,simpleSetters: 'delay, direction, duration, fillMode, iterationCount, playState, timingFunction, keyframe, concurrent'

    ,constructor: function(el, options) {
        this.el = $.Element.get(el);

        this.queue || (this.queue = []);

        this.buffered = $.Function.createBuffered(this.playQueue);
        this.el.on('animationend', function() {
            this.playQueue();
        }, this);

        this.callSuper(options);
    }

    ,play: function(options) {
        var property = '{name} {duration} {timingFunction} {delay} {iterationCount} {direction} {fillMode}'
            ,name
            ,animation
            ,currentProperty;

        if (this.concurrent) {
            this.applyOptions(options);

            name = $.uniq('x-keyframe');
            var keyframes = '@' + $.getCssPrefix(true) + 'keyframes ' + name + '{\n'
                ,step;

            $.each(this.keyframe, function(properties, percentage) {
                if ('function' == typeof properties) {
                    properties = properties();
                }

                step = percentage + '% {\n';

                $.each(properties, function(value, property) {
                    if ('function' == typeof value) {
                        value = value();
                    }
                    property = $.getCssProperty(property, false);
                    step += (property + ':' + value + ';\n');
                });
                step += '}';
                keyframes += step + '\n';
            });

            keyframes += '}';

            $.Element.get('head').append({
                dom: '<style>'
                ,attr: {
                    type: 'text/css'
                }
                ,html: keyframes
            });

            animation = $.String.format(property, {
                name: name
                ,duration: this.duration + 's'
                ,timingFunction: this.timingFunction
                ,delay: this.delay + 's'
                ,iterationCount: this.iterationCount
                ,direction: this.direction
                ,fillMode: this.fillMode
            });

            currentProperty = this.el.getStyle('animation');
            !currentProperty || (animation = currentProperty + ', ' + animation);
            this.el.setStyles('animation', animation);
        } else {
            this.queue.push(options);
            this.buffered();
        }

        return this;
    }

    ,playQueue: function() {
        if (!this.queue || !this.queue.length) {
            return this;
        }
        this.concurrent = true;

        var item = this.queue.shift();

        this.play(item);
        return this;
    }

    ,fade: function(options, opacity) {
        var currentOpacity = parseFloat(this.el.getStyle('opacity'));
        return this[currentOpacity == 1? 'fadeOut' : 'fadeIn'](options, opacity);
    }

    ,fadeIn: function(options) {
        options || (options = {});

        options.keyframe = {
            0: {
                opacity: 0
            }
            ,100: {
                opacity: 1
            }
        }

        return this.play(options);
    }

    ,fadeOut: function(options) {
        options || (options = {});

        options.keyframe = {
            0: {
                opacity: 1
            }
            ,100: {
                opacity: 0
            }
        }

        return this.play(options);
    }

    ,move: function(x, y, options) {
        if ('number' !== typeof y) {
            options = y;
            y = x;
        }

        options || (options = {});

        options.keyframe = {
            0: function() {
                return {
                    top: this.el.getOffset().y + 'px'
                    ,left: this.el.getOffset().x + 'px'
                }
            }
            ,100: {
                top: y + 'px'
                ,left: x + 'px'
            }
        };
        return this.play(options);
    }

    ,moveX: function(x, options) {
        options || (options = {});

        options.keyframe = {
            0: {
                left: this.el.getLeft() + 'px'
            }
            ,100: {
                left: x + 'px'
            }
        };
        return this.play(options);
    }

    ,moveY: function(y, options) {
        options || (options = {});

        options.keyframe = {
            0: {
                top: this.el.getTop() + 'px'
            }
            ,100: {
                top: y + 'px'
            }
        };
        return this.play(options);
    }

    ,slideUp: function(options) {
        if (this._originalBeforeFx) {
            return this;
        }

        options || (options = {});

        options.keyframe = {
            100: {
                height: 0
            }
        }

        this._originalBeforeFx = {
            height: this.el.getHeight()
            ,heightStyle: this.el.getStyle('height')
        };

        return this.play(options);
    }

    ,slideDown: function(options) {
        if (!this._originalBeforeFx) {
            return this;
        }
        options || (options = {});

        options.keyframe = {
            0: {
                height: 0
            }
            ,100: {
                height: this._originalBeforeFx.height + 'px'
            }
        }

        this._originalBeforeFx = null;

        return this.play(options);
    }

    ,slide: function(options) {
        return this[this._originalBeforeFx? 'slideDown' : 'slideUp'](options);
    }

    ,rotate: function(options, property) {
        options || (options = {});
        property || (property = 'rotateY(180deg)');

        options.keyframe = {
            100: {
                transform: property
            }
        };
        return this.play(options);
    }
});