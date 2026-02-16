import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for order-related API calls
 * Services only handle API communication, no business logic or validation
 */
export const orderService = {
  /**
   * Create an order
   * @param {Object} payload - Order data
   * @returns {Promise<object>} - API response
   */
  async createOrder(payload) {
    const response = await fetch(ENDPOINTS.ORDERS.CREATE_ORDER, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al crear la orden');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error || data.details;
      handleAuthError(error, response);
      throw error;
    }

    if (data.success === false) {
      const error = new Error(data.statusMessage || 'No se pudo crear el pedido');
      error.statusCode = data.statusCode ?? 200;
      error.success = false;
      throw error;
    }

    return data.body ?? data.data ?? data;
  },
};
