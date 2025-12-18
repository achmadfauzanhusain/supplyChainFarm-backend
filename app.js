var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// konfigurasi API
const testRouter = require('./app/test/router');
const supplierRouter = require('./app/supplier/router');

const app = express()
const URI = "/api/v1"

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use(`${URI}/test`, testRouter);
app.use(`${URI}/supplier`, supplierRouter);

module.exports = app;
