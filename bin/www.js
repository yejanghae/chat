'use strict'

const path = require('path');
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');
const http = require('http');

const utils = require('../modules/utils');
const config = require('../config');
Object.assign(process.env, config.env);
config.log.path = utils.path.normalizePath(config.log.path, path.join(__dirname, '..'), path.join(__dirname, '..', 'log'));

const debug = require('debug')('HTTP');

let logConfigs = utils.map([
    {
        name: 'errorLog',
        level: 'error'
    },{
        name: 'infoLog',
        level: 'info'
    },{
        name: 'debugLog',
        level: 'debug'
    }
], logConfig => Object.assign(logConfig, {
    filename: path.join(config.log.path, logConfig.level, logConfig.level + '_'),
    datePattern: `${config.log.datePattern}.log`,
    timestamp: () => {
        return utils.date.toFormat();
    },
    maxsize: config.log.maxsize,
    maxFiles: config.log.maxFiles,
    json: false
}));

function mkdir (dirPath){
    return new Promise((resolve, reject) =>
        fs.stat(path.dirname(dirPath), err =>
            err ? mkdir(path.dirname(dirPath)) : fs.stat(dirPath, err =>
                err ? fs.mkdir(dirPath, err =>
                    !err ? resolve(dirPath) : reject(err)) : resolve(dirPath))));
}

mkdir(config.log.path)
    .then(() => Promise.all(utils.map(logConfigs, logConfig => mkdir(path.dirname(logConfig.filename)).then(dirPath => logConfig)))
        .then(logConfigs => {
            winston.configure({transports: utils.map(logConfigs, logConfig => new winston.transports.DailyRotateFile(logConfig))});
            const app = require('../app');
            /**
            * Get port from environment and store in Express.
                */
            config.port = normalizePort(config.port);
            app.set('port', config.port);

            /**
            * Create HTTP server.
                */

            const server = http.createServer(app);
            /**
            * Listen on provided port, on all network interfaces.
                */
            server.timeout = 0;
            server.listen(config.port);
            server
                .on('error', (err) => {
                    if (err.syscall !== 'listen') {
                        throw err;
                    }

                    let bind = typeof config.port === 'string' ? 'Pipe ' + config.port : 'Port ' + config.port;

                    // handle specific listen errors with friendly messages
                    switch (err.code) {
                        case 'EACCES':
                            process.exit(1);
                            break;
                        case 'EADDRINUSE':
                            process.exit(1);
                            break;
                        default:
                            throw err;
                    }
                })
                .on('listening', () => {
                    let addr = server.address();
                    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
                    winston.info('server start(port: %d)', addr.port);
                    debug('server start (port : %d)', addr.port);
                })
                .on('close', () => (
                    debug('server close ... (port : %d)', config.port),
                    winston.info('server close (port : %d)', config.port)))
                .on('clientError', (err, socket) => (
                    debug('client error HTTP 400 BAD Request (err : %j)', err),
                    winston.error('client error HTTP 400 BAD Request (err : %s)', err.message)));
        }))
    .catch(err => (debug('server start error : %s', err.message), winston.error('server start error : %s', err.message)));

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

process
    .on('unhandledRejection', function (err){
        console.error('unhandledRejection ', err)
        winston.error('unhandledRejection %s', err.message);
    })
    .on('uncaughtException', function (err){
        console.error('uncaughtException ', err)
        winston.error('uncaughtException %s', err.message);
    });
