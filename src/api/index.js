const Router = require('express').Router;
const auth = require('./routes/auth.routes');

module.exports = () => {
  const app = Router();
  auth(app);

  return app;
}