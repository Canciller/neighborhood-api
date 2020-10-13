const { validationResult } = require('express-validator');

class ValidationError extends Error {
  constructor(message = 'Error de validación.', details = []) {
    super(message);
    this.name = 'ValidationError';
    this.status = 403;
    this.details = details;
  }
}

module.exports = (message) => {
  return (req, res, next) => {
    const details = validationResult(req);
    if(details &&
      details.errors.length !== 0) next(new ValidationError(message, details.errors));
    else next();
  }
}