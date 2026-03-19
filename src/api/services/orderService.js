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

  /**
   * Get orders by status with pagination
   * @param {Object} [options]
   * @param {string} [options.status='Todos'] - Status filter
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @returns {Promise<{totalItems, totalPages, currentPage, orders}>}
   */
  async getOrdersByStatus(options = {}) {
    const payload = {
      status: options.status ?? 'Todos',
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    };

    const response = await fetch(ENDPOINTS.ORDERS.GET_ORDERS_BY_STATUS, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener los pedidos');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    if (data.success === false) {
      const error = new Error(data.statusMessage || 'No se pudieron obtener los pedidos');
      error.statusCode = data.statusCode ?? 200;
      throw error;
    }

    const body = data.body ?? data.data ?? data;
    return {
      totalItems: body.totalItems ?? 0,
      totalPages: body.totalPages ?? 1,
      currentPage: body.currentPage ?? 1,
      orders: Array.isArray(body.orders) ? body.orders : [],
    };
  },

  /**
   * Get order by ID
   * @param {number} orderId - Order ID
   * @returns {Promise<object>} - Order data
   */
  async getOrderById(orderId) {
    const response = await fetch(ENDPOINTS.ORDERS.GET_ORDER_BY_ID, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({ orderId: Number(orderId) }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener el pedido');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    if (data.success === false) {
      const error = new Error(data.statusMessage || 'No se pudo obtener el pedido');
      error.statusCode = data.statusCode ?? 200;
      throw error;
    }

    return data.body ?? data.data ?? data;
  },
};
