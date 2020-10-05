const config = require('./config');
const express = require('express');
const loaders = require('./loaders');

async function start() {
  const app = express();

  await loaders({ expressApp: app });

  app.listen(config.port, (err) => {
    if(err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Listening at http://localhost:${config.port}`)
  });
}

start();