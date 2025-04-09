const { validationResult } = require('express-validator');
const { ErrorResponse } = require('../utils/errorResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return next(new ErrorResponse('Validation failed', 400, errorMessages));
  }
  next();
};

module.exports = validateRequest; 