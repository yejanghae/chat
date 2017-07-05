'use strict'

const INT = /^[-+]?[0-9]+$/;
const P_INT = /^[+]?[0-9]+$/;
const N_INT = /^[-]?[0-9]+$/;
const FLOAT = /^[-+]?[0-9]*.[0-9]+$/;
const P_FLOAT = /^[+]?[0-9]*.[0-9]+$/;
const N_FLOAT = /^[-]?[0-9]*.[0-9]+$/;

exports.isInt = function (target, isStrict){
    return isStrict ? typeof target === 'number' : INT.test(target);
}

exports.isPositiveInt = function (target, isStrict){
    let result = P_INT.test(target);
    return isStrict ? result = typeof target === 'number' : null, result;
}

exports.isNagativeInt = function (target, isStrict){
    let result = N_INT.test(target);
    return isStrict ? result = typeof target === 'number' : null, result;
}

exports.isFloat = function (target, isStrict){
    let result = FLOAT.test(target);
    return isStrict ? result = typeof target === 'function' : null, result;
}

exports.isPositiveFloat = function (target, isStrict){
    let result = P_FLOAT.test(target);
    return isStrict ? result = typeof target === 'function' : null, result;
}

exports.isNagativeFloat = function (target, isStrict){
    let result = N_FLOAT.test(target);
    return isStrict ? result = typeof target === 'function' : null, result;
}

exports.isString = function (target, isStrict){
    let result = typeof target === 'string';
    return isStrict ? result = target !== '' : null, result;
}

exports.isFunction = function (target){
    return typeof target === 'function';
}

exports.isObject = function (target, isStrict){
    let result = typeof target === 'object';
    return isStrict ? (result = target ? true : false) : null, result;
}

exports.isArray = function (target, isStrict){
    let result = exports.isObject(target, true) && target.hasOwnProperty('length');
    return isStrict ? (result = Array.isArray(target)) : null, result;
}
