//= require ./Trigger

/**
 * @class $.field.DateTime
 */
$.field.Trigger.extend('$.field.DateTime field.datetime', {
    baseClasses: 'x-field x-field-text x-field-trigger x-field-datetime'

    ,initElement: function() {
        this.callSuper();

        var me = this;
        this.calendar = this.fieldWrap.add({
            xtype: 'calendar'
            ,classes: 'x-hidden'
            ,listeners: {
                mousedown: function() {
                    this.inputEl.un('blur', hideOnBlurCallback);
                }.bind(this)

                ,select: function() {
                    me.setValue(me.calendar.toString());
                    this.hide();
                }

                ,show: function() {
                    if (!me.isValid()) {
                        return;
                    }

                    var value = me.getValue();
                    if (value && me.calendar.toString() != value) {
                        me.calendar.setValue(value);
                    }
                }
            }
        });

        var hideOnBlurCallback = function(e) {
            this.calendar.hide(100);
        }.bind(this);

        this.triggerButton.on('mousedown', function() {
            this.inputEl.un('blur', hideOnBlurCallback);
        }, this);

        this.triggerButton.on('mouseup', function() {
            this.calendar.toggleDisplay();
            this.inputEl.on('blur', hideOnBlurCallback);
        }, this);
    }

    ,setCalendar: function(options) {
        this.calendar.applyOptions(options);
        return this;
    }

    ,setFormat: function(format) {
        this.calendar.setFormat(format);
        return this;
    }

    ,setTimeSelect: function(bool) {
        this.calendar.setTimeSelect(bool);
        return this;
    }
});