//= require ./Component

/**
 * @class $.Loading
 */
$.Component.extend('$.Loading', {
    baseClasses: 'x-loading'

    ,initElement: function() {
        this.callSuper();

        this.spinnerEl = this.append({
            classes: 'x-spinner'
        });

        this.messageEl = this.append({
            dom: '<span>'
            ,classes: 'x-message'
        });

        for (var i = 0; i < 12; i ++) {
            this.spinnerEl.append({
                styles: {
                    transform: 'rotate(' + (i * 30) + 'deg) translate(0, -142%)'
                    ,animationDelay: (0.08333333333333333 * i) + 's'
                }
            });
        }
    }

    ,setDuration: function(duration) {
        var delay = 0.08333333333333333 * duration;

        this.spinnerEl.children().each(function(el) {
            el.setStyles({
                animationDuration: duration + 's'
                ,animationDelay: (delay * el.index()) + 's'
            });
        });
        return this;
    }

    ,setColor: function(color) {
        this.spinnerEl.children().each(function(el) {
            el.setStyles({
                background: color
            });
        });
        return this;
    }

    ,setMessage: function(message) {
        if ('string' == typeof message) {
            message = {html: message};
        }
        this.messageEl.applyOptions(message);
        return this;
    }

    ,setSize: function(size) {
        this.spinnerEl.setSize(size);
        return this;
    }
});