const Router = require('express').Router;
const auth = require('./routes/auth');
const user = require('./routes/user');

module.exports = () => {
  const app = Router();
  auth(app);
  user(app);

  return app;
}