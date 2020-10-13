const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const createError = require('http-errors');
const expressWinston = require('express-winston')
const config = require('../config');
const routes = require('../api');
const Logger = require('./logger');

const { UnauthorizedError } = require('express-jwt');

module.exports = ({ app }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(expressWinston.logger({
    meta: false,
    expressFormat: true,
    winstonInstance: Logger
  }));

  app.use(cors());

  app.use(methodOverride());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    next(createError(404, 'Recurso no encontrado.'));
  });

  app.use((err, req, res, next) => {
    err.status = err.status || 500;

    // express-jwt UnauthorizedError
    if(err instanceof UnauthorizedError)
      err.message = 'Token invalido.'

    Logger.error(err);

    res.status(err.status);
    res.json({
      error: {
        name: err.name,
        message: err.message,
        status: err.status,
      },
    });
  });
};