/**
 * Sends a standardized success REST API response payload.
 * @param {object} res Express response object
 * @param {string} message Description message
 * @param {object} data Payload fields
 * @param {number} statusCode HTTP Status Code
 */
const sendSuccess = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

/**
 * Sends a standardized error REST API response payload.
 * @param {object} res Express response object
 * @param {string} error Error description
 * @param {number} statusCode HTTP Status Code
 */
const sendError = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: error || "Internal Server Error"
  });
};

module.exports = { sendSuccess, sendError };
