import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { parseResponseJsonSafe } from '../utils/parseResponseJson';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for address-related API calls
 * Services only handle API communication, no business logic or validation
 */
export const addressService = {
  /**
   * Get addresses for the current user (requires auth token in header)
   * @returns {Promise<Array>} - List of user addresses
   */
  async getAddresses() {
    const response = await fetch(ENDPOINTS.ADDRESSES.GET_ADDRESSES, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener las direcciones');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    if (data.body && Array.isArray(data.body)) {
      return data.body;
    }
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  },

  /**
   * Create a delivery address for the current user (requires auth token in header)
   * @param {Object} payload - Delivery address data
   * @param {string} payload.alias - Alias for the address (e.g. "Casa", "Oficina")
   * @param {string} payload.nameReceived - Full name of the recipient
   * @param {string} payload.phoneReceived - 10-digit phone number
   * @param {string} payload.street - Street name
   * @param {string} payload.externalNumber - External number
   * @param {string} payload.internalNumber - Internal number (can be empty)
   * @param {string} payload.neighborhood - Neighborhood/colony
   * @param {string} payload.city - City/municipality
   * @param {string} payload.state - State
   * @param {string} payload.zipCode - 5-digit zip code
   * @param {string} payload.addressReferences - Additional references (can be empty)
   * @param {string} payload.latitude - Latitude (can be empty)
   * @param {string} payload.longitude - Longitude (can be empty)
   * @returns {Promise<{clientAddressId: number}>} - Created address ID
   */
  async createDeliveryAddress(payload) {
    const response = await fetch(ENDPOINTS.ADDRESSES.CREATE_DELIVERY_ADDRESS, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al crear la dirección');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error;
      handleAuthError(error, response);
      throw error;
    }

    if (data.success === false) {
      const error = new Error(data.statusMessage || 'Error al crear la dirección');
      error.statusCode = data.statusCode || 200;
      error.status = data.statusCode || 200;
      error.statusMessage = data.statusMessage;
      throw error;
    }

    if (data.body && data.body.clientAddressId != null) {
      return data.body;
    }
    return data.body || data;
  },

  /**
   * Update an existing delivery address (requires auth token in header)
   * @param {Object} payload - Same shape as create plus address identifier (e.g. clientAddressId)
   * @returns {Promise<Object>} - Parsed response body from the API
   */
  async updateDeliveryAddress(payload) {
    const response = await fetch(ENDPOINTS.ADDRESSES.UPDATE_DELIVERY_ADDRESS, {
      method: 'PUT',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await parseResponseJsonSafe(response);

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al actualizar la dirección');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error;
      handleAuthError(error, response);
      throw error;
    }

    if (data.success === false) {
      const error = new Error(data.statusMessage || 'Error al actualizar la dirección');
      error.statusCode = data.statusCode || 200;
      error.status = data.statusCode || 200;
      error.statusMessage = data.statusMessage;
      throw error;
    }

    if (data.body != null) {
      return data.body;
    }
    return data;
  },
};
