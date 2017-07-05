'use strict'

exports.$_MARKER = {};

exports.each = function (obj, callback, thisArg){
    switch(true){
        case !obj || (typeof obj !== 'function' && typeof callback !== 'function'):
            break;
        case obj.length >= 0 && typeof obj !== 'function':
            for(let i = 0; i < obj.length; i++){
                if(callback.call(thisArg, obj[i], i, obj))
                    break;
            }
            break;
        case obj instanceof Map:
            let entries = obj.entries();
            let entry;
            while(entry = entries.next(), !entry.done){
                if(callback.call(thisArg, entry.value[1], entry.value[0], obj))
                    break;
            }
            break;
        case obj && typeof obj === 'object':
            for(let attrName in obj){
                if(callback.call(thisArg, obj[attrName], attrName, obj))
                    break;
            }
            break;
        case typeof obj === 'function':
            obj = exports.curryR(exports.each, obj, callback);
            break;
    }

    return obj;
};

exports.forEach = function (obj, callback, thisArg){
    switch(true){
        case !obj || (typeof obj !== 'function' && typeof callback !== 'function'):
            break;
        case obj.length >= 0 && typeof obj !== 'function':
            for(let i = 0; i < obj.length; i++)
                callback.call(thisArg, obj[i], i, obj);
            break;
        case obj instanceof Map:
            let entries = obj.entries();
            let entry;
            while(entry = entries.next(), !entry.done)
                callback.call(thisArg, entry.value[1], entry.value[0], obj);
            break;
        case obj && typeof obj === 'object':
            for(let attrName in obj)
                callback.call(thisArg, obj[attrName], attrName, obj);
            break;
        case typeof obj === 'function':
            obj = exports.curryR(exports.forEach, obj, callback);
            break;
    }

    return obj;
};

exports.some = function (obj, callback, thisArg){
    let result;
    return typeof obj === 'function' ? (result = exports.curryR(exports.some, obj, callback)) : (typeof callback === 'function' ? exports.each(
        obj,
        (v, k, obj) =>
            (result = (callback.call(thisArg, v, k, obj) ? true : false))) : null), result;
};

exports.toArray = function (obj, mapper, thisArg){
    let arr = [];
    const isMapperFn = typeof mapper === 'function';
    let hasLength;

    return obj !== undefined && typeof obj !== 'object' ? arr.push(obj) : exports.forEach(
        obj,
        (v, k, obj) =>
            arr.push(isMapperFn ? mapper.call(thisArg, v, k, obj) : (hasLength || (hasLength = obj.hasOwnProperty('length'), hasLength) ? v : {
                key: k,
                value: v
            }))), arr;
};

exports.reduce = function (obj, callback, initData, thisArg){
    let isFirst = true;
    let isInitData = arguments.length >= 3;

    return typeof obj === 'function' ? (initData = exports.curryR(exports.reduce, obj, callback, initData)) : (typeof callback === 'function' ? exports.forEach(obj, (v, k, obj) => (
        initData = callback.call(thisArg, !isInitData && isFirst ? (isFirst = false, v) : initData, v, k ,obj))) : null), initData;
}

exports.filter = function (obj, callback, mapper, thisArg){
    let isMapperFn;

    return typeof obj === 'function' ? exports.curryR(exports.filter, obj, callback, mapper) : (typeof callback === 'function' ? (
        isMapperFn = typeof mapper === 'function',
        arguments.length === 3 ? (!isMapperFn && typeof mapper === 'object' ? (thisArg = mapper) : null) : null,
        exports.reduce(
            obj,
            (arr, v, k, obj) => (callback.call(thisArg, v, k, obj) ? arr.push(isMapperFn ? mapper.call(thisArg, v, k, obj) : v) : null, arr),
            [])) : []);
};

exports.find = function (obj, callback, mapper, thisArg){
    let result;
    let isMapperFn;

    return typeof obj === 'function' ? exports.curryR(exports.find, obj, callback, mapper) : (typeof callback === 'function' ? (
        isMapperFn = typeof mapper === 'function',
        arguments.length === 3 ? (!isMapperFn && typeof mapper === 'object' ? (thisArg = mapper) : null) : null,
        exports.each(
            obj,
            (v, k, obj) =>
                callback.call(thisArg, v, k, obj) ? (result = isMapperFn ? mapper.call(thisArg, v, k, obj) : v, true) : false)) : null, result);
};

