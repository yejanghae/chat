'use strict'

const util = require('./util');

exports.filter = function (obj, filter, mapper, thisArg){
    arguments.length === 3 ? ((mapper && typeof mapper === 'object') ? (thisArg = mapper) : null) : null;
    const isMapperFn = typeof mapper === 'function';

    return typeof filter === 'function' ? util.reduce(
        obj,
        (_obj, v, k, obj) => (
            filter.call(thisArg, v, k, obj) ? (_obj[k] = isMapperFn ? mapper.call(thisArg, v, k, obj) : v) : null,
            _obj), {}) : {};
};

exports.isEmptyObject = function(obj){
    return (obj && typeof obj == 'object') ? Object.keys(obj).length === 0 : false;
}

exports.createDescriptor = function (value, descriptor){
    value && typeof value === 'object' && ((value.hasOwnProperty('get') && typeof value.get === 'function') || (value.hasOwnProperty('set') && typeof value.set === 'function')) ? (descriptor = value, value = null) : null;

    return Object.assign({}, descriptor, (value !== null && value !== undefined) ? {
        value: value
    } : {});
};

exports.curriedCreateDescriptor = function (descriptor){
    return util.curryR(exports.createDescriptor, descriptor);
};

exports.createDescriptors = function (values, descriptor){
    let _descriptors = {};
    let _curriedCreateDescriptor;

    return arguments.length >= 1 && (Array.isArray(values) || typeof values === 'object') ? (
        _curriedCreateDescriptor = exports.curriedCreateDescriptor(descriptor),
        util.forEach(
            values,
            (v, k) => (Array.isArray(values) ? (k = v[0], v = v[1]) : null, _descriptors[k] = _curriedCreateDescriptor(v))),
        _descriptors) : _descriptors;
}

exports.defineProperties = function (target, values, descriptor){
    return (arguments.length >= 2 && target && (typeof target === 'object' || typeof target === 'function')) ? (Object.defineProperties(target, exports.createDescriptors(values, descriptor)), target) : target;
};

exports.setValue = function (obj, key, value){
    switch(true){
        case obj && typeof obj === 'object' && /(string|number)/i.test(typeof key):
            _setValue(obj, key, value);
            break;
    }

    function _setValue (obj, key, value){
        return some(obj, (v, k) => k == key ? (obj[k] = value, true) : (v && typeof v === 'object' ? _setValue(v, key, value) : false));
    }

    return obj;
}
