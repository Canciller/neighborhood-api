const { Router } = require('express');
const UserService = require('../../services/user.service');
const isAllow = require('../middlewares/isAllow');
const createError = require('http-errors');

const router = Router();

module.exports = (app) => {
  app.use('/users', isAllow('users'), router);

  router.route('/')
    .post(async (req, res, next) => {
      try {
        res.json(await UserService.create(req.body));
      } catch(err) {
        next(err);
      }
    })
    .get(async (req, res, next) => {
      try {
        res.json(await UserService.list(req.query));
      } catch(err) {
        next(err);
      }
    });

  router.route('/:username')
    .get(async (req, res, next) => {
      try {
        res.json(await UserService.get(req.params.username));
      } catch(err) {
        next(err);
      }
    })
    .put(async (req, res, next) => {
      try {
        const updated = await UserService.update(
          req.params.username, req.body);

        if(!updated)
          throw createError(404);
        else
          res.json(updated);
      } catch(err) {
        next(err);
      }
    })
    .delete(async (req, res, next) => {
      try {
        const deleted = await UserService.delete(req.params.username);

        if(!deleted)
          throw createError(404)
        else
          res.json(deleted);
      } catch(err) {
        next(err);
      }
    })
}