exports.findIndex = function (obj, callback, thisArg){
    let index;

    switch(true){
        case obj && typeof obj === 'object' && obj.length >= 0 && typeof callback === 'function':
            for(let i = 0; i < obj.length; i++){
                if(callback.call(thisArg, obj[i], i, obj)){
                    index = i;
                    break;
                }
            }
            break;
        case typeof obj === 'function':
            index = exports.curryR(exports.findIndex, obj, callback);
            break;
    }

    return index;
};

exports.findKey = function (obj, callback, thisArg){
    let index;

    switch(true){
        case typeof obj === 'function':
            index = exports.curryR(exports.findKey, obj, callback);
            break;
        case obj && typeof obj === 'object' && typeof callback === 'function':
            exports.some(obj, (v, k, obj) => callback.call(thisArg, v, k, obj) ? (index = k, true) : false);
            break;
    }

    return index;
};

exports.map = function (obj, callback, thisArg){
    let isCallbackFn;
    let arr;

    return typeof obj === 'function' ? exports.curryR(exports.map, obj, callback) : (
        arr = [],
        isCallbackFn = typeof callback === 'function',
        exports.forEach(obj, (v, k, obj) => arr.push(isCallbackFn ? callback.call(thisArg, v, k, obj) : v)),
        arr);
};

exports.keys = function (obj){
    return exports.map(obj, (v, k) => k);
};

exports.slice = function (obj, start, end, mapper, thisArg){
    if(typeof obj === 'function'){
        return exports.curryR(exports.slice, start, end, mapper);
    }

    let objIsLikeArr;
    let isMapperFn = typeof mapper === 'function';
    const startIsArr = Array.isArray(start);
    let result = [];

    if(arguments.length < 2 || (!startIsArr && !/^[+]?[0-9]+$/.test(start)) || !obj){
        return result;
    }

    objIsLikeArr = obj &&  obj.length >= 0;
    typeof end === 'function' ? (
        mapper && typeof mapper === 'object' ? (thisArg = mapper) : null,
        mapper = end,
        isMapperFn = true) : null;

    objIsLikeArr && !startIsArr  ? (/^[+]?[0-9]+$/.test(end) ? (obj.length > end ? null : (end = obj.length - 1)) : (end = obj.length - 1)) : null;
    typeof start === 'string' ? (start = parseInt(start)) : null;
    typeof end === 'string' ? (end = parseInt(end)) : null;

    switch(true){
        case objIsLikeArr === true && !startIsArr:
            for(let i = start; i <= end; i++)
                result.push(isMapperFn ? mapper.call(thisArg, obj[i], i, obj) : obj[i]);
            break;
        default:
            result = exports.filter(
                obj,
                (v, k) => startIsArr ? exports.some(start, v => v === k) : start <= k && k <= end,
                isMapperFn ? mapper : (v, k) => objIsLikeArr ? v : {
                    key: k,
                    value: v
                },
                thisArg);
    }

    return result;
};

exports.splice = function (obj, start, deleteCount){
    if(typeof obj === 'number'){
        let _args = exports.toArray(arguments);
        return exports.curryR.apply(null, (_args.unshift(exports.splice), _args));
    }

    let result = [];
    let end;
    let args;

    switch(true){
        case !obj || !/^[-+]?[0-9]+$/.test(start) || !/^[-+]?[0-9]+$/.test(deleteCount):
            break;
        case obj.length >= 0:
            end = obj.length === 0 ? 0 : obj.length - 1;
            start = obj.length <= Math.abs(start) ? (deleteCount === 0 ? obj.length : end) : (start < 0 ? end + start : start);
            deleteCount = deleteCount === 0 ? (
                args = exports.slice(arguments, 3),
                deleteCount) : (obj.length - start < deleteCount ? obj.length - start : deleteCount);
            switch(true){
                case Array.isArray(obj):
                    result = Array.prototype.splice.apply(obj, args ? [start, deleteCount].concat(args) : [start, deleteCount]);
                    break;
                default:
                    if(!args){
                        for(let i = start; i < start + deleteCount; i++)
                            (result.push(obj[i]), delete obj[i], obj.length--);
                    }else{
                        deleteCount = args.length;
                        for(let i = start, j = 0; i < start + deleteCount; i++, j++)
                            (obj.hasOwnProperty(i) ? obj[i + deleteCount - start] = obj[i] : null, obj[i] = args[j], obj.length++);
                    }
            }
            break;
    }

    return result;
};

