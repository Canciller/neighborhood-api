const { Router } = require('express');
const router = Router();
const UserService = require('../../services/user.service');
const isAllow = require('../middlewares/isAllow');
const {
  createUserValidate,
  updateUserValidate,
} = require('../validators/user.validators');

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
        res.json(await UserService.list(query));
      } catch (err) {
        next(err);
      }
    })

    /**
     * Create user.
     */
    .post(createUserValidate, async (req, res, next) => {
      try {
        res.json(await UserService.create(req.body));
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
        res.json(await UserService.getById(req.params.id));
      } catch (err) {
        next(err);
      }
    })

    /**
     * Delete user by id.
     */
    .delete(async (req, res, next) => {
      try {
        res.json(await UserService.deleteById(req.params.id));
      } catch (err) {
        next(err);
      }
    })

    /**
     * Update user by id.
     */
    .put(updateUserValidate, async (req, res, next) => {
      try {
        res.json(await UserService.updateById(req.params.id, req.body));
      } catch (err) {
        next(err);
      }
    });
};
