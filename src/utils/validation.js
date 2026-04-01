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
 * Validate Mexican phone number (10 digits, cannot be 0000000000)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidMexicanPhone = (phone) => {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 && digits !== '0000000000';
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

const CURP_REGEX = /^[A-Z]{4}\d{6}[HMX][A-Z]{2}[A-Z0-9]{5}$/;

/**
 * Validate Mexican CURP (Clave Única de Registro de Población)
 * @param {string} curp - CURP to validate
 * @returns {boolean} - True if valid format
 */
export const isValidCURP = (curp) => {
  const trimmed = (curp || '').trim().toUpperCase();
  return trimmed.length === 18 && CURP_REGEX.test(trimmed);
};
