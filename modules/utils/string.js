'use strict'

exports.padStart = function (str, targetLength, padString){
    let result = str;
    result = typeof result === 'string' ? result : String(result);
    padString = typeof padString === 'string' ? padString : String(padString);
    targetLength = targetLength >> 0;
    padString = String(padString || ' ');

    return result.length > targetLength ? String(result) : (
        targetLength = targetLength - result.length,
        targetLength > padString.length ? (padString += padString.repeat(targetLength / padString.length)) : null,
        padString.slice(0,targetLength) + String(result));
}
