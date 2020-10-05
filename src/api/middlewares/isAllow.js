const isAuth = require('./isAuth');
const UserService = require('../../services/user');
const config = require('../../config');
const createError = require('http-errors');

module.exports = (resource) => {
  return ([
    isAuth,
    async (req, res, next) => {
      try {
        const permissions = await UserService.getPermissions(req.auth.username, resource);
        if(!permissions) throw createError(401);

        var allow = false;
        switch(req.method) {
          case 'POST':
            allow = permissions.create;
            break;
          case 'GET':
            allow = permissions.read;
            break;
          case 'PUT':
            allow = permissions.update;
            break;
          case 'DELETE':
            allow = permissions.delete;
            break;
          default:
            break;
        }

        if(!allow)
          throw createError(401);
        else
          next();
      } catch(err) {
        next(err);
      }
    }
  ]);
}