const Router = require('express').Router;
const auth = require('./routes/auth.routes');
const users = require('./routes/user.routes');
const visit = require('./routes/visit.routes');
const qr = require('./routes/qr.routes');

module.exports = () => {
  const app = Router();

  auth(app);
  users(app);
  visit(app);
  qr(app);

  return app;
};
