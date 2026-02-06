import Cookies from 'js-cookie';

/**
 * Set a cookie with optional expiration
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options (expires, path, domain, secure, sameSite)
 * @param {number} options.expires - Expiration in days (default: 7)
 * @param {string} options.path - Cookie path (default: '/')
 * @param {string} options.domain - Cookie domain
 * @param {boolean} options.secure - Secure flag (default: false)
 * @param {string} options.sameSite - SameSite attribute ('strict', 'lax', 'none')
 * @returns {void}
 */
export const setCookie = (name, value, options = {}) => {
  const cookieOptions = {
    path: '/',
    secure: false,
    ...options,
  };

  if (options.hasOwnProperty('expires') && options.expires === undefined) {
    delete cookieOptions.expires;
  } else if (!options.hasOwnProperty('expires')) {
    cookieOptions.expires = 7;
  }

  Cookies.set(name, value, cookieOptions);
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|undefined} - Cookie value or undefined if not found
 */
export const getCookie = (name) => {
  return Cookies.get(name);
};

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 * @param {string} options.path - Cookie path (default: '/')
 * @param {string} options.domain - Cookie domain
 * @returns {void}
 */
export const removeCookie = (name, options = {}) => {
  const defaultOptions = {
    path: '/',
    ...options,
  };

  Cookies.remove(name, defaultOptions);
};

