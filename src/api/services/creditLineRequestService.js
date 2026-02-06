import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for credit line request API calls
 * Services only handle API communication, no business logic or validation
 */
class CreditLineRequestService {
  /**
   * Create credit line request (sends full payload built by wizard/mapper)
   * @param {object} payload - Request body: { creditLineRequest, references, additionalInformation }
   * @returns {Promise<object>} - API response
   */
  async createCreditLineRequest(payload) {
    const response = await fetch(ENDPOINTS.CREDIT_LINE_REQUEST.CREATE, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al enviar la solicitud de crédito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data;
  }

  /**
   * Get credit line requests for the current user
   * @returns {Promise<Array>} - List of credit line requests
   */
  async getCreditLineRequests() {
    const response = await fetch(ENDPOINTS.CREDIT_LINE_REQUEST.GET_REQUESTS, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener las solicitudes de crédito');
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
  }

  /**
   * Check if user has already made a credit line request
   * @returns {Promise<{ showButton: number, requestStatus: string }>} - showButton 1 = can request, 0 = already requested
   */
  async haveCreditLineRequest() {
    const response = await fetch(ENDPOINTS.CREDIT_LINE_REQUEST.HAVE_CREDIT_LINE_REQUEST, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al verificar estado de crédito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    const body = data.body || data.data || data;
    return {
      showButton: body.showButton !== undefined ? Number(body.showButton) : 1,
      requestStatus: body.requestStatus != null ? String(body.requestStatus) : '',
    };
  }
}

export const creditLineRequestService = new CreditLineRequestService();
