const bcrypt = require('bcryptjs');

/**
 * Hashes a plaintext password.
 * @param {string} password 
 * @returns {string} Hashed password
 */
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Compares plaintext password with hashed password.
 * @param {string} password 
 * @param {string} hashed 
 * @returns {boolean} True if match, false otherwise
 */
const comparePassword = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};

module.exports = { hashPassword, comparePassword };
