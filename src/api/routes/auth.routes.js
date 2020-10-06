const { Router } = require('express');
const router = Router();
const AuthService = require('../../services/auth.service');
const createError = require('http-errors');
const isAuth = require('../middlewares/isAuth');

module.exports = (app) => {
  app.use('/auth', router);

  router.get(
    '/myself',
    isAuth,
    async(req, res, next) => {
      res.json(req.auth);
    }
  )

  router.post(
    '/signin',
    async (req, res, next) => {
      try {
        const data = await AuthService.signIn({
          username: req.body.username,
          password: req.body.password,
        });

        if(!data)
          throw createError(401);
        else
          res.json(data);
      } catch(err) {
        next(err);
      }
    }
  );

  router.post(
    '/signup',
    async (req, res, next) => {
      try {
        const data = await AuthService.signUp(req.body);

        if(!data)
          throw createError(401);
        else
          res.json(data);
      } catch(err) {
        next(err);
      }
    }
  );

  router.get(
    '/email/verify/:id',
    async (req, res, next) => {
      try {
        res.json({
          message: "verify email"
        });
      } catch(err) {
        next(err);
      }
    }
  );

  /*
  router.post(
    '/refreshtoken',
    async (req, res, next) => {
      try {
        const data = await AuthService.refreshToken({
          token: req.body.refreshToken,
          ipAddress: req.ip
        });

        if(!data)
          throw createError(401);
        else
          res.json(data);
      } catch(err) {
        next(err);
      }
    }
  )
  */
}