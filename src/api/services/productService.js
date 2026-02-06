import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

/**
 * Service for product-related API calls
 * Services only handle API communication, no business logic or validation
 */

export const productService = {
  /**
   * Get products with filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (min: 1)
   * @param {number} params.totalItems - Items per page (min: 1)
   * @param {number} params.categoryId - Category ID
   * @param {number} params.subcategoryId - Subcategory ID
   * @param {string} params.productName - Product name search term (can be empty string)
   * @returns {Promise<Array>} - Array of products
   */
  async getProducts(params) {
    const { page, totalItems, categoryId, subcategoryId, productName } = params;

    const headers = getInternalApiHeaders();

    const response = await fetch(ENDPOINTS.PRODUCTS.GET_PRODUCTS, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        page: Number(page),
        totalItems: Number(totalItems),
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        productName: productName || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || data.statusMessage || 'Error al obtener los productos';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusCode = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error || data.details;
      
      // Check if token expired and perform logout
      handleAuthError(error, response);
      
      throw error;
    }

    if (data.statusCode === 200 && data.body) {
      // New format: body.products
      if (data.body.products && Array.isArray(data.body.products)) {
        return data.body.products;
      }
      // Legacy format: body is array directly
      if (Array.isArray(data.body)) {
        return data.body;
      }
      return [];
    }

    if (data.statusCode === 400) {
      const errorMessage = data.message || 'Error en los parámetros de búsqueda';
      const error = new Error(errorMessage);
      error.status = 400;
      error.details = data.error || [];
      throw error;
    }

    return Array.isArray(data) ? data : [];
  },
};

