const { sendError } = require('../utils/responseHandler');

/**
 * Standardized global Express error handler to capture unhandled exceptions.
 */
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled System Error:", err.stack || err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected system error occurred.";
  
  return sendError(res, message, statusCode);
};

module.exports = errorHandler;
