/**
 * Utility functions for data validation
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate Mexican phone number (10 digits, cannot be 0000000000)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidMexicanPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 && digits !== '0000000000';
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with score and message
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  let message = '';

  if (password.length >= minLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChar) score++;

  if (score < 3) {
    message = 'Weak password';
  } else if (score < 4) {
    message = 'Medium password';
  } else {
    message = 'Strong password';
  }

  return { score, message, isValid: score >= 3 };
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate postal code (CP) - Mexican format (5 digits)
 * @param {string} cp - Postal code to validate
 * @returns {boolean} - True if valid postal code
 */
export const isValidPostalCode = (cp) => {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(cp);
};

/**
 * Validate Mexican postal code (5 digits, cannot be 00000)
 * @param {string} cp - Postal code to validate
 * @returns {boolean} - True if valid
 */
export const isValidMexicanPostalCode = (cp) => {
  const digits = (cp || '').replace(/\D/g, '');
  return digits.length === 5 && digits !== '00000';
};
