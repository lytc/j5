//= require ./Class

/**
 * @class $.Date
 */
(function() {
    var dayNames = [
        'Sunday'
        ,'Monday'
        ,'Tuesday'
        ,'Wednesday'
        ,'Thursday'
        ,'Friday'
        ,'Saturday'
    ];

    var monthNames = [
        'January'
        ,'February'
        ,'March'
        ,'April'
        ,'May'
        ,'June'
        ,'July'
        ,'August'
        ,'September'
        ,'October'
        ,'November'
        ,'December'
    ]

    $.Date = function(year /* milliseconds, dateString */, month, day, hour, minute, second, millisecond) {
        var d;

        if (year instanceof Date) {
            d = year;
            if (d.clone) {
                return d;
            }
        } else {
            if (year && arguments.length) {
                if (arguments.length == 1) {
                    d = new Date(year);
                } else {
                    d = new Date(year, month, day, hour || 0, minute || 0, second || 0, millisecond || 0);
                }
            } else {
                d = new Date;
            }
        }

        $.extend(d, {
            /**
             * @method clone
             * @return $.Date
             */
            clone: function() {
                return $.Date(this.getTime());
            }

            /**
             * @method from
             * @param String input
             * @param String [format]
             * @return $.Date
             */
            ,from: function(input, format) {
                var d = $.Date.parse(input, format);
                this.setTime(d.getTime());
                return this;
            }

            /**
             * @method isValid
             * @return Boolean
             */
            ,isValid: function() {
                return !isNaN(this.getTime());
            }

            /**
             * @method next
             * @param String format
             * @return $.Date
             */
            ,next: function(format) {
                return $.Date.parse('next ' + format, this.clone());
            }

            /**
             * @method last
             * @param String format
             * @return $.Date
             */
            ,last: function(format) {
                return $.Date.parse('last ' + format, this.clone());
            }

            /**
             * @method add
             * @param String|Number value
             * @param String type
             * @return $.Date
             */
            ,add: function(value, type) {
                if (!type) {
                    var operator = value[0];
                    if (operator != '+' && operator != '-') {
                        operator = '+';
                    }

                    var matches = value.match(/(\d+\s+\w+)/g);
                    $.each(matches, function(match) {
                        match = match.split(/\s+/);
                        this.add(operator + match[0], match[1]);
                    }.bind(this));
                } else {
                    var day;
                    value = parseFloat(value);

                    switch (type) {
                        case 'year':
                        case 'years':
                            if (this.getMonth() == 1) {
                                var clone = this.clone();
                                clone.setFullYear(this.getFullYear() + value);
                                if (!clone.isLeapYear() && this.getDate() == 29) {
                                    this.setDate(28);
                                }
                            }
                            this.setFullYear(this.getFullYear() + value);
                            break;

                        case 'month':
                        case 'months':
                            var day = this.getDate()
                                ,month = this.getMonth()
                                ,d = $.Date(this.getFullYear(), month + value, 1)
                                ,daysInMonth = d.getDaysInMonth();

                            if (daysInMonth < day) {
                                this.setDate(daysInMonth);
                            }

                            this.setMonth(month + value);
                            break;

                        case 'week':
                        case 'weeks':
                            this.add(value * 7, 'day');
                            break;

                        case 'day':
                        case 'days':
                            this.setDate(this.getDate() + value);
                            break;

                        case 'hour':
                        case 'hours':
                            this.setHours(this.getHours() + value);
                            break;

                        case 'minute':
                        case 'minutes':
                            this.setMinutes(this.getMinutes() + value);
                            break;

                        case 'second':
                        case 'seconds':
                            this.setSeconds(this.getSeconds() + value);
                            break;

                        case 'millisecond':
                        case 'milliseconds':
                            this.setMilliseconds(this.getMilliseconds() + value);
                    }
                }
                return this;
            }

            /**
             * @method getSuffix
             * @return String
             */
            ,getSuffix: function() {
                switch (this.getDate()) {
                    case 1:
                    case 21:
                    case 31:
                        return 'st';

                    case 2:
                    case 22:
                        return 'nd';

                    case 3:
                    case 23:
                        return 'rd';

                    default:
                        return 'th';
                }
            }

            /**
             * @method getDayOfYear
             * @return Number
             */
            ,getDayOfYear: function() {
                var c = new Date(this.getFullYear(), 0, 1);
                return Math.ceil((this - c) / 86400000) - 1;
            }

            /**
             * @method getWeekOfYear
             * @return Number
             */
            ,getWeekOfYear: function() {
                var c = new Date(this.getFullYear(), 0, 1);
                return Math.ceil((((this - c) / 86400000) + c.getDay() + 1) / 7);
            }

            /**
             * @method getDaysInMonth
             * @return Number
             */
            ,getDaysInMonth: function() {
                var c = new Date(this.getFullYear(), this.getMonth() + 1, 0);
                return c.getDate();
            }

            /**
             * @method getFirstDateOfMonth
             * @return $.Date
             */
            ,getFirstDateOfMonth : function() {
                return $.Date(this.getFullYear(), this.getMonth(), 1);
            }

            /**
             * @method getLastDateOfMonth
             * @return $.Date
             */
            ,getLastDateOfMonth : function() {
                return $.Date(this.getFullYear(), this.getMonth(), this.getDaysInMonth());
            }

            /**
             * @method getLastDayOfMonth
             * @return $.Date
             */
            ,getLastDayOfMonth : function() {
                return this.getLastDateOfMonth().getDay();
            }

            /**
             * @method isLeapYear
             * @return Boolean
             */
            ,isLeapYear: function() {
                var y = this.getFullYear();
                return !(y % 4) && (y % 100) || !(y % 400) ? true : false;
            }

            /**
             * @method toInternetTime
             * @return String
             */
            ,toInternetTime: function(n) {
                var s   = this.getUTCSeconds()
                    ,m  = this.getUTCMinutes()
                    ,h  = this.getUTCHours();

                h = (h == 23) ? 0 : h + 1;

                var beats = Math.abs(((h * 60 + m) * 60 + s) / 86.4).toFixed(parseInt(n));
                var length = (n > 0) ? 1 + n : 0;

                return '000'.concat(beats).slice(beats.length - length);
            }

            /**
             * @method isDst
             * @return Boolean
             */
            ,isDst: function() {
                return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == 'D';
            }

            /**
             * @method getGmtOffset
             * @param Boolean separate
             * @return String
             */
            ,getGmtOffset: function(separate) {
                var offset = this.getTimezoneOffset();
                return (offset > 0? '-' : '+')
                    + ('0' + Math.floor(Math.abs(offset / 60))).substr(-2)
                    + (separate? ':' : '')
                    + ('0' + Math.abs(offset % 60)).substr(-2)
            }

            /**
             * @method getAbbr
             * @return String
             */
            ,getAbbr: function() {
                return this.toString().replace(/(.*) ([A-Z]{1,4})(\-|\+)\d{4} (.*)/, '$2');
            }

            /**
             * @method format
             * @param String [format]
             * @return String
             */
            ,format: function(format) {
                return format.replace(/\w/g, function(m, index) {
                    if ('\\' == format.charAt(index - 1)) {
                        return m;
                    }
                    return from(m, format);
                }).stripSlashes();

                function from(code, format) {
                    switch (code) {
                        //Day	---	---
                        case 'd':	// Day of the month, 2 digits with leading zeros	01 to 31
                            var day = d.getDate();
                            return ('0' + day).substr(-2);

                        case 'D':   // A textual representation of a day, three letters	Mon through Sun
                            return dayNames[d.getDay()].substr(0, 3);

                        case 'j':   // 	Day of the month without leading zeros	1 to 31
                            return d.getDate();

                        case 'l':   //  (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
                            return dayNames[d.getDay()];

                        case 'N':   // 	ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0)	1 (for Monday) through 7 (for Sunday)
                            return d.getDay() + 1;

                        case 'S':   // 	English ordinal suffix for the day of the month, 2 characters	st, nd, rd or th. Works well with j
                            return d.getSuffix();

                        case 'w':   // 	Numeric representation of the day of the week	0 (for Sunday) through 6 (for Saturday)
                            return d.getDay();

                        case 'z':   // 	The day of the year (starting from 0)	0 through 365
                            return d.getDayOfYear();

                        // Week	---	---
                        case 'W':   // 	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
                            return d.getWeekOfYear();

                        //Month	---	---
                        case 'F':   // 	A full textual representation of a month, such as January or March	January through December
                            return monthNames[d.getMonth()];

                        case 'm':   // 	Numeric representation of a month, with leading zeros	01 through 12
                            return ('0' + (d.getMonth() + 1)).substr(-2);

                        case 'M':   // 	A short textual representation of a month, three letters	Jan through Dec
                            return monthNames[d.getMonth()].substr(0, 3);

                        case 'n':   // 	Numeric representation of a month, without leading zeros	1 through 12
                            return d.getMonth() + 1;

                        case 't':   // 	Number of days in the given month	28 through 31
                            return d.getDaysInMonth();

                        //Year	---	---
                        case 'L':   // 	Whether it's a leap year	1 if it is a leap year, 0 otherwise.
                            return d.isLeapYear()? 1 : 0;

                        case 'o':   // 	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
                            var result = d.getFullYear()
                                ,woy = d.getWeekOfYear()
                                ,m = d.getMonth();

                            if (woy == 1 && m > 0) {
                                result += 1;
                            } else if (woy >= 52 && m < 11) {
                                result -= 1;
                            }

                            return result;

                        case 'Y':   // 	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
                            return d.getFullYear();

                        case 'y':   // 	A two digit representation of a year	Examples: 99 or 03
                            return (d.getFullYear() + '').substr(-2);

                        //Time	---	---
                        case 'a':   // 	Lowercase Ante meridiem and Post meridiem	am or pm
                        case 'A':   // 	Uppercase Ante meridiem and Post meridiem	AM or PM
                            var h = d.getHours()
                                ,result = h < 12? 'am' : 'pm';

                            return 'A' == code? result.toUpperCase() : result;

                        case 'B':   // 	Swatch Internet time	000 through 999
                            return d.toInternetTime();

                        case 'g':   // 	12-hour format of an hour without leading zeros	1 through 12
                        case 'G':   // 	24-hour format of an hour without leading zeros	0 through 23
                        case 'h':   // 	12-hour format of an hour with leading zeros	01 through 12
                        case 'H':   // 	24-hour format of an hour with leading zeros	00 through 23
                            var h = d.getHours();

                            if ('G' == code) {
                                return h;
                            }

                            if ('H' == code) {
                                return ('0' + h).substr(-2);
                            }

                            if (h < 1) {
                                h += 12;
                            } else if (h > 12) {
                                h -= 12;
                            }

                            if ('g' == code) {
                                return h;
                            }

                            return ('0' + h).substr(-2);

                        case 'i':   // 	Minutes with leading zeros	00 to 59
                            return ('0' + d.getMinutes()).substr(-2);

                        case 's':   // 	Seconds, with leading zeros	00 through 59
                            return ('0' + d.getSeconds()).substr(-2);

                        case 'u':   // 	Microseconds (added in PHP 5.2.2)	Example: 654321
                            return d.getMilliseconds() * 1000;

                        // Timezone	---	---
                        case 'e':   // 	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
                            return d.toString().replace(/\((.*)\)$/, '$2');

                        case 'I':   //  (capital i)	Whether or not the date is in daylight saving time	1 if Daylight Saving Time, 0 otherwise.
                            return d.isDst()? 1 : 0;

                        case 'O':   // 	Difference to Greenwich time (GMT) in hours	Example: +0200
                            return d.getGmtOffset();

                        case 'P':   // 	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
                            return d.getGmtOffset(true);
                            return;

                        case 'T':   // 	Timezone abbreviation	Examples: EST, MDT ...
                            return d.getAbbr();
                            return;

                        case 'Z':   // 	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
                            return d.getTimezoneOffset() * -60;

                        // Full Date/Time	---	---
                        case 'c':   // 	ISO 8601 date (added in PHP 5)	2004-02-12T15:19:21+00:00
                            return d.format('Y-m-d\\TH:i:sP');

                        case 'r':   // 	» RFC 2822 formatted date	Example: Thu, 21 Dec 2000 16:01:07 +0200
                            return d.format('D, d M Y H:i:s O');

                        case 'U':   // 	Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)	See also time()
                            return Math.round(d.getTime() / 1000);

                        default:
                            return code;
                    }
                }
            }
        });
        return d;
    };

    $.extend($.Date, {
        /**
         * @static
         * @property Array dayNames
         */
        dayNames: dayNames

        /**
         * @static
         * @property Array monthNames
         */
        ,monthNames: monthNames

        /**
         * @method parse
         * @param String input
         * @param String format
         * @return $.Date
         */
        ,parse: function(input, format) {
            if (/^(\+|\-|next |last )/.test(input)) {
                format instanceof Date || (format = new Date);
                var d = $.Date(format);

                if (input[0] == '+' || input[0] == '-') {
                    return d.add(input);
                }

                var matches = input.match(/(next|last)\s+(\d+)?\s*(\w+)/)
                    ,operator = 'last' == matches[1]? '-' : '+'
                    ,value = parseInt(matches[2]) || 1
                    ,index = dayNames.indexOf(matches[3])
                    ,offset
                    ,fm;

                if (-1 == index) {
                    index = dayNames.map(function(i) {return i.substr(0, 3)}).indexOf(matches[3]);
                }

                if (-1 != index) {
                    var day = d.getDay();
                    offset = index - day;
                    if (offset <= 0) {
                        offset += 7;
                    }

                    if (value) {
                        offset += (7 * (value - 1));
                    }

                    fm = '{0}{1} days'.format(operator, offset);
                }

                index = monthNames.indexOf(matches[3]);
                if (-1 == index) {
                    index = monthNames.map(function(i) {return i.substr(0, 3)}).indexOf(matches[3]);
                }

                if (-1 != index) {
                    var month = d.getMonth();
                    offset = index - month;
                    if (offset <= 0) {
                        offset += 12;
                    }

                    if (value) {
                        offset += (12 * (value - 1));
                    }

                    fm = '{0}{1} months'.format(operator, offset);
                }

                if (!fm) {
                    fm = '{0}{1} {2}'.format(operator, value, matches[3]);
                }

                return d.add(fm);
            }

            if (!format || 'c' == format || 'r' == format || 'u' == format) {
                return $.Date(input);
            }

            var index = 0
                ,map = {};

            format = format.escapeRegex().replace(/\w/g, function(m, index) {
                if ('\\' == format.charAt(index - 1)) {
                    return m;
                }
                return from(m, format);
            });


            function from(code, format) {
                var name, pattern;
                index++;

                switch (code) {
                    //Day	---	---
                    case 'd':	// Day of the month, 2 digits with leading zeros	01 to 31
                        name = 'day';
                        pattern = '\\d{2}';
                        break;

                    case 'D':   // A textual representation of a day, three letters	Mon through Sun
                        name = 'shortDayName';
                        pattern = dayNames.map(function(i) {return i.substr(0, 3)}).join('|');
                        break;

                    case 'j':   // 	Day of the month without leading zeros	1 to 31
                        name = 'day';
                        pattern = '\\d{1,2}';
                        break;

                    case 'l':   //  (lowercase 'L')	A full textual representation of the day of the week	Sunday through Saturday
                        name = 'dayName';
                        pattern = dayNames.join('|');
                        break;

                    case 'z':   // 	The day of the year (starting from 0)	0 through 365
                        name = 'dayOfYear';
                        pattern = '\\d{1,3}';
                        break;

                    // Week	---	---
                    case 'W':   // 	ISO-8601 week number of year, weeks starting on Monday (added in PHP 4.1.0)	Example: 42 (the 42nd week in the year)
                        name = 'weekOfYear';
                        pattern = '\\d{1,2}';
                        break;

                    //Month	---	---
                    case 'F':   // 	A full textual representation of a month, such as January or March	January through December
                        name = 'monthName';
                        pattern = monthNames.join('|');
                        break;

                    case 'm':   // 	Numeric representation of a month, with leading zeros	01 through 12
                        name = 'month';
                        pattern = '\\d{2}';
                        break;

                    case 'M':   // 	A short textual representation of a month, three letters	Jan through Dec
                        name = 'shortMonthName';
                        pattern = monthNames.map(function(i) {return i.substr(0,3)}).join('|');
                        break;

                    case 'n':   // 	Numeric representation of a month, without leading zeros	1 through 12
                        name = 'month';
                        pattern = '\\d{1,2}';
                        break;

                    //Year	---	---
                    case 'o':   // 	ISO-8601 year number. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. (added in PHP 5.1.0)	Examples: 1999 or 2003
                    case 'Y':   // 	A full numeric representation of a year, 4 digits	Examples: 1999 or 2003
                        name = 'fullYear';
                        pattern = '\\d{4}';
                        break;

                    case 'y':   // 	A two digit representation of a year	Examples: 99 or 03
                        name = 'shortYear';
                        pattern = '\\d{2}';
                        break;

                    //Time	---	---
                    case 'a':   // 	Lowercase Ante meridiem and Post meridiem	am or pm
                    case 'A':   // 	Uppercase Ante meridiem and Post meridiem	AM or PM
                        name = 'meridiem';
                        pattern = 'am|AM|pm|PM';
                        break;

                    case 'B':   // 	Swatch Internet time	000 through 999
                        name = 'internetTime';
                        pattern = '\\d{3}';
                        break;

                    case 'g':   // 	12-hour format of an hour without leading zeros	1 through 12
                    case 'h':   // 	12-hour format of an hour with leading zeros	01 through 12
                        name = 'hour12';
                        pattern = '\\d{1,2}';
                        break;

                    case 'G':   // 	24-hour format of an hour without leading zeros	0 through 23
                    case 'H':   // 	24-hour format of an hour with leading zeros	00 through 23
                        name = 'hour';
                        pattern = '\\d{2}';
                        break;

                    case 'i':   // 	Minutes with leading zeros	00 to 59
                        name = 'minutes';
                        pattern = '\\d{2}';
                        break;

                    case 's':   // 	Seconds, with leading zeros	00 through 59
                        name = 'seconds';
                        pattern = '\\d{2}';
                        break;

                    case 'u':   // 	Microseconds (added in PHP 5.2.2)	Example: 654321
                        name = 'microseconds';
                        pattern = '\\d{6}';
                        break;

                    // Timezone	---	---
                    case 'e':   // 	Timezone identifier (added in PHP 5.1.0)	Examples: UTC, GMT, Atlantic/Azores
                        name = 'abbr';
                        pattern = '[\\w/]+';
                        break;

                    case 'O':   // 	Difference to Greenwich time (GMT) in hours	Example: +0200
                        name = 'gmtOffset';
                        pattern = '\\+\\d{4}';
                        break;

                    case 'P':   // 	Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)	Example: +02:00
                        name = 'gmtOffsetSeparate';
                        pattern = '\\+\\d{2}:\\d{2}';
                        break;

                    case 'T':   // 	Timezone abbreviation	Examples: EST, MDT ...
                        name = 'abbr';
                        pattern = '[A-Z]{1,5}';
                        break;

                    case 'Z':   // 	Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.	-43200 through 50400
                        name = 'timezoneOffset';
                        pattern = '\\-?\\d{5}';
                        break;

                    default:
                        return format;
                }

                map[name] = index;
                return '(' + pattern + ')';
            }

            var regExp = new RegExp('^' + format + '$')
                ,matches = input.match(regExp);

            if (!matches) {
                return false;
            }

            $.each(map, function(index, name) {
                map[name] = matches[index];
            });

            if (map.meridiem) {
                map.meridiem = map.meridiem.toLowerCase();
            }

            var now = new Date()
                ,Y = now.getFullYear()
                ,m = now.getMonth() + 1
                ,d = now.getDate()
                ,H, i, s, P, milliseconds;

            H = i = s = 0;
            P = '+00:00';

            $.each(map, function(value, name) {
                switch (name) {
                    case 'day':
                        d = parseFloat(value);
                        break;

                    case 'weekOfYear': // @todo implement it?
                        break;

                    case 'monthName':
                        m = monthNames.indexOf(value);
                        break;

                    case 'month':
                        m = parseFloat(value);
                        break;

                    case 'shortMonthName':
                        m = monthNames.map(function(i) {return i.substr(0, 3)}).indexOf(value);
                        break;

                    case 'fullYear':
                        Y = parseFloat(value);
                        break;

                    case 'shortYear':
                        Y = parseFloat(value);
                        Y += (Y < 70? 2000 : 1900);
                        break;

                    case 'internetTime': // @todo implement it?
                        break;

                    case 'hour12':
                        H = parseFloat(value);
                        if (map.meridiem) {
                            if (H == 12 && map.meridiem == 'am') {
                                H = 0;
                            }

                            if (H > 1 && H < 12 && map.meridiem == 'pm') {
                                H += 12;
                            }
                        }
                        break;

                    case 'hour':
                        H = parseFloat(value);
                        break;

                    case 'minutes':
                        i = parseFloat(value);
                        break;

                    case 'seconds':
                        s = parseFloat(value);
                        break;

                    case 'microseconds':
                        milliseconds = parseFloat(value) / 1000;
                        break;

                    case 'abbr':
                        value = $.Date.abbrs[value];
                        P = (value > 0? '+' : '-') + ('0' + Math.floor(Math.abs(value))).substr(-2) + ':' + ('0' + (value % 1) * 60).substr(-2);
                        break;

                    case 'gmtOffset':
                        P = value.replace(/(\d{2})/, '$1:');
                        break;

                    case 'gmtOffsetSeparate':
                        P = value;
                        break;

                    case 'timezoneOffset':
                        value = parseFloat(value) / 3600;
                        P = (value > 0? '+' : '-') + ('0' + Math.floor(Math.abs(value))).substr(-2) + ':' + ('0' + (value % 1) * 60).substr(-2);
                        break;
                }
            });

            var dateString = '{Y}-{m}-{d}T{H}:{i}:{s}{P}'.format({
                Y: ('00' + Y).substr(-4)
                ,m: ('0' + m).substr(-2)
                ,d: ('0' + d).substr(-2)
                ,H: ('0' + H).substr(-2)
                ,i: ('0' + i).substr(-2)
                ,s: ('0' + s).substr(-2)
                ,P: P
            });

            var result = $.Date(dateString);

            if (map.dayOfYear) {
                result.setMonth(0, map.dayOfYear + 1);
            }

            if (milliseconds) {
                result.setMilliseconds(milliseconds);
            }

            return result;
        }
    });


})();