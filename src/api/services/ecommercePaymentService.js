import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for ecommerce payment-related API calls
 */
class EcommercePaymentService {
  /**
   * Get pending payments for the current user
   * @returns {Promise<object|Array>} - Pending payments data
   */
  async getPendingPayments() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_PAYMENTS.GET_PENDING_PAYMENTS, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener los pagos pendientes');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }
}

export const ecommercePaymentService = new EcommercePaymentService();
