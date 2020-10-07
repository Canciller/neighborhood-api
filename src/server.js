const config = require('./config');
const express = require('express');
const Logger = require('./loaders/logger');
const loaders = require('./loaders');

async function start() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, (err) => {
    if(err) {
      Logger.error(err);
      process.exit(1);
    }

    Logger.info(`Listening at http://localhost:${config.port}`);
  });
}

start();