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
 * Precio mostrado en cards de producto: redondeo hacia arriba a pesos enteros, sin decimales.
 * @param {number} amount
 * @returns {string}
 */
export const formatProductCardPrice = (amount) => {
  const n = Number(amount);
  const rounded = Number.isNaN(n) ? 0 : Math.ceil(n);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rounded);
};

/**
 * Sustituye montos en formato $X,XXX.XX dentro de textos del API (p. ej. mensualidad) por el mismo criterio que las cards.
 * @param {string} text
 * @returns {string}
 */
export const formatProductCardMonthlyPaymentText = (text) => {
  if (text == null || typeof text !== 'string') return text;
  return text.replace(/\$[\d,.]+/g, (match) => {
    const numeric = parseFloat(match.slice(1).replace(/,/g, ''));
    if (Number.isNaN(numeric)) return match;
    return formatProductCardPrice(numeric);
  });
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
