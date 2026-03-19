import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for credit line API calls
 * Services only handle API communication, no business logic or validation
 */
class CreditLineService {
  /**
   * Get credit line data for the current user
   * @returns {Promise<object>} - Credit line data
   */
  async getCreditLine() {
    const response = await fetch(ENDPOINTS.CREDIT_LINE.GET_CREDIT_LINE, {
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
  }

  /**
   * Get credit line history for the current user
   * @param {Object} [options] - Pagination options
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=5] - Items per page (mínimo 5 movimientos)
   * @returns {Promise<object|Array>} - Credit line history data
   */
  async getCreditLineHistory(options = {}) {
    const payload = {
      page: options.page ?? 1,
      limit: Math.max(5, options.limit ?? 5),
    };
    const response = await fetch(ENDPOINTS.CREDIT_LINE.GET_CREDIT_LINE_HISTORY, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener el historial de la línea de crédito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }
}

export const creditLineService = new CreditLineService();
