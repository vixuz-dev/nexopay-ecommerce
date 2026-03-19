import { ENDPOINTS } from '../endpoints';
import { MERCADO_PAGO_PAYMENT_METHOD_IDS } from '../../constants/app';
import { getMercadoPagoErrorMessage } from '../../utils/mercadoPagoErrors';

/**
 * Service for Mercado Pago API calls (AWS)
 * Services only handle API communication, no business logic or validation
 */
export const mercadoPagoService = {
  /**
   * Get payment methods from Mercado Pago
   * @returns {Promise<object|Array>} - Payment methods data
   */
  async getPaymentMethods() {
    const params = new URLSearchParams({
      payment_method_ids: MERCADO_PAGO_PAYMENT_METHOD_IDS.join(','),
    });
    const url = `${ENDPOINTS.MERCADO_PAGO.GET_PAYMENT_METHODS}?${params}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener los métodos de pago');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error || data.details;
      throw error;
    }

    const methods = data.payment_methods ?? data.body?.payment_methods ?? data.body ?? data.data;
    return Array.isArray(methods) ? methods : (Array.isArray(data) ? data : []);
  },

  /**
   * Generate payment via Mercado Pago
   * @param {Object} body - Payment payload
   * @param {string} body.id - Payment method id (e.g. "master")
   * @param {string} body.payment_type_id - e.g. "credit_card"
   * @param {Object} body.payer - { email }
   * @param {string} body.token - Card token from Mercado Pago SDK
   * @param {number} body.transaction_amount - Amount in cents
   * @param {string} body.description - Payment description
   * @param {number} body.installments - Number of installments
   * @param {number} body.issuer_id - Card issuer id
   * @param {Object} body.metadata - { order_id, is_initial_payment }
   * @param {string} body.idempotency_key - Unique key for idempotency
   * @returns {Promise<object>} - Payment response
   */
  async generatePayment(body) {
    const response = await fetch(ENDPOINTS.MERCADO_PAGO.GENERATE_PAYMENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al procesar el pago');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error || data.details;
      throw error;
    }

    const result = data.body ?? data.data ?? data;
    const paymentBody = data?.payment?.body ?? result?.payment?.body ?? result;
    const paymentStatus = paymentBody?.status ?? result?.payment?.status ?? result?.status;
    const statusDetail = paymentBody?.status_detail ?? result?.payment?.status_detail ?? result?.status_detail;

    if (paymentStatus === 'rejected') {
      const message = getMercadoPagoErrorMessage(statusDetail);
      const error = new Error(message);
      error.paymentStatus = paymentStatus;
      error.statusDetail = statusDetail;
      error.paymentId = paymentBody?.payment_id ?? result?.payment_id ?? result?.payment?.id;
      throw error;
    }

    if (paymentStatus && paymentStatus !== 'approved' && paymentStatus !== 'pending' && paymentStatus !== 'in_process') {
      const error = new Error(
        statusDetail ? getMercadoPagoErrorMessage(statusDetail) : (paymentBody?.status_Message ?? result?.status_Message ?? 'El pago no pudo completarse. Intenta de nuevo.')
      );
      error.paymentStatus = paymentStatus;
      error.statusDetail = statusDetail;
      throw error;
    }

    return result;
  },
};
