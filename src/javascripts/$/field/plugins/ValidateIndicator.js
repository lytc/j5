/**
 * @class $.field.plugins.ValidateIndicator
 */
$.define('$.field.plugins.ValidateIndicator', {
	constructor: function(field) {
        if (field.isRendered()) {
            render();
        } else {
            field.on('render:input', function() {
                render();
            });
        }

        var render = function() {
            var el = field.el.append('<span>');
            el.addClasses('x-field-validate-indicator');

            var tip = new $.Tip({
                target: el
                ,displayOn: 'hover'
            });
            tip.el.hide();
            el.append(tip.el);

            field.on('validate', function(isValid, validator) {
                if (isValid) {
                    tip.el.hide();
                } else {
                    tip.setHtml(validator.messages.join('<br />'));
                    tip.el.show();
                }
            });
        }.bind(this);
	}
});