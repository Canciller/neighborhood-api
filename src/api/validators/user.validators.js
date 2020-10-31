const UserService = require('../../services/user.service');
const validate = require('../middlewares/validate');
const { body } = require('express-validator');
const createError = require('http-errors');
const {
  authMatches,
  authMessages,
  usernameValidator,
  usernameUniqueValidator,
  emailValidator,
  emailUniqueValidator,
  nameValidator,
  passwordValidator,
} = require('./auth.validators');

const roles = "'administrador', 'guardia', o 'residente'";

const msg = {
  role: {
    required: `El rol del usuario es requerido y tiene que ser uno de los siguientes: ${roles}.`,
    matches: `El rol es invalido, tiene que ser uno de los siguientes: ${roles}.`,
  },
  isActive: {
    matches: 'Al estatus de activo solo se le pueden pasar valores booleanos.',
  },
};

const matches = {
  role: /\b(?:administrador|guardia|residente)\b/,
};

/**
 * Optional username validator.
 */
const optionalUsernameValidator = body('username')
  // Optional
  .optional()
  .trim()
  // Matches
  .matches(authMatches.username)
  .withMessage(authMessages.username.invalid)
  // Length
  .isLength({
    max: 32,
  })
  .withMessage(authMessages.username.length);

/**
 * Username unique except self validator.
 */
const usernameUniqueExceptSelfValidator = body('username').custom(
  async (username, { req }) => {
    let id = null;
    if (req.auth instanceof Object) id = req.auth.id ? req.auth.id : null;

    var user = await UserService.get(username);
    if (user !== null && user.id !== id)
      throw createError(403, authMessages.username.unique(username));
  }
);

/**
 * Optional email validator.
 */
const optionalEmailValidator = body('email')
  // Optional
  .optional()
  // Valid
  .isEmail()
  .withMessage(authMessages.email.invalid);

/**
 * Email unique except self validator.
 */
const emailUniqueExceptSelfValidator = body('email').custom(
  async (email, { req }) => {
    let id = null;
    if (req.auth instanceof Object) id = req.auth.id ? req.auth.id : null;

    var user = await UserService.get(email);
    if (user !== null && user.id !== id)
      throw createError(403, authMessages.email.unique(email));
  }
);

/**
 * Optional name validator.
 */
const optionalNameValidator = body('name')
  // Optional
  .optional()
  .trim();

/**
 * Optional password validator.
 */
const optionalPasswordValidator = body('password')
  // Optional
  .optional()
  // Length
  .isLength({
    min: 6,
  })
  .withMessage(authMessages.password.length);

/**
 * Role validator.
 */
const roleValidator = body('role')
  // Required
  .not()
  .isEmpty()
  .withMessage(msg.role.required)
  .trim()
  // Matches
  .matches(matches.role)
  .withMessage(msg.role.matches);

/**
 * Default role validator.
 */
const defaultRoleValidator = body('role')
  // Optional
  .optional()
  .trim()
  // Matches
  .matches(matches.role)
  .withMessage(msg.role.matches);

/**
 * IsActive validator.
 */
const isActiveValidator = body('isActive')
  // Optional
  .optional()
  // Matches
  .isBoolean()
  .withMessage(msg.isActive.matches);

module.exports = {
  userMessages: msg,
  userMatches: matches,
  optionalUsernameValidator,
  usernameUniqueExceptSelfValidator,
  optionalEmailValidator,
  emailUniqueExceptSelfValidator,
  optionalNameValidator,
  optionalPasswordValidator,
  roleValidator,
  defaultRoleValidator,
  isActiveValidator,
  updateUserValidate: [
    optionalUsernameValidator,
    usernameUniqueExceptSelfValidator,
    optionalEmailValidator,
    emailUniqueExceptSelfValidator,
    optionalNameValidator,
    optionalPasswordValidator,
    defaultRoleValidator,
    isActiveValidator,
    validate('Error en validación de actualización de usuario.'),
  ],
  createUserValidate: [
    usernameValidator,
    usernameUniqueValidator,
    emailValidator,
    emailUniqueValidator,
    nameValidator,
    passwordValidator,
    defaultRoleValidator,
    isActiveValidator,
    validate('Error en validación de creación de usuario.'),
  ],
};
