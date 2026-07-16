const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT token for the authenticated user.
 * @param {string} userId 
 * @returns {string} JWT Token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'devpilot-super-secret-key-12345';
  return jwt.sign({ id: userId }, secret, { expiresIn: '30d' });
};

module.exports = generateToken;
