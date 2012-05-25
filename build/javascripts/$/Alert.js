//= require ./Component

/**
 * @class $.Alert
 * @superclass $.Component
 */
$.Component.extend('$.Alert alert', {
    /**
     * @private
     * @property String baseClasses
     */
    baseClasses: 'x-alert'

    /**
     * @private
     * @method initElement
     * @return $.Alert
     */
    ,initElement: function() {
        this.callSuper();

        this.closeEl = this.el.append({
            dom: '<a>'
            ,classes: 'x-close'
            ,html: '+'
            ,listeners: {
                click: function() {
                    this.hide();
                }.bind(this)
            }
        });

        this.contentEl = this.el.append({
            classes: 'x-content'
        });

        return this;
    }

    /**
     * @method setHtml
     * @param String html
     * @return $.Alert
     */
    ,setHtml: function(html) {
        this.contentEl.setHtml(html);
        return this;
    }

    /**
     * @method setType
     * @param String type
     * @return $.Alert
     */
    ,setType: function(type) {
        this.addClasses('x-' + type);
        return this;
    }
});