//= require ./Field
//= require ./mixins/Labelable

$.field.Field.extend('$.field.Range field.range', {
    baseClasses: 'x-field x-field-range'
    ,includes: [$.field.mixins.Labelable]

    ,initElement: function() {
        this.callSuper();

        this.slider = this.fieldWrap.add(new $.Slider());
        this.inputEl = this.slider.inputEl;

        // fallback methods
        var fallbackMethods = ['setMin', 'setMax', 'setValue', 'getValue', 'setStep', 'goNext', 'goPrev'];
        $.each(fallbackMethods, function(method) {
            this[method] = this.slider[method].bind(this.slider);
        }, this);
    }

    ,setInput: function(options) {
        this.slider.applyOptions(options);
        return this;
    }
});