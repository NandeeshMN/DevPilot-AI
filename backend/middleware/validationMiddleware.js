const { sendError } = require('../utils/responseHandler');

/**
 * Validates the presence of required fields in the request body.
 * @param {string[]} requiredFields Array of field names
 */
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];
    requiredFields.forEach(field => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
    }
    next();
  };
};

module.exports = { validateBody };
