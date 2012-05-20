$.Component.extend('$.button.Group button.group', {
    baseClasses: 'x-button-group'
    ,defaultChildType: 'button'

    ,constructor: function(options) {
        options = $.extend({
            scale: 'small'
        }, options);

        this.callSuper([options]);
    }
    
    ,setScale: function(scale) {
        $.each(this.children(), function(button) {
            button.setScale(scale);
        });

        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.scale = scale;

        return this;
    }

    ,setToggleable: function(bool) {
        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.toggleable = bool;

        $.each(this.children(), function(button) {
            button.setToggleable(bool);
        });
        return this;
    }

    ,setRadioable: function(bool) {
        this.requiredDefaults || (this.requiredDefaults = {});
        this.requiredDefaults.radioable = bool;

        $.each(this.children(), function(button) {
            button.setRadioable(bool);
        });
        return this;
    }
});