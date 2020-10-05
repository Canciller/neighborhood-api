const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const createError = require('http-errors');
const config = require('../config');
const routes = require('../api');

module.exports = ({ app }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');

  app.use(cors());

  app.use(methodOverride());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message,
      },
    });
  });
};