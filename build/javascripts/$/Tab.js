//= require ./Component

/**
 * @class $.Tab
 */
$.Component.extend('$.Tab tab', {
    tag: 'article'
    ,baseClasses: 'x-tab'
    ,defaultChildType: 'section'

    ,constructor: function(options) {
        options = $.extend({
            defaults: {
                collapsible: 'radio'
                ,collapsed: true
            }
            ,activeItem: 0
        }, options || {}, true);

        this.callSuper([options]);
    }

    ,setActiveItem: function(tab) {
        if (this._isInitItem) {
            if ('number' == typeof tab) {
                tab = this.child(tab);
            }

            tab.setCollapsed(false);
        } else {
            this.on('inititem', function() {
                this.setActiveItem(tab);
            });
        }
    }

    ,getActiveItem: function() {
        return this.query('> :not(.x-collapsed)');
    }
});