exports.split = function (obj, separator, limit){
    return obj instanceof RegExp ? exports.curryR(exports.split, separator, limit) : ((arguments.length >= 2 && typeof obj === 'string') ? obj.split(separator, limit) : []);
};

exports.getValue = function(obj, target){
    let result;
    return arguments.length >= 2 ? (exports.each(
        obj,
        (v, k) => k == target ? (result = v, true) : (v && typeof v === 'object' && !Array.isArray(v) ? exports.getValue(v, target) : false)), result) : result;
};

exports.observe = function (obj, listeners, thisArg){
    obj && typeof obj === 'object' && listeners && typeof listeners === 'object' ? (exports.forEach(listeners, function (v){
        typeof v === 'function' ? v.bind(thisArg) : null;
    }), _observe(obj)) : null;
    return obj;

    function _observe (target){
        switch(true){
            case !target || typeof target !== 'object':
                break;
            case Array.isArray(target):
                _arrayOb(target);
                break;
            case target instanceof Map:
                _objectOb(target);
                break;
            case typeof target === 'object':
                exports.forEach(target, function (v, k, target){
                    switch(true){
                        case Array.isArray(v):
                            _arrayOb(v, k);
                            _objectOb(target, k)
                            break;
                        case v instanceof Map:
                            _mapOb(v, k);
                            _objectOb(target, k);
                            break;
                        case typeof v === 'object':
                            _objectOb(target, k);
                            _observe(v);
                            break;
                        default:
                            _objectOb(target, k);
                    }
                });
                break;
        }
    }

    function _objectOb (target, attrName){
        target['_' + attrName] = target[attrName];
        Object.defineProperty(target, attrName, {
            get: function (){
                typeof listeners.get === 'function' ? listeners.get({
                    data: target['_' + attrName],
                    attrName: attrName,
                    target: target,
                    obj: obj
                }) : null;
                return target['_' + attrName];
            },
            set: function (data){
                this['_' + attrName] = data;
                typeof listeners.set === 'function' ? listeners.set({
                    data: target['_' + attrName],
                    attrName: attrName,
                    target: target,
                    obj: obj
                }) : null;
                Array.isArray(data) ? _arrayOb(data, attrName) : null;
            }
        })
    }

    function _callEmpty(){
        typeof listeners.empty === 'function' ? listeners.empty({
            attrName: attrName,
            target: target,
            obj: obj
        }) : null;
    }

    function _arrayOb (target, attrName){
        target._push = target.push;
        target._pop = target.pop;
        target._shift = target.shift;
        target._unshift = target.unshift;
        target._splice = target.splice;

        Object.defineProperties(target, {
            push: {
                value: function (data){
                    let result = this._push(data);
                    typeof listeners.push === 'function' ? listeners.push({
                        data: data,
                        attrName: attrName,
                        inidex: this.length - 1,
                        target: target,
                        obj: obj
                    }) : null;
                    return result;
                }
            },
            pop: {
                value: function (){
                    let _data = this._pop();
                    _data !== undefined && typeof listeners.pop === 'function' ? listeners.pop({
                        data: _data,
                        attrName: attrName,
                        index: this.length,
                        target: target,
                        obj: obj
                    }) : null;
                    this.length === 0 ? _callEmpty() : null;
                    return _data;
                }
            },
            shift: {
                value: function (){
                    let _data = this._shift();
                    _data !== undefined && typeof listeners.shift === 'function' ? listeners.shift({
                        data: _data,
                        attrName: attrName,
                        index: 0,
                        target: target,
                        obj: obj
                    }) : null;
                    this.length === 0 ? _callEmpty() : null;
                    return _data;
                }
            },
            unshift: {
                value: function (data){
                    let result = this._unshift(data);
                    typeof listeners.unshift === 'function' ? listeners.unshift({
                        data: data,
                        attrName: attrName,
                        index: 0,
                        target: target,
                        obj: obj
                    }) : null;
                    return result;
                }
            },
            splice: {
                value: function (start, deleteCount){
                    let result = Array.prototype.splice.apply(target, arguments);
                    typeof listeners.splice === 'function' ? listeners.splice({
                        data: deleteCount === 0 ? {
                            type: 'add',
                            start: start,
                            datas: slice(arguments, 2)
                        } : {
                            type: 'del',
                            start: start,
                            datas: result
                        },
                        attrName: attrName,
                        target: target,
                        obj: obj
                    }) : null;
                    this.length === 0 ? _callEmpty() : null;
                    return result;
                }
            }
        })
    }

    function _mapOb (target, attrName){
        target._get = target.get;
        target._set = target.set;
        target._clear = target.clear;
        target._delete = target.delete;

        Object.defineProperties(target, {
            get: {
                value: function (key){
                    let value = this._get(key);
                    value !== undefined && typeof listeners.mapGet === 'function' ? listeners.mapGet({
                        data: {
                            key: key,
                            value: value
                        },
                        attrName: attrName,
                        target: target,
                        obj: obj
                    }) : null;
                    return value;
                }
            },
            set: {
                value: function (key, value){
                    this._set(key, value);
                    typeof listeners.mapSet === 'function' ? listeners.mapSet({
                        data: {
                            key: key,
                            value: value
                        },
                        attrName: attrName,
                        target: target,
                        obj: obj
                    }) : null;
                    return value;
                }
            },
            clear: {
                value: function (){
                    let result;
                    let datas = toArray(target);
                    (result = this._clear(), result) && typeof listeners.mapClear === 'function' ? listeners.mapClear({
                        data: datas,
                        attrName: attrName,
                        target: target,
                        obj: obj
                    }) : null;
                    return result;
                }
            },
            delete: {
                value: function (key){
                    let result;
                    let value = this._get(key);
                    (result = this._delete(key), result) && typeof listeners.mapDelete === 'function' ? listeners.mapDelete({
                        data: {
                            key: key,
                            value: value
                        },
                        attrName: attrName,
                        target: target,
                        obj: obj
                    }) : null;
                    this.size === 0 ? _callEmpty() : null;
                    return result;
                }
            }
        })
    }
};

