import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { parseResponseJsonSafe } from '../utils/parseResponseJson';
import { handleAuthError } from '../../utils/authInterceptor';
import { creditLineRequestService } from './creditLineRequestService';

/**
 * Service for ecommerce profile API calls
 * Services only handle API communication, no business logic or validation
 */
export const profileService = {
  /**
   * Get profile information (orders, credit line, movement history)
   * @returns {Promise<object>} - Profile data: { orders, history_last_movements, credit_line_information }
   */
  async getProfileInformation() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_PROFILE.GET_PROFILE_INFORMATION, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener la información del perfil');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  },

  /**
   * Get personal information for the current user (requires auth token in header)
   * @returns {Promise<object>} - Parsed `body` or `data` from the API response
   */
  async getPersonalInformation() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_PROFILE.GET_PERSONAL_INFORMATION, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
      const error = new Error(
        data.message || data.statusMessage || 'Error al obtener la información personal'
      );
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    const payload = data.body ?? data.data ?? data;
    if (Array.isArray(payload)) {
      return payload[0] ?? null;
    }
    return payload ?? null;
  },

  /**
   * Get credit line data for the current user (via get_credit_line_requests)
   * @returns {Promise<Array>} - List of credit line requests
   */
  async getCreditLine() {
    return creditLineRequestService.getCreditLineRequests();
  },

};
