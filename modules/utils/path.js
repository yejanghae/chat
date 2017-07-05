'use strict'

const path = require('path');

exports.normalizePath = function (filePath, basePath, defaultBasePath){
    arguments.length === 2 ? (defaultBasePath = basePath) : null;
    return (filePath && filePath !== '') ? (path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath)) : defaultBasePath;
};
