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

/**
 * Número exterior (México): letras y números sin espacios ni símbolos, al menos un dígito, máx. 20.
 * Alineado con la solicitud de crédito (`personalAddressSchema`).
 * @param {string} v
 * @returns {boolean}
 */
export const isValidMexicanExternalNumber = (v) => {
  const s = String(v || '').trim();
  if (s.length < 1 || s.length > 20) return false;
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ]+$/.test(s)) return false;
  if (!/\d/.test(s)) return false;
  return true;
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

/** Longitud mínima de contraseña en registro (ecommerce). */
export const REGISTER_PASSWORD_MIN_LENGTH = 8;

/**
 * Evalúa la contraseña de registro frente a las reglas de la plataforma.
 * Se usa el valor recortado por espacios (mismo criterio que al enviar el registro).
 * @param {string} password
 * @returns {{ minLength: boolean, uppercase: boolean, lowercase: boolean, digit: boolean, special: boolean, allMet: boolean }}
 */
export const getRegisterPasswordRequirements = (password) => {
  const pwd = (password || '').trim();
  const minLength = pwd.length >= REGISTER_PASSWORD_MIN_LENGTH;
  const uppercase = /[A-Z]/.test(pwd);
  const lowercase = /[a-z]/.test(pwd);
  const digit = /\d/.test(pwd);
  const special = /[^A-Za-z0-9]/.test(pwd);
  const allMet = minLength && uppercase && lowercase && digit && special;
  return { minLength, uppercase, lowercase, digit, special, allMet };
};
