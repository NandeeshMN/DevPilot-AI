/**
 * Validates whether an email format is correct.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates whether a password satisfies length constraints.
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates name length requirements.
 */
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};
