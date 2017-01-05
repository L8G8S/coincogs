'use strict';

/**
 * Generic class to format number and strings.
 */
class Format {
    static formatInteger(value, locale) {
        if(locale == undefined) return value;

        switch(locale) {
            case 'fr-FR':
                return value.toString().replace(/./g, function(c, i, a) { return i && c !== "," && ((a.length - i) % 3 === 0) ? ' ' + c : c; });
                break;

            case 'en-GB':
                return value.toString().replace(/./g, function(c, i, a) { return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c; });
                break;
            
            default:
                return value;
                break;
        }
    }
}