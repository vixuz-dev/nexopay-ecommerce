import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for ecommerce cart-related API calls
 */
class CartService {
  /**
   * Get cart for the current user
   * @returns {Promise<object>} - Cart data
   */
  async getCart() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_CARTS.GET_CART, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener el carrito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }

  /**
   * Add product to cart
   * @param {Object} payload
   * @param {number} payload.productVariantId - Product variant ID (integer >= 1)
   * @param {number} payload.quantity - Quantity to add (integer >= 1)
   * @returns {Promise<object>} - Response data
   */
  async addProductToCart(payload) {
    const productVariantId = Math.floor(Number(payload.productVariantId));
    const quantity = Number.isInteger(Number(payload.quantity)) ? Number(payload.quantity) : Math.floor(Number(payload.quantity) || 1);

    if (!Number.isInteger(productVariantId) || productVariantId < 1) {
      const error = new Error('productVariantId es requerido y debe ser un entero mayor o igual a 1');
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      const error = new Error('quantity es requerido y debe ser un entero mayor o igual a 1');
      error.statusCode = 400;
      throw error;
    }

    const response = await fetch(ENDPOINTS.ECOMMERCE_CARTS.ADD_PRODUCT_CART, {
      method: 'POST',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({
        productVariantId,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const messages = Array.isArray(data.error) ? data.error.join(', ') : null;
      const error = new Error(messages || data.message || data.statusMessage || 'Error al agregar el producto al carrito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }

  /**
   * Remove product from cart
   * @param {Object} payload
   * @param {number} payload.productVariantId - Product variant ID to remove (integer >= 1)
   * @returns {Promise<object|null>} - Response data or null on 204
   */
  async deleteProductFromCart(payload) {
    const productVariantId = Math.floor(Number(payload.productVariantId));

    if (!Number.isInteger(productVariantId) || productVariantId < 1) {
      const error = new Error('productVariantId es requerido y debe ser un entero mayor o igual a 1');
      error.statusCode = 400;
      throw error;
    }

    const response = await fetch(ENDPOINTS.ECOMMERCE_CARTS.DELETE_PRODUCT_CART, {
      method: 'PUT',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({
        productVariantId,
      }),
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const messages = Array.isArray(data.error) ? data.error.join(', ') : null;
      const error = new Error(messages || data.message || data.statusMessage || 'Error al remover el producto del carrito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }

  /**
   * Update product quantity in cart
   * @param {Object} payload
   * @param {number} payload.productVariantId - Product variant ID (integer >= 1)
   * @param {number} payload.quantity - New quantity (integer >= 0)
   * @returns {Promise<object|null>} - Response data or null on 204
   */
  async updateProductQuantity(payload) {
    const productVariantId = Number(payload.productVariantId);
    const quantity = Number.isInteger(Number(payload.quantity)) ? Number(payload.quantity) : Math.floor(Number(payload.quantity) || 0);

    if (!Number.isInteger(productVariantId) || productVariantId < 1) {
      const error = new Error('productVariantId es requerido y debe ser un entero mayor o igual a 1');
      error.statusCode = 400;
      throw error;
    }

    if (quantity < 0) {
      const error = new Error('quantity debe ser un entero mayor o igual a 0');
      error.statusCode = 400;
      throw error;
    }

    const response = await fetch(ENDPOINTS.ECOMMERCE_CARTS.UPDATE_PRODUCT_QUANTITY, {
      method: 'PUT',
      headers: getInternalApiHeaders(),
      body: JSON.stringify({
        productVariantId,
        quantity,
      }),
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const messages = Array.isArray(data.error) ? data.error.join(', ') : null;
      const error = new Error(messages || data.message || data.statusMessage || 'Error al actualizar la cantidad');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }

  /**
   * Delete entire cart
   * @returns {Promise<object|null>} - Response data or null on 204
   */
  async deleteCart() {
    const response = await fetch(ENDPOINTS.ECOMMERCE_CARTS.DELETE_CART, {
      method: 'DELETE',
      headers: getInternalApiHeaders(),
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al vaciar el carrito');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      handleAuthError(error, response);
      throw error;
    }

    return data.body ?? data.data ?? data;
  }
}

export const cartService = new CartService();
