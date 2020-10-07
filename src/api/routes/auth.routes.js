const { Router } = require('express');
const router = Router();
const Logger = require('../../loaders/logger');
const AuthService = require('../../services/auth.service');
const createError = require('http-errors');
const isAuth = require('../middlewares/isAuth');
const config = require('../../config');

async function sendEmailVerification(baseUrl, userId)
{
  return await AuthService.sendEmailVerification({
    baseUrl: `${baseUrl}/verify`,
    userId
  });
}

function getBaseUrl(req)
{
  const origin = req.get('origin') || req.get('host');
  return `${req.protocol}://${origin}${config.api.prefix}/auth`;
}

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
        const newUser = await AuthService.signUp(req.body);

        if(!newUser)
          throw createError(401);
        else
          res.json(newUser);

        try {
          await sendEmailVerification(getBaseUrl(req), newUser.id);
        } catch(err) {
          Logger.error(err);
        }
      } catch(err) {
        next(err);
      }
    }
  );

  /**
   * Verify account
   */
  router.get(
    '/verify/:code',
    async (req, res, next) => {
      const template = `
        <html>
          <body>
            <p style="font-family: sans-serif;font-size: 2rem;padding: 1rem;margin: auto; text-align: center;">
              %message%
            </p>
          </body>
        </html>
      `
      try {
        const verified = await AuthService.verify(req.params.code);
        if(!verified) throw createError(403, 'Enlace de verificación de cuenta agotado');

        res.send(template.replace('%message%', 'Tu cuenta ha sido verificada'));
      } catch(err) {
        res.send(template.replace('%message%', err.message));
      }
    }
  );

  /**
   * Send email verification
   */
  router.get(
    '/verify',
    isAuth,
    async (req, res, next) => {
      try {
        res.json(await sendEmailVerification(getBaseUrl(req), req.auth.id));
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