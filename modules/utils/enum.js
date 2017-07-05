'use strict'

const util = require('./util');
const objUtil = require('./object');

exports.isEnumFunc = function (key){
    const funcs = ['getKey', 'getValue'];
    return new RegExp(`(${funcs.join('|')})`).test(key);
};

exports.from = function (data){
    return data && typeof data === 'object' ? objUtil.defineProperties(
        objUtil.defineProperties({}, data, {enumerable: true}),
        {
            getKey: function (value){
                return exports.getKey(this, value);
            },
            getValue: function (key){
                return exports.getValue(this, key);
            }
        }) : data;
};

exports.getKey = function (_enum, value){
    const isValueFn = typeof value === 'function';
    let result;
    return result = util.find(
        _enum,
        (v, k, _enum) => !exports.isEnumFunc(k) && (isValueFn ? value(v, k, _enum) : v === value),
        (v, k) => k),
        result === null || result === undefined ? '' : result;
};

exports.getValue = function (_enum, key){
    const isKeyFn = typeof key === 'function';
    let result;
    return result = util.find(
        _enum,
        (v, k, _enum) => !exports.isEnumFunc(k) && (isKeyFn ? key(v, k, _enum) : k == key)),
        result === null || result === undefined ? '' : result;
};
