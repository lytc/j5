/**
 * @class $.field.mixins.Labelable
 */
$.define('$.field.mixins.Labelable', {
    setLabel: function(options) {
        if ('string' == typeof options) {
            options = {html: options};
        }

        if (!this.labelEl) {
            this.labelEl = this.el.insert(0, {
                dom: '<label>'
                ,classes: 'x-label'
            });

            this.labelEl.setAlign = function(align) {
                switch (align) {
                    case 'top':
                        this.setStyles('display', 'block');
                        break;

                    case 'left':
                        this.setStyles('display', 'inline-block');
                        break;
                }
            }
        }
        this.labelEl.applyOptions(options);
        return this;
    }
});
