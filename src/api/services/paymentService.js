import { ENDPOINTS } from '../endpoints';
import { authService } from './authService';

/**
 * Payment service
 */
class PaymentService {
  /**
   * Get authorization headers
   * @returns {object} - Headers with authorization
   */
  getAuthHeaders() {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * Create a new payment
   * @param {object} paymentData - Payment data
   * @returns {Promise<object>} - Created payment
   */
  async createPayment(paymentData) {
    const response = await fetch(ENDPOINTS.PAYMENTS.CREATE, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    return await response.json();
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   * @returns {Promise<object>} - Payment data
   */
  async getPaymentById(paymentId) {
    const response = await fetch(ENDPOINTS.PAYMENTS.GET_BY_ID(paymentId), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment');
    }

    return await response.json();
  }

  /**
   * Get user payments
   * @param {object} params - Query parameters
   * @returns {Promise<object>} - Payments list
   */
  async getUserPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${ENDPOINTS.PAYMENTS.GET_BY_USER}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payments');
    }

    return await response.json();
  }

  /**
   * Update payment status
   * @param {string} paymentId - Payment ID
   * @param {string} status - New status
   * @returns {Promise<object>} - Updated payment
   */
  async updatePaymentStatus(paymentId, status) {
    const response = await fetch(ENDPOINTS.PAYMENTS.UPDATE_STATUS(paymentId), {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update payment status');
    }

    return await response.json();
  }
}

export const paymentService = new PaymentService();
