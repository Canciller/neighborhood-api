const { Router } = require('express');
const router = Router();
const Logger = require('../../loaders/logger');
const AuthService = require('../../services/auth.service');
const createError = require('http-errors');
const isAuth = require('../middlewares/isAuth');
const {
  signInValidate,
  signUpValidate,
} = require('../validators/auth.validators');

/**
 * Send email verification.
 * @param {string} userId
 */
async function sendEmailVerification(userId) {
  return await AuthService.sendEmailVerification(userId, '/auth/verify');
}

module.exports = (app) => {
  app.use('/auth', router);

  /**
   * Myself
   */
  router.get('/myself', isAuth, async (req, res, next) => {
    try {
      const myself = await AuthService.myself(req.auth.id);

      if (!myself) throw createError(404, 'Usuario no encontrado.');
      else res.json(myself);
    } catch (err) {
      next(err);
    }
  });

  /**
   * Sign in.
   */
  router.post('/signin', signInValidate, async (req, res, next) => {
    try {
      const data = await AuthService.signIn({
        username: req.body.username,
        password: req.body.password,
      });

      if (!data)
        throw createError(
          401,
          'El nombre de usuario o contraseña son incorrectos.'
        );
      else res.json(data);
    } catch (err) {
      next(err);
    }
  });

  /**
   * Sign up.
   */
  router.post('/signup', signUpValidate, async (req, res, next) => {
    try {
      const newUser = await AuthService.signUp(req.body);

      if (!newUser)
        throw createError(401, 'Ha ocurrido un problema al registrarse.');
      else res.json(newUser);

      try {
        await sendEmailVerification(newUser.id);
      } catch (err) {
        Logger.error(err);
      }
    } catch (err) {
      next(err);
    }
  });

  /**
   * Verify account.
   */
  router.get('/verify/:code', async (req, res, next) => {
    const template = `
        <html>
          <body>
            <p style="font-family: sans-serif;font-size: 2rem;padding: 1rem;margin: auto; text-align: center;">
              %message%
            </p>
          </body>
        </html>
      `;
    try {
      const verified = await AuthService.verify(req.params.code);
      if (!verified)
        return res
          .status(403)
          .send('Enlace de verificación de cuenta agotado.');

      res.send(template.replace('%message%', 'Tu cuenta ha sido verificada.'));
    } catch (err) {
      Logger.error(err);
      res
        .status(500)
        .send('Ha habido un problema intentalo de nuevo mas tarde.');
    }
  });

  /**
   * Send email verification.
   */
  router.get('/verification', isAuth, async (req, res, next) => {
    try {
      res.json(await sendEmailVerification(req.auth.id));
    } catch (err) {
      next(err);
    }
  });
};
