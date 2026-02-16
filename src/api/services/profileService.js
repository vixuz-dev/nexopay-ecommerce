import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for ecommerce profile API calls
 * Services only handle API communication, no business logic or validation
 */
export const profileService = {
  /**
   * Get credit line data for the current user
   * @returns {Promise<object>} - Credit line profile data
   */
  async getCreditLine() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_PROFILE.GET_CREDIT_LINE, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener la línea de crédito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  },
};
