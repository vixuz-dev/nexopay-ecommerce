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
      categoryId: Number(categoryId),
      subcategoryId: Number(subcategoryId),
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

    
    /* if (!response.ok) {
      const errorMessage = data.message || data.statusMessage || 'Error al obtener los productos';
      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusCode = response.status;
      error.statusMessage = data.statusMessage;
      error.details = data.error || data.details;
      
      // Check if token expired and perform logout
      handleAuthError(error, response); */
      
      /* throw error; */
    /* } */

    /* if (data.statusCode === 200 && data.body) {
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

    return Array.isArray(data) ? data : []; */
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