const isAuth = require('./isAuth');
const UserService = require('../../services/user.service');
const createError = require('http-errors');

module.exports = (resource) => {
  return ([
    isAuth,
    async (req, res, next) => {
      try {
        const permission = await UserService.getPermissionById(req.auth.id, resource);
        if(!permission) throw createError(401);

        var allow = false;
        switch(req.method) {
          case 'POST':
            allow = permission.write;
            break;
          case 'GET':
            allow = permission.read;
            break;
          case 'PUT':
            allow = permission.update;
            break;
          case 'DELETE':
            allow = permission.delete;
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