//= require ./Component

$.Component.extend('$.Alert alert', {
    baseClasses: 'x-alert'

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
    }

    ,setHtml: function(html) {
        this.contentEl.setHtml(html);
        return this;
    }

    ,setType: function(type) {
        this.addClasses('x-' + type);
        return this;
    }
});