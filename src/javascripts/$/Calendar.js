//= require ./Component

/**
 * @class $.Calendar
 * @superclass $.Component
 */
$.Component.extend('$.Calendar calendar', {
    /**
     * @private
     * @property String baseClasses
     * @default x-calendar
     */
    baseClasses: 'x-calendar'

    /**
     * @private
     * @property Object defaultOptions
     * @default {format: 'm/d/Y', timeSelect: false}
     */
    ,defaultOptions: $.readOnlyObject({
        format: 'm/d/Y'
        ,timeSelect: false
    })

    /**
     * @method constructor
     * @param Object [options]
     * @return $.Calendar
     */
    ,constructor: function(options) {
        this.callSuper(arguments);

        this.on('change', function() {
            update();
        });

        var cells;
        var update = function() {
            var value = this.getValue();
            this.monthYearPickerText.setHtml(value.format('F Y'));

            if (this.monthYearPickerPanel.isVisible()) {
                this.monthPickerPanel.child(value.getMonth()).radioClasses('x-selected');
            }

            var year = value.getFullYear()
                ,start = Math.floor(year / 10) * 10;

            $.each(this.yearPickerBody.children(), function(item) {
                item.setValue(start).setHtml(start);
                item.removeClasses('x-selected');
                if (start == year) {
                    item.addClasses('x-selected');
                }
                start++;
            });

            var daysInMonth = value.getDaysInMonth()
                ,firstDay = value.getFirstDateOfMonth().getDay();

            var range = [].range(1, daysInMonth + 1);

            if (firstDay > 0) {
                var daysInMonthOfLastMonth = value.last('1 month').getDaysInMonth();
                for (var i = 0; i < firstDay; i++) {
                    range.unshift(daysInMonthOfLastMonth);
                    daysInMonthOfLastMonth--;
                }
            }

            var notActivePrev = [].range(0, firstDay);
            var notActiveNext = [];
            for (var i = 1, end = 42 - range.length; i <= end; i++) {
                range.push(i);
                notActiveNext.push(range.length - 1);
            }

            if (!cells) {
                cells = this.body.queryAll('a');
            };

            var date = this.getValue().getDate()
                ,cValue
                ,idx;

            $.each(cells, function(cell, index) {
                cValue = range[index];

                cell.setHtml(range[index]).addClasses('x-active').removeClasses('x-selected');

                if (-1 != (idx = notActivePrev.indexOf(index))) {
                    cValue = idx - firstDay + 1;
                    cell.removeClasses('x-active');
                }

                if (-1 != (idx = notActiveNext.indexOf(index))) {
                    cValue = idx + daysInMonth + 1;
                    cell.removeClasses('x-active');
                }

                cell.setValue(cValue);

                if (date == cValue) {
                    cell.addClasses('x-selected');
                }
            });

            this.fullInfo.setHtml(value.format(this.format));

        }.bind(this)

        update();
    }

    /**
     * @private
     * @method initElement
     * @return $.Calendar
     */
    ,initElement: function() {
        this.callSuper();

        var me = this;

        this.header = this.add({
            classes: 'x-header'
        });

        this.prevBt = this.header.add({
            xtype: 'button'
            ,classes: 'x-prev'
            ,icon: 'chevron-left'
            ,scale: 'mini'
            ,click: function() {
                me.change(function() {
                    me.getValue().add('-1 month');
                });
            }
        });

        this.mothYearPicker = this.header.add({
            classes: 'x-month-year-picker'
            ,listeners: {
                click: function() {
                    this.toggleDisplayMonthYearPicker();
                }.bind(this)
            }
        });

        this.monthYearPickerText = this.mothYearPicker.add({
            tag: 'span'
            ,classes: 'x-text'
            ,html: this.getValue().format('F Y')
        });

        this.nextBt = this.header.add({
            xtype: 'button'
            ,classes: 'x-next'
            ,icon: 'chevron-right'
            ,scale: 'mini'
            ,click: function() {
                me.change(function() {
                    me.getValue().add('1 month');
                });
            }
        });

        this.monthYearPickerPanel = this.add({
            classes: 'x-month-year-picker-panel x-hidden'
        });

        this.monthPickerPanel = this.monthYearPickerPanel.add({
            classes: 'x-panel x-month-picker-panel'
        });

        $.each($.Date.monthNames, function(name) {
            this.monthPickerPanel.add({
                tag: 'a'
                ,classes: 'x-item'
                ,html: name.substr(0, 3)
                ,listeners: {
                    click: function(e, el) {
                        me.change(function() {
                            me.getValue().setMonth(el.getIndex());
                        });
                    }
                }
            });
        }, this);

        this.yearPickerPanel = this.monthYearPickerPanel.add({
            classes: 'x-panel x-year-picker-panel'
        });

        this.yearPickerPanel.add({
            xtype: 'button'
            ,classes: 'x-prev'
            ,scale: 'mini'
            ,icon: 'chevron-left'
            ,click: function() {
                var year = me.value.getFullYear()
                    ,value;
                $.each(me.yearPickerBody.children(), function(item) {
                    value = parseInt(item.getValue()) - 10;
                    item.setValue(value).setHtml(value).removeClasses('x-selected');

                    if (value == year) {
                        item.radioClasses('x-selected');
                    }
                });
            }
        });

        this.yearPickerPanel.add({
            xtype: 'button'
            ,classes: 'x-next'
            ,scale: 'mini'
            ,icon: 'chevron-right'
            ,click: function() {
                var year = me.value.getFullYear()
                    ,value;
                $.each(me.yearPickerBody.children(), function(item) {
                    value = parseInt(item.getValue()) + 10;
                    item.setValue(value).setHtml(value).removeClasses('x-selected');

                    if (value == year) {
                        item.radioClasses('x-selected');
                    }
                });
            }
        });

        this.yearPickerBody = this.yearPickerPanel.add({
            classes: 'x-body'
            ,children: function() {
                var result = [];
                for (var i = 0; i < 10; i++) {
                    result.push({
                        tag: 'a'
                        ,classes: 'x-item'
                        ,listeners: {
                            click: function(e, el) {
                                this.radioClasses('x-selected');
                                me.change(function() {
                                    me.getValue().setFullYear(el.getValue());
                                });
                            }
                        }
                    });
                }
                return result;
            }()
        });

        this.monthYearPickerPanel.add({
            xtype: 'button'
            ,html: 'Close'
            ,click: function() {
                me.monthYearPickerPanel.hide();
            }
        });

        var hour = new $.field.Text({

        });

        var minute = new $.field.Text({

        });

        this.timePickerPanel = this.add({
            xtype: 'modal'
            ,children: {
                classes: 'x-time-picker-panel'
                ,children: [
                    {
                        classes: 'x-input-group'
                        ,children: [
                            hour
                            ,{
                                html: ':'
                            }
                            ,minute
                        ]
                    },{
                        xtype: 'button'
                        ,html: 'Ok'
                        ,click: function() {
                            me.timePickerPanel.hide();

                            var v = me.getValue()
                                ,h = hour.getValue().toFloat()
                                ,m = minute.getValue().toFloat();

                            me.change(function() {
                                v.setHours(h);
                                v.setMinutes(m);
                            });

                            me.trigger('select');
                        }
                    },{
                        xtype: 'button'
                        ,html: 'Cancel'
                        ,click: function() {
                            me.timePickerPanel.hide();
                            me.trigger('select');
                        }
                    }
                ]
            }

            ,listeners: {
                show: function() {
                    hour.setValue(me.getValue().format('H'));
                    minute.setValue(me.getValue().format('m'));
                }
            }
        });

        this.body = this.add({
            classes: 'x-body'
            ,children: {
                tag: 'table'
                ,children: [
                    {
                        tag: 'thead'
                        ,children: function() {
                            var cells = [];
                            $.each($.Date.dayNames, function(item) {
                                cells.push({
                                    tag: 'th'
                                    ,html: item[0]
                                });
                            });
                            return cells;
                        }()
                    },{
                        tag: 'tbody'
                        ,children: function() {
                            var rows = [];
                            for (var i = 0; i < 6; i++) {
                                rows.push({
                                    tag: 'tr'
                                    ,children: function() {
                                        var cells = [];
                                        for (var i = 0; i < 7; i++) {
                                            cells.push({
                                                tag: 'td'
                                                ,children: {
                                                    tag: 'a'
                                                    ,listeners: {
                                                        click: function(e, el) {
                                                            if (me.timeSelect) {
                                                                me.change(function() {
                                                                    me.getValue().setDate(el.getValue());
                                                                });
                                                                me.timePickerPanel.show();
                                                            } else {
                                                                me.change(function() {
                                                                    me.getValue().setDate(el.getValue());
                                                                });
                                                                me.trigger('select');
                                                            }
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        return cells;
                                    }()
                                });
                            }
                            return rows;
                        }()
                    }
                ]
            }
        });

        this.fullInfo = new $.Component({
            classes: 'x-full-info'
        });

        this.footer = this.add({
            classes: 'x-footer'
            ,children: [
                this.fullInfo
                ,{
                    xtype: 'button'
                    ,html: 'Today'
                    ,click: function() {
                        me.change(function() {
                            me.setValue(new Date);
                        });
                        me.trigger('select');
                    }
                }
            ]
        });

        return this;
    }

    /**
     * @method toggleDisplayMonthYearPicker
     * @return $.Calendar
     */
    ,toggleDisplayMonthYearPicker: function() {
        this.monthYearPickerPanel.toggleClasses('x-hidden');
        if (this.monthYearPickerPanel.hasClasses('x-hidden')) {
            return this;
        }

        var year = this.getValue().getFullYear()
            ,start = Math.floor(year / 10) * 10;

        $.each(this.yearPickerBody.children(), function(item) {
            item.setValue(start).setHtml(start);
            if (start == year) {
                item.radioClasses('x-selected');
            }
            start++;
        });

        var month = this.getValue().getMonth();
        this.monthPickerPanel.child(month).radioClasses('x-selected');

        return this;
    }

    /**
     * @method setValue
     * @param Mixed value
     * @param String format
     * @return $.Calendar
     */
    ,setValue: function(value, format) {
        if ('string' == typeof value) {
            this.getValue().from(value, format);
        } else {
            this.value = $.Date(value);
        }
        this.trigger('change');
        return this;
    }

    /**
     * @method getValue
     * @return $.Date
     */
    ,getValue: function() {
        if (!this.value) {
            this.value = $.Date();
        }
        return this.value;
    }

    /**
     * @private
     * @method change
     * @param Function callback
     * @return $.Calendar
     */
    ,change: function(callback) {
        callback();
        this.trigger('change');
        return this;
    }

    /**
     * @method setFormat
     * @param String format
     * @return $.Calendar
     */
    ,setFormat: function(format) {
        this.format = format;
        this.fullInfo.setHtml(this.getValue().format(this.format));

        return this;
    }

    /**
     * @method from
     * @param String input
     * @param String format
     * @return $.Calendar
     */
    ,from: function(input, format) {
        return this.setValue(input, format);
    }

    /**
     * @method setTimeSelect
     * @param Boolean bool
     * @return $.Calendar
     */
    ,setTimeSelect: function(bool) {
        this.timeSelect = bool;
        return this;
    }

    /**
     * @method toString
     * @return String
     */
    ,toString: function() {
        return this.getValue().format(this.format);
    }
});