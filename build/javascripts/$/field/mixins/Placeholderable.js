/**
 * @class $.field.mixins.Placeholderable
 */
$.define('$.field.mixins.Placeholderable', {
	setPlaceholder: function(value) {
        this.inputEl.setAttr('placeholder', value);
    }

    ,getPlaceholder: function() {
        return this.inputEl.getAttr('placeholder');
    }
});