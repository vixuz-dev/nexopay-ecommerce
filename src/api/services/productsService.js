import axios from 'axios';
import { ENDPOINTS } from '../endpoints';
import { ROUTES } from '../../utils/routes';
import { authService } from './authService';

class ProductService {
  async getProducts(params) {
    const { page, totalItems, categoryId, subcategoryId, productName } = params;

    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró una sesión activa. Por favor, inicia sesión.');
    }

    const payload = {
      page: Number(page),
      totalItems: Number(totalItems),
      categoryId: categoryId != null && categoryId !== '' ? Number(categoryId) : 0,
      subcategoryId: subcategoryId != null && subcategoryId !== '' ? Number(subcategoryId) : 0,
      productName: productName || '',
    };

    try {
      const response = await axios.post(
        ENDPOINTS.PRODUCTS.GET_PRODUCTS,
        payload,
        { headers: { 'token': token } },
      );
  
      if (response.data && response.data.success === false) {
        throw response;
      }
  
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        window.location.href = ROUTES.HOME;
      }

      const errorMessage = this._parseErrorMessage(error);
      console.error(`Order Creation Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene el detalle de un producto por su identificador.
   * @param {string|number} productId - ID del producto en catálogo
   * @returns {Promise<object>} - Respuesta del API (p. ej. body con el producto)
   */
  async getProductById(productId) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró una sesión activa. Por favor, inicia sesión.');
    }

    const payload = { productId: Math.floor(Number(productId)) };

    try {
      const response = await axios.post(
        ENDPOINTS.PRODUCTS.GET_PRODUCT_BY_ID,
        payload,
        { headers: { token } },
      );

      if (response.data && response.data.success === false) {
        throw response;
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        window.location.href = ROUTES.HOME;
      }

      const errorMessage = this._parseErrorMessage(error);
      console.error(`getProductById Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  }

  async getSimilarProducts(params) {
    const { categoryId, limit = 10, offset = 0 } = params;

    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró una sesión activa. Por favor, inicia sesión.');
    }

    const payload = {
      categoryId: Number(categoryId),
      limit: Number(limit),
      offset: Number(offset),
    };

    try {
      const response = await axios.post(
        ENDPOINTS.PRODUCTS.GET_SIMILAR_PRODUCTS,
        payload,
        { headers: { 'token': token } },
      );

      if (response.data && response.data.success === false) {
        throw response;
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        window.location.href = ROUTES.HOME;
      }

      const errorMessage = this._parseErrorMessage(error);
      console.error(`getSimilarProducts Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  }

  async getAffiliateProducts(params) {
    const { affiliateId, filter = 'category', categoryId, limit = 5, offset = 0 } = params;

    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró una sesión activa. Por favor, inicia sesión.');
    }

    const payload = {
      affiliateId: Number(affiliateId),
      filter: String(filter),
      categoryId: categoryId != null ? Number(categoryId) : 0,
      limit: Number(limit),
      offset: Number(offset),
    };

    try {
      const response = await axios.post(
        ENDPOINTS.PRODUCTS.GET_AFFILIATE_PRODUCTS,
        payload,
        { headers: { 'token': token } },
      );

      if (response.data && response.data.success === false) {
        throw response;
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        window.location.href = ROUTES.HOME;
      }

      const errorMessage = this._parseErrorMessage(error);
      console.error(`getAffiliateProducts Error: ${errorMessage}`, error);
      throw new Error(errorMessage);
    }
  }

  _parseErrorMessage(error) {
    if (error.response) {
      // El servidor respondió con un status fuera del rango 2xx
      const data = error.response.data;
      return data?.statusMessage || data?.message || `Error del servidor (${error.response.status})`;
    } else if (error.data) {
      // Manejo para el caso de éxito falso (response.data.success === false)
      return error.data.statusMessage || error.data.message || 'La operación no fue exitosa';
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (Error de red)
      return 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
    } else {
      // Error al configurar la petición o error de código
      return error.message || 'Ocurrió un error inesperado al procesar la orden';
    }
  }
}

export const productsService = new ProductService();