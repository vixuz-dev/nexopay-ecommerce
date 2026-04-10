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

/**
 * Formatea entrada de vencimiento de tarjeta como MM/AA (solo dígitos, máx. 4).
 * @param {string} value
 * @returns {string}
 */
export const formatCardExpiryInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

/**
 * Interpreta MM/AA y valida mes, no vencida y año razonable (20YY).
 * @param {string} display
 * @returns {{ ok: true, expirationMonth: number, expirationYear: number } | { ok: false, message: string }}
 */
export const parseCardExpiry = (display) => {
  const trimmed = (display ?? '').trim();
  const match = /^(\d{2})\/(\d{2})$/.exec(trimmed);
  if (!match) {
    return { ok: false, message: 'Ingresa la fecha en formato MM/AA' };
  }
  const month = Number.parseInt(match[1], 10);
  const yy = Number.parseInt(match[2], 10);
  if (month < 1 || month > 12) {
    return { ok: false, message: 'El mes debe ser entre 01 y 12' };
  }
  const expirationYear = 2000 + yy;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (expirationYear < currentYear || (expirationYear === currentYear && month < currentMonth)) {
    return { ok: false, message: 'La tarjeta está vencida' };
  }
  if (expirationYear > currentYear + 20) {
    return { ok: false, message: 'Año de vencimiento no válido' };
  }
  return { ok: true, expirationMonth: month, expirationYear };
};
