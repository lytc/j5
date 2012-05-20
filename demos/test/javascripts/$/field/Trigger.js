//= require ./Text

$.field.Text.extend('$.field.Trigger trigger', {
    baseClasses: 'x-field x-field-text x-field-trigger'

    ,initElement: function() {
        this.callSuper();

        this.triggerButton = this.fieldWrap.add({
            xtype: 'button'
            ,classes: 'x-trigger-button'
            ,icon: 'chevron-down'
        });

        this.triggerButton.on('click', function() {
            this.inputEl.focus();
        }, this);
    }

    ,setTriggerButton: function(options) {
        this.triggerButton.applyOptions(options);
        return this;
    }
});