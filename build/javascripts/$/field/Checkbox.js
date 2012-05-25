//= require ./Field
//= require ./mixins/Labelable
//= require ./mixins/BoxLabelable

/**
 * @class $.field.Checkbox
 */
$.field.Field.extend('$.field.Checkbox field.checkbox', {
	baseClasses: 'x-field x-field-checkbox'
    ,includes: [
        $.field.mixins.Labelable
        ,$.field.mixins.BoxLabelable
    ]

	,checkedValue: 1
	,uncheckedValue: 0
	
	,initElement: function() {
		this.callSuper();
		var input = this.fieldWrap.add({
            tag: 'input'
            ,attr: {
                type: 'checkbox'
            }
        });
		this.inputEl = input.el;
		this.inputEl.setWidth = this.inputEl.setHeight = $.emptyFn;
	}
	
	,setValue: function(value) {
		this.inputEl.dom.checked = !!value;
		return this;
	}
	
	,getValue: function() {
		return this.inputEl.dom.checked? this.checkedValue : this.uncheckedValue;
	}

    ,isChecked: function() {
        return this.inputEl.dom.checked;
    }
	
	,setChecked: function(bool) {
		this.inputEl.dom.checked = !!bool;
		return this;
	}

    ,setCheckedValue: function(value) {
        this.checkedValue = value;
        return this;
    }

    ,setUncheckedValue: function(value) {
        this.uncheckedValue = value;
        return this;
    }
});