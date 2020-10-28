const isAuth = require('./isAuth');
const createError = require('http-errors');

module.exports = (resource) => {
  return [
    isAuth,
    async (req, res, next) => {
      // TODO: Create rules.
      let allowed = true;
      if (allowed) next();
      else next(createError(401, 'Sin autorización para acceder al recurso.'));
    },
  ];
};
