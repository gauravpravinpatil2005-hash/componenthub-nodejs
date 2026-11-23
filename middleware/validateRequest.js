const { validateRequest } = require('../utils/validators');

// Validation middleware: stops invalid requests before they reach the controller.
module.exports = function validate(req, res, next) {
  const result = validateRequest(req.body);
  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: result.errors
    });
  }
  req.validated = result.data; // sanitised data for the controller
  next();
};
