const Router = require('express').Router;
const auth = require('./routes/auth.routes');
const user = require('./routes/user.routes');

module.exports = () => {
  const app = Router();
  auth(app);
  user(app);

  return app;
}