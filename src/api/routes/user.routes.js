const { Router } = require('express');
const createError = require('http-errors');
const router = Router();
const UserService = require('../../services/user.service');
const isAllow = require('../middlewares/isAllow');
const {
  createUserValidate,
  updateUserValidate,
} = require('../validators/user.validators');

const UserNotFoundError = createError(404, 'Usuario no encontrado.');

module.exports = (app) => {
  app.use('/users', isAllow('users'), router);

  router
    .route('/')
    /**
     * Get all users.
     */
    .get(async (req, res, next) => {
      const query = {
        skip: req.query.skip,
        limit: req.query.limit,
        role: req.query.role,
        isActive: req.query.active,
        isVerified: req.query.verified,
      };

      try {
        const user = await UserService.list(query);

        if(user) res.json(user);
        else throw UserNotFoundError;
      } catch (err) {
        next(err);
      }
    })

    /**
     * Create user.
     */
    .post(createUserValidate, async (req, res, next) => {
      try {
        const user = await UserService.create(req.body);

        if(user) res.json(user);
        else throw UserNotFoundError;
      } catch (err) {
        next(err);
      }
    });

  /**
   * Delete many users by id.
   */
  // TODO: Implement this.
  //.delete();

  router
    .route('/:id')

    /**
     * Get user by id.
     */
    .get(async (req, res, next) => {
      try {
        const user = await UserService.getById(req.params.id);

        if(user) res.json(user);
        else throw UserNotFoundError;
      } catch (err) {
        next(err);
      }
    })

    /**
     * Delete user by id.
     */
    .delete(async (req, res, next) => {
      try {
        const user = await UserService.deleteById(req.params.id);

        if(user) res.json(user);
        else throw UserNotFoundError;
      } catch (err) {
        next(err);
      }
    })

    /**
     * Update user by id.
     */
    .put(updateUserValidate, async (req, res, next) => {
      try {
        const user = await UserService.updateById(req.params.id, req.body);

        if(user) res.json(user);
        else throw UserNotFoundError;
      } catch (err) {
        next(err);
      }
    });
};