//= require ./Component

/**
 * @class $.Section
 */
$.Component.extend('$.Section section', {
    tag: 'section'
    ,baseClasses: 'x-section'

    ,initElement: function() {
        this.callSuper();

        this.headerComponent = this.add({
            dom: '<header>'
            ,classes: 'x-header'
        });

        this.bodyComponent = this.add({
            dom: '<div>'
            ,classes: 'x-body'
        });
    }

    ,setHeader: function(options) {
        options || (options = {});
        if ('string' == typeof options) {
            options = {html: options};
        }

        this.headerComponent.applyOptions(options);
        return this.headerComponent;
    }

    ,setBody: function(options) {
        options || (options = {});
        if ('string' == typeof options) {
            options = {html: options};
        }

        this.bodyComponent.applyOptions(options);
        return this.bodyComponent;
    }

    ,setCollapsible: function(bool) {
        if (bool) {
            if (!this._collapsibleCallback) {
                this._collapsibleCallback = function() {
                    var isCollapsed = this.isCollapsed();

                    if (bool == 'radio') {
                        this.deRadioClasses('x-collapsed');
                        this.removeClasses('x-collapsed');
                    } else if (bool == 'checkbox') {
                        this.toggleClasses('x-collapsed');
                        if (isCollapsed) {
                            this.deRadioClasses('x-collapsed');
                        }
                    } else {
                        this.toggleClasses('x-collapsed');
                    }

                    this.trigger('toggleCollapse', isCollapsed);
                }.bind(this)
            }

            this.headerComponent.on('click', this._collapsibleCallback);
        } else {
            if (this._collapsibleCallback) {
                this.headerComponent.un('click', this._collapsibleCallback);
            }
        }
        return this;
    }

    ,setCollapsed: function(bool) {
        if (!this._collapsibleCallback) {
            this.setCollapsible(true);
        }

        this.switchClasses(bool, 'x-collapsed');

        return this;
    }

    ,isCollapsed: function() {
        return this.hasClasses('x-collapsed');
    }
});