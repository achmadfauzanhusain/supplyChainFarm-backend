const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors")
const methodOverride = require('method-override');

// konfigurasi API
const testRouter = require('./app/test/router');
const supplierRouter = require('./app/supplier/router');

const corsOptions = {
  origin: ['https://tblochain.com', 'https://tblo-frontend-admin.vercel.app/', 'http://localhost:3000']
};

const app = express()
app.use(cors(corsOptions))
const URI = "/api/v1"

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API
app.use(`${URI}/test`, testRouter);
app.use(`${URI}/supplier`, supplierRouter);

module.exports = app;
