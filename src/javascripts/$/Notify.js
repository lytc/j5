//= require ./Alert

/**
 * @class $.Notify
 */
$.Alert.extend('$.Notify notify', {
    baseClasses: 'x-notify x-alert'

    ,defaultOptions: $.readOnlyObject({
        appendTo: 'body'
        ,hidden: true
        ,hideDelay: 5000
    })

    ,constructor: function() {
        this.callSuper(arguments);

        this.on('show', function() {
            this.updatePosition();
        });
    }

    ,setPosition: function(position) {
        this.position = position;
        return this;
    }

    ,updatePosition: function() {
        if (!this.position) {
            return this;
        }

        var pos = {
            top: 'auto'
            ,right: 'auto'
            ,bottom: 'auto'
            ,left: 'auto'
        };

        var position = this.position;

        if ('string' != typeof position) {
            (position instanceof Array) || (position = [position]);
            pos.top = position[0];
            pos.left = position[1];
        } else {
            position = position.split(' ');

            if (position[0] == 'center') {
                pos.top = ((window.innerHeight - this.getHeight()) / window.innerHeight * 50) + '%';
            } else {
                pos[position[0]] = 0;
            }

            if (position[1] == 'center') {
                pos.left = ((window.innerWidth - this.getWidth()) /window.innerWidth * 50) + '%';
            } else {
                pos[position[1]] = 0;
            }
        }

        for (var i in pos) {
            if ('number' == typeof pos[i]) {
                pos[i] = pos[i] + 'px';
            }
        }

        this.setStyles(pos);

        return this;
    }

    ,setHideDelay: function(miniseconds) {
        if (this.isVisible()) {
            this.hide.bind(this).defer(miniseconds);
        }
        this.on('show', function() {
            this.hide.bind(this).defer(miniseconds);
        });
    }
});