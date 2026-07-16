const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHandler');

/**
 * Access-control gatekeeper verifying Bearer JWT tokens in incoming request headers.
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, "Access Denied: No Token Provided", 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'devpilot-super-secret-key-12345';
    
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, "Invalid or Expired Security Token", 401);
  }
};

module.exports = authMiddleware;
