//= require ./Component

/**
 * @class $.ProgressBar
 */
$.Component.extend('$.ProgressBar progressbar', {
    baseClasses: 'x-progressbar'
    
    ,constructor: function(options) {
        options = $.extend({
            width: 200 
        }, options);
        
        this.callSuper([options]);
    }

    ,initElement: function() {
        this.callSuper();

        this.textBackEl = this.el.append({
            classes: 'x-progressbar-text-back'
        });

        this.barEl = this.el.append({
            classes: 'x-progressbar-bar'
        });

        this.textEl = this.barEl.append({
            classes: 'x-progressbar-text'
            ,width: this.el.getWidth()
        });
    }

    ,setWidth: function() {
        this.el.setWidth.apply(this.el, arguments);
        this.textEl.setWidth.apply(this.textEl, arguments);
        return this;
    }

    ,setPercentage: function(percentage) {
        this.percentage = percentage;
        this.barEl.setWidth(percentage + '%');
        return this;
    }

    ,setStriped: function(bool) {
        this.switchClasses(bool, 'x-progressbar-striped');
        return this;
    }

    ,setAnimate: function(bool) {
        this.switchClasses(bool, 'x-progressbar-animate');
        return this;
    }

    ,setTransition: function() {
        this.switchClasses(bool, 'x-progressbar-transition');
        return this;
    }

    ,setHtml: function(html) {
        if (undefined !== html) {
            this.html = html;
        }

        html = html.format(Math.round(this.percentage) + '%');
        this.textBackEl.setHtml(html);
        this.textEl.setHtml(html);

        return this;
    }

    ,setLoop: function(options) {
        if (false === options) {
            if (this.progressTask) {
                this.progressTask.stop();
            }
            return this;
        }

        if (true === options) {
            if (this.progressTask) {
                this.progressTask.start();
                return this;
            }
            options = {};
        } else if ('number' == typeof options) {
            options = {count: options};
        }

        if (this.progressTask) {
            this.progressTask.stop();
        }

        options = $.extend({
            duration: 5000
            ,count: 1
        }, options);


        var step = 2000 / options.duration;

        this.percentage || (this.percentage = 0);

        var task = this.progressTask = new $.Task({
            interval: 20
            ,callback: function() {
                this.setPercentage(this.percentage)
                    .setHtml(this.html || '{0}');

                if (this.percentage > 100) {
                    options.count--;
                    this.percentage = 0;
                }

                if (options.count == 0) {
                    this.setAnimate(false);
                    task.stop();
                    return;
                }

                this.percentage += step;
            }.bind(this)
        });

        task.start();

        return this;
    }
});