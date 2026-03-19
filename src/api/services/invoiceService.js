import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for invoice API calls
 */
class InvoiceService {
  /**
   * Get invoices by status with pagination
   * @param {object} params - { status: string, page: number, limit: number }
   * @returns {Promise<{ invoices: Array, pagination: object }>}
   */
  async getInvoicesByStatus({ status = 'Pendiente', page = 1, limit = 10 } = {}) {
    const response = await fetch(ENDPOINTS.INVOICES.GET_BY_STATUS, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({ status, page, limit }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener las facturas');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    const body = data.body || data.data || data;
    return {
      invoices: body.invoices || [],
      pagination: body.pagination || { total: 0, limit, page: 1, totalPages: 0, hasMore: false },
    };
  }
}

export const invoiceService = new InvoiceService();
