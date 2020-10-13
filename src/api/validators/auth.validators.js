const UserService = require('../../services/user.service');
const validate = require('../middlewares/validate');
const { body } = require('express-validator');
const createError = require('http-errors');

const msg = {
  username: {
    required: 'El nombre de usuario es requerido.',
    unique: (username) => `El nombre de usuario '${username}' ya fue tomado.`,
    invalid:
      'El nombre de usuario debe de ser una combinación de letras, numeros, y guiones.',
    length: 'El nombre de usuario no puede ser de más de 32 caracteres.',
  },
  name: {
    required: 'El nombre es requerido.',
  },
  email: {
    invalid: 'El email ingresado es invalido.',
    unique: (email) => `El email '${email}' ya esta relacionado con otra cuenta.`,
  },
  password: {
    required: 'La contraseña es requerida',
    length: 'La contraseña debe ser de mínimo 6 caracteres.'
  },
};

const matches = {
  username: /^[0-9a-zA-Z_-]+$/,
};

/**
 * Username validator
 */
const usernameValidator = body('username')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.username.required)
  .trim()
  // Matches
  .matches(matches.username)
  .withMessage(msg.username.invalid)
  // Length
  .isLength({
    max: 32
  })
  .withMessage(msg.username.length);

/**
 * Email validator
 */
const emailValidator = body('email')
  // Valid
  .isEmail()
  .withMessage(msg.email.invalid);

/**
 * Name validator
 */
const nameValidator = body('name')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.name.required)
  .trim();

/**
 * Password validator
 */
const passwordValidator = body('password')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.password.required)
  // Length
  .isLength({
    min: 6
  })
  .withMessage(msg.password.length);

module.exports = {
  usernameValidator: [
    usernameValidator,
    validate('Error en validación de nombre de usuario.')
  ],
  emailValidator: [
    emailValidator,
    validate('Error en validación de email.')
  ],
  nameValidator: [
    nameValidator,
    validate('Error en validación de nombre.')
  ],
  passwordValidator: [
    passwordValidator,
    validate('Error en validación de contraseña.')
  ],
  signInValidator: [
    usernameValidator,
    passwordValidator,
    validate('Error en validación de ingreso.')
  ],
  signUpValidator: [
    usernameValidator,
    body('username').custom(async username => {
        var exists = await UserService.exists(username);
        if(exists) throw createError(403, msg.username.unique(username));
      })
    ,
    emailValidator,
    body('email').custom(async email => {
        var exists = await UserService.emailExists(email);
        if(exists) throw createError(403, msg.email.unique(email));
      }),
    nameValidator,
    passwordValidator,
    validate('Error en validación de registro.')
  ],
}