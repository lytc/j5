
$.define('$.field.mixins.Validateable', {
    setValidates: function(validates) {
        if (!this.validateIndicatorEl) {
            var el = this.validateIndicatorEl = this.el.append({
                dom: '<span>'
                ,classes: 'x-validate-indicator'
            });

            var tip = new $.Tip({
                target: el
                ,displayOn: 'hover'
            });
            tip.el.hide();
            el.append(tip.el);

            this.on('validate', function(isValid, validator) {
                if (isValid) {
                    tip.el.hide();
                } else {
                    tip.setHtml(validator.messages.join('<br />'));
                    tip.el.show();
                }
            });
        }

        this.validators = [];

        (validates instanceof Array) || (validates = [validates]);
        $.each(validates, function(validate) {
            ('string' != typeof validate) || (validate = {type: validate});
            var options = $.defaults(
                validate, {
                    field: this
                    ,getValue: this.getValue.bind(this)

                    ,callback: function(isValid, validator) {
                        this.trigger('validate', isValid, validator);
                    }.bind(this)

                    ,validCallback: function(validator) {
                        this.trigger('valid', validator);
                    }.bind(this)

                    ,invalidCallback: function(validator) {
                        this.trigger('invalid', validator);
                    }
                }
            );

            var validator = new $.Validator.types[validate.type](options);
            this.validators.push(validator);
        }, this);
    }
});