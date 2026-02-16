import { removeCookie } from './cookieUtils';
import useUserStore from '../stores/userStore';
import { useCreditFormStore } from '../stores/creditFormStore';
import { mutate } from 'swr';
import { ROUTES } from './routes';

/**
 * Checks if an error indicates an expired token
 * Handles format: { statusCode: 401, success: false, statusMessage: "El token ha expiradó" }
 * @param {Error|object} error - The error object or response
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (error) => {
  if (!error) return false;

  const status = error.status || error.statusCode || error?.details?.statusCode;
  const message = (error.message || '').toLowerCase();
  const statusMessage = (error.statusMessage || error?.details?.statusMessage || '').toLowerCase();

  if (status === 401) {
    return true;
  }

  const expiredMessages = [
    'token expirado',
    'token expired',
    'expiradó',
    'el token ha expiradó',
    'token inválido',
    'token invalido',
    'invalid token',
    'no se encontró el token',
    'token not found',
    'sesión expirada',
    'session expired',
    'unauthorized',
  ];

  return expiredMessages.some(msg =>
    message.includes(msg) || statusMessage.includes(msg)
  );
};

/**
 * Performs logout: clears user data, token, and SWR cache
 * Then redirects to login page
 */
export const performLogout = () => {
  const { clearUser } = useUserStore.getState();
  clearUser();

  const creditStore = useCreditFormStore.getState();
  creditStore.resetForm();
  creditStore.clearCreditData?.();

  removeCookie('authToken');
  
  // Clear all SWR cache
  mutate(() => true, undefined, { revalidate: false });
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = ROUTES.LOGIN;
  }
};

/**
 * Handles API errors and performs logout if token is expired
 * @param {Error|object} error - The error object
 * @param {Response} response - The fetch response (optional)
 * @returns {boolean} - True if logout was performed
 */
export const handleAuthError = (error, response = null, responseBody = null) => {
  const data = responseBody || error?.details || error;
  const status = error?.status || error?.statusCode || data?.statusCode || response?.status;
  const errorInfo = {
    status,
    statusCode: status,
    message: (error?.message || data?.message || '').toLowerCase(),
    statusMessage: (data?.statusMessage || error?.statusMessage || '').toLowerCase(),
  };

  if (isTokenExpired(errorInfo)) {
    performLogout();
    return true;
  }

  return false;
};
