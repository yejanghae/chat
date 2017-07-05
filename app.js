'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const debug = require('debug')('app');
const path = require('path');

module.exports = exports = express();

exports.use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(require('cookie-parser')())
    .use(require('cors')())
    .use(require('express-session')({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: null, httpOnly: true}
    }))
    .use('/', routes)
    .use((err, req, res) => (
        res.statusCode !== 404 ? (
            debug('server error (err : %j)', err),
            res.status(500).send(err.message)) : null,
        debug('404 error (err : %j)', err)));
