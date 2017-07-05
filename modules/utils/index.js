'use strict'

function getDescriptor (value){
    return {enumerable: true, value: value};
}

Object.assign(exports, require('./util'));
Object.defineProperties(exports, {
    object: getDescriptor(require('./object')),
    date: getDescriptor(require('./date')),
    string: getDescriptor(require('./string')),
    path: getDescriptor(require('./path')),
    enum: getDescriptor(require('./enum')),
});
