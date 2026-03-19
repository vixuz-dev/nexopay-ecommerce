import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for ecommerce affiliate-related API calls
 */
class AffiliateService {
  /**
   * Get affiliate sales summary by affiliate ID
   * @param {number} affiliateId - Affiliate ID
   * @returns {Promise<object>} - Affiliate sales summary data
   */
  async getAffiliateSalesSummary(affiliateId) {
    const response = await fetch(ENDPOINTS.ECOMMERCE_AFFILIATES.GET_AFFILIATE_SALES_SUMMARY, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({ affiliateId: Number(affiliateId) }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener el resumen de ventas de afiliados');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }
}

export const affiliateService = new AffiliateService();
