import { getCookie } from '../../utils/cookieUtils';

/**
 * Get headers for internal API endpoints that require authentication
 * @returns {object} - Headers with token from cookie
 */
export const getInternalApiHeaders = () => {
  const token = getCookie('authToken');
  
  return {
    'content-type': 'application/json',
    ...(token && { token }),
  };
};

