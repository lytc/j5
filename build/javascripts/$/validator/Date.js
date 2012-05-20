//= require ../Validator

$.Validator.types['date'] =

    $.Validator.extend('$.validator.Date', {
        min: null
        ,max: null
        ,minMessage: 'The date in this field must be equal to or after {0}'
        ,maxMessage: 'The date in this field must be equal to or before {0}'
        ,invalidMessage: '{0} is not a valid date - it must be in the format {1}'

        ,setMin: function(min) {
            this.min = min;
            return this;
        }

        ,setMax: function(max) {
            this.max = max;
            return this;
        }

        ,validate: function() {
            var value = this.getValue();

            this.messages = [];
            if (undefined === value || null === value || '' === value) {
                return true;
            }

            var isValid = true
                ,format = this.field.calendar.format
                ,d = $.Date.parse(value, format);

            if (false === d || !d.isValid()) {
                this.messages.push($.String.format(this.invalidMessage, value, format));
                isValid = false;
            } else {
                if (this.min) {
                    if ('string' == typeof this.min) {
                        this.min = $.Date.parse(this.min, this.field.calendar.format);
                    }
                    if (this.min.getTime() > d.getTime()) {
                        this.messages.push($.String.format(this.minMessage, this.min.format(format)));
                        isValid = false;
                    }
                }

                if (this.max) {
                    if ('string' == typeof this.max) {
                        this.max = $.Date.parse(this.max, this.field.calendar.format);
                    }

                    if (this.max.getTime() < d.getTime()) {
                        this.messages.push($.String.format(this.maxMessage, this.max.format(format)));
                        isValid = false;
                    }
                }
            }

            return isValid;
        }
    });