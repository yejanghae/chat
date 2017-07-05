/**
 * http://usejsdoc.org/
 */
'use strict';

const MONTH_FULL_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT_NAMES = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_FULL_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Thursday', 'Friday', 'Saturday'];
const DATE_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MERIDIEM = {
    AM: 'AM',
    PM: 'PM'
};

function _pad (target){
    return /^[0-9]{1}$/.test(target) ? '0' + target : target;
}

function _toFormat (date, format){
    return format
        .replace(/yyyy/ig, date.getFullYear())
        .replace(/yy/ig, String(date.getFullYear()).slice(2, 4))
        .replace(/MI/gi, _pad(date.getMinutes()))
        .replace(/MMMM/ig, MONTH_FULL_NAMES[date.getMonth()])
        .replace(/MMM/ig, MONTH_SHORT_NAMES[date.getMonth()])
        .replace(/MM/ig, _pad(date.getMonth() + 1))
        .replace(/M/ig, date.getMonth() + 1)
        .replace(/DDDD/ig, DATE_FULL_NAMES[date.getDay()])
        .replace(/DDD/ig, DATE_SHORT_NAMES[date.getDay()])
        .replace(/DD/ig, _pad(date.getDate()))
        .replace(/D/ig, date.getDate())
        .replace(/HH24/gi, date.getHours())
        .replace(/HH/gi, date.getHours() %  12)
        .replace(/H/gi, date.getHours() %  12)
        .replace(/SS/gi, _pad(date.getSeconds()))
        .replace(/PP/gi, date.getHours() <= 12 ? MERIDIEM.AM : MERIDIEM.PM)
        .replace(/P/gi, (date.getHours() <= 12 ? MERIDIEM.AM : MERIDIEM.PM).toLowerCase());
}

//{year, month, day, hour, minute, second, millisecond}
// YYYY - Four digit year
// YY   -
// MMMM - Full month name. ie January
// MMM  - Short month name. ie Jan
// MM   - Zero padded month ie 01
// M    - Month ie 1
// DDDD - Full day or week name ie Tuesday
// DDD  - Abbreviated day of the week ie Tue
// DD   - Zero padded day ie 08
// D    - Day ie 8
// HH24 - Hours in 24 notation ie 18
// HH   - Padded Hours ie 06
// H    - Hours ie 6
// MI   - Padded Minutes
// SS   - Padded Seconds
// PP   - AM or PM
// P    - am or pm
exports.toFormat = function(dateObject, format){
    let date = new Date();

    typeof dateObject === 'string' ? (format = dateObject) : (typeof format !== 'string' ? (format = 'YYYY-MM-DD HH24:MI:SS') : null);

    switch(true){
        case dateObject instanceof Date:
            date = dateObject;
            break;
        case dateObject && typeof dateObject === 'object':
            let year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate(),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds(),
                milliseconds = date.getMilliseconds();
            date = (
                Number.isInteger(dateObject.year) ? year = dateObject.year : null,
                Number.isInteger(dateObject.month) ? month = dateObject.month : null,
                Number.isInteger(dateObject.day) ? day = dateObject.day : null,
                Number.isInteger(dateObject.hours) ? hours = dateObject.hours : null,
                Number.isInteger(dateObject.minutes) ? minutes = dateObject.minutes : null,
                Number.isInteger(dateObject.seconds) ? seconds = dateObject.seconds : null,
                Number.isInteger(dateObject.milliseconds) ? milliseconds = dateObject.milliseconds : null,
                new Date(year, month, day, hours, minutes, seconds, milliseconds));
            break;
    }

    return _toFormat(date, format);
};

exports.parseUTC = function (date, isMilisecond){
    date = date instanceof Date ? date : new Date(date);

    return Object.assign({
		year: date.getUTCFullYear(),
		month: date.getUTCMonth(),
		day: date.getUTCDate(),
		hour: date.getUTCHours(),
		minute: date.getUTCMinutes(),
		seconds: date.getUTCSeconds()
    }, isMilisecond ? {milliseconds: date.getMilliseconds()} : {});
};

exports.dateCompareTo = function(date1, date2, isMillisecond){
    date1 = exports.parseUTC(date1, isMillisecond);
	date1 = isMillisecond ? Date.UTC(date1.year, date1.month, date1.day, date1.hour, date1.minute, date1.seconds, date1.milliseconds) : Date.UTC(date1.year, date1.month, date1.day, date1.hour, date1.minute, date1.seconds);
	date2 = exports.parseUTC(date2, isMillisecond);
	date2 = isMillisecond ? Date.UTC(date2.year, date2.month, date2.day, date2.hour, date2.minute, date2.seconds, date2.milliseconds) : Date.UTC(date2.year, date2.month, date2.day, date2.hour, date2.minute, date2.seconds);

    return isMillisecond ? date1 - date2 : (date1 - date2) / 1000;
};
