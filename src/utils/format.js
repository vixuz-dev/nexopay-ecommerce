/**
 * Utility functions for formatting data
 */

export const formatPriceMXN = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format phone number input - removes non-numeric characters and limits to 10 digits
 * @param {string} value - Phone number input value
 * @returns {string} - Cleaned phone number (max 10 digits)
 */
export const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  const limitedNumbers = numbers.slice(0, 10);
  return limitedNumbers;
};
