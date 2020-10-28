const UserService = require('../../services/user.service');
const validate = require('../middlewares/validate');
const { body } = require('express-validator');
const createError = require('http-errors');

const msg = {
  usernameOrEmail: {
    required: 'El nombre de usuario o email es requerido.',
  },
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
    unique: (email) =>
      `El email '${email}' ya esta relacionado con otra cuenta.`,
  },
  password: {
    required: 'La contraseña es requerida',
    length: 'La contraseña debe ser de mínimo 6 caracteres.',
  },
};

const matches = {
  username: /^[0-9a-zA-Z_-]+$/,
};

/**
 * Username or Email validator.
 */
const usernameOrEmailValidator = body('username')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.usernameOrEmail.required)
  .trim();

/**
 * Username validator.
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
    max: 32,
  })
  .withMessage(msg.username.length);

/**
 * Username unique validator.
 */
const usernameUniqueValidator = body('username').custom(async (username) => {
  var exists = await UserService.exists(username);
  if (exists) throw createError(403, msg.username.unique(username));
});

/**
 * Email validator.
 */
const emailValidator = body('email')
  // Valid
  .isEmail()
  .withMessage(msg.email.invalid);

/**
 * Email unique validator.
 */
const emailUniqueValidator = body('email').custom(async (email) => {
  var exists = await UserService.emailExists(email);
  if (exists) throw createError(403, msg.email.unique(email));
});

/**
 * Name validator.
 */
const nameValidator = body('name')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.name.required)
  .trim();

/**
 * Password validator.
 */
const passwordValidator = body('password')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.password.required)
  // Length
  .isLength({
    min: 6,
  })
  .withMessage(msg.password.length);

module.exports = {
  authMessages: msg,
  authMatches: matches,
  usernameValidator,
  usernameUniqueValidator,
  emailValidator,
  emailUniqueValidator,
  nameValidator,
  passwordValidator,
  signInValidate: [
    usernameOrEmailValidator,
    passwordValidator,
    validate('Error en validación de ingreso.'),
  ],
  signUpValidate: [
    usernameValidator,
    usernameUniqueValidator,
    emailValidator,
    emailUniqueValidator,
    nameValidator,
    passwordValidator,
    validate('Error en validación de registro.'),
  ],
};