exports.curry = function (){
    let _curryArgs = exports.toArray(arguments);
    let _isExistMarker = exports.some(_curryArgs, v => v === exports.$_MARKER);
    let _fn = _curryArgs.shift();

    return function (){
        let _cArgs = exports.toArray(arguments);
        return typeof _fn === 'function' ? _fn.apply(null, (_isExistMarker ? exports.map(
            _curryArgs,
            (v, k, _curryArgs) => v === exports.$_MARKER ? _cArgs.shift() : v) : _curryArgs).concat(_cArgs)) : _fn;
    };
};

exports.curryR = function (){
    let _curryArgs = exports.toArray(arguments);
    let _markerIndexes = exports.filter(_curryArgs, v => v === exports.$_MARKER, (v, k) => k - 1).reverse();
    let _isExistMarker = _markerIndexes.length > 0;
    let _fn = _curryArgs.shift();

    return function (){
        let _cArgs = exports.toArray(arguments);
        return typeof _fn === 'function' ? _fn.apply(null, _cArgs.concat(_isExistMarker ? (exports.map(
            _markerIndexes,
            v => _curryArgs[v] === exports.$_MARKER ? _cArgs.pop() : v), _curryArgs) : _curryArgs)) : _fn;
    };
};

exports.pipe = function (){
    let fns = exports.filter(Array.isArray(arguments[0]) ? arguments[0] : arguments, fn => typeof fn === 'function');
    return function (arg){
        return exports.reduce(fns, (arg, fn) => arg instanceof Promise ? arg.then(fn) : fn(arg), arg);
    };
};

exports.go = function (arg){
    return exports.pipe.apply(null, exports.slice(arguments, 1))(arg);
};

exports.clone = function (obj){
    return obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : obj;
};
