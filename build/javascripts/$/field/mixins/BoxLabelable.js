$.define('$.field.mixins.BoxLabelable', {
    setBoxLabel: function(options) {
        if ('string' == typeof options) {
            options = {html: options};
        }

        if (!this.boxLabelEl) {
            this.addClasses('x-boxlabelable');
            this.boxLabelEl = new $.Element({
                dom: '<label>'
                ,classes: 'x-box-label'
            });

            this.boxLabelEl.insertAfter(this.inputEl);
        }
        this.boxLabelEl.applyOptions(options);
        return this;
    }
});
