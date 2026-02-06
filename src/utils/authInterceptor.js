import { removeCookie } from './cookieUtils';
import useUserStore from '../stores/userStore';
import { useCreditFormStore } from '../stores/creditFormStore';
import { mutate } from 'swr';
import { ROUTES } from './routes';

/**
 * Checks if an error indicates an expired token
 * @param {Error|object} error - The error object or response
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (error) => {
  if (!error) return false;
  
  const status = error.status || error.statusCode;
  const message = (error.message || '').toLowerCase();
  const statusMessage = (error.statusMessage || '').toLowerCase();
  
  // Check for 401 status
  if (status === 401) {
    return true;
  }
  
  // Check for specific token expiration messages
  const expiredMessages = [
    'token expirado',
    'token expired',
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
  // Clear user store
  const { clearUser } = useUserStore.getState();
  clearUser();
  
  // Reset credit form store
  const { resetForm } = useCreditFormStore.getState();
  resetForm();
  
  // Remove auth token cookie
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
export const handleAuthError = (error, response = null) => {
  const status = error?.status || error?.statusCode || response?.status;
  const data = error?.details || error;
  
  const errorInfo = {
    status: status,
    statusCode: status,
    message: error?.message || data?.message || '',
    statusMessage: data?.statusMessage || error?.statusMessage || '',
  };
  
  if (isTokenExpired(errorInfo)) {
    performLogout();
    return true;
  }
  
  return false;
};
