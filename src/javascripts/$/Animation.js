//= require ./Observable

/**
 * @class $.Animation
 * @superclass $.Observable
 */
$.Observable.extend('$.Animation', {
    /**
     * @property Number delay
     * @default 0
     */
    delay: 0

    /**
     * @property String direction
     * @default normal
     */
    ,direction: 'normal'// [ normal | reverse | alternate | alternate-reverse ] [, [ normal | reverse | alternate | alternate-reverse ] ]*

    /**
     * @property Number duration
     * @default 1
     */
    ,duration: 1

    /**
     * @property String fillMode
     * @default 'forwards'
     */
    ,fillMode: 'forwards' // [ none | forwards | backwards | both ] [, [ none | forwards | backwards | both ] ]*

    /**
     * @property Number iterationCount
     * @default 1
     */
    ,iterationCount: 1 // [ infinite | <number> ] [, [ infinite | <number> ] ]*

    /**
     * @property String playState
     * @default running
     */
    ,playState: 'running' // [ running | paused ] [, [ running | paused ] ]*

    /**
     * @property String timingFunction
     * @default ease
     */
    ,timingFunction: 'ease' // [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>) ] [, [ ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps(<number>[, [ start | end ] ]?) | cubic-bezier(<number>, <number>, <number>, <number>)] ]*

    /**
     * @property Function onIteration
     * @default $.emptyFn
     */
    ,onIteration: $.emptyFn

    /**
     * @property Function onEnd
     * @default $.emptyFn
     */
    ,onEnd: $.emptyFn

    /**
     * @property Object keyframe
     * @default null
     */
    ,keyframe: null

    /**
     * @property Boolean concurrent
     * @default true
     */
    ,concurrent: true

    /**
     * @private
     * @property String simpleSetter
     */
    ,simpleSetters: 'delay, direction, duration, fillMode, iterationCount, playState, timingFunction, keyframe, concurrent'

    /**
     * @method constructor
     * @param String|Element|$.Element el
     * @param Object [options]
     */
    ,constructor: function(el, options) {
        this.el = $.Element.get(el);

        this.queue || (this.queue = []);

        this.buffered = $.Function.createBuffered(this.playQueue);
        this.el.on('animationend', function() {
            this.playQueue();
        }, this);

        this.callSuper(options);
    }

    /**
     * @method play
     * @param Object [options]
     * @return $.Animation
     */
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

    /**
     * @private
     * @method playQueue
     * @return $.Animation
     */
    ,playQueue: function() {
        if (!this.queue || !this.queue.length) {
            return this;
        }
        this.concurrent = true;

        var item = this.queue.shift();

        this.play(item);
        return this;
    }

    /**
     * @method fade
     * @param Object [options]
     * @param Number [opacity]
     * @return $.Animation
     */
    ,fade: function(options, opacity) {
        var currentOpacity = parseFloat(this.el.getStyle('opacity'));
        return this[currentOpacity == 1? 'fadeOut' : 'fadeIn'](options, opacity);
    }

    /**
     * @method fadeInt
     * @param Object [options]
     */
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

    /**
     * @method fadeOut
     * @param Object [options]
     * @return $.Animation
     */
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

    /**
     * @method moveTo
     * @param Number x
     * @param Number [y]
     * @param Object [options]
     * @return $.Animation
     */
    ,moveTo: function(x, y, options) {
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

    /**
     * @method moveToX
     * @param Number x
     * @param Object [options]
     * @return $.Animation
     */
    ,moveToX: function(x, options) {
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

    /**
     * @method moveToY
     * @param Number y
     * @param Object [options]
     * @return $.Animation
     */
    ,moveToY: function(y, options) {
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

    /**
     * @method slideUp
     * @param Object [options]
     * @return $.Animation
     */
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

    /**
     * @method slideDown
     * @param Object [options]
     * @return $.Animation
     */
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

    /**
     * @method slide
     * @param Object [options]
     * @return $.Animation
     */
    ,slide: function(options) {
        return this[this._originalBeforeFx? 'slideDown' : 'slideUp'](options);
    }

    /**
     * @method rotate
     * @param Object [options]
     * @param String [property]
     * @return $.Animation
     */
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