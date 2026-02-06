import { ENDPOINTS } from '../endpoints';
import { getInternalApiHeaders } from '../utils/apiHeaders';
import { handleAuthError } from '../../utils/authInterceptor';

class CategoryService {
  async getActiveCategories() {
    const response = await fetch(ENDPOINTS.CATEGORIES.GET_ACTIVE, {
      method: 'GET',
      headers: getInternalApiHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.statusMessage || 'Error al obtener las categorías');
      error.statusCode = response.status;
      error.status = response.status;
      error.statusMessage = data.statusMessage;
      
      // Check if token expired and perform logout
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

    return data;
  }
}

export const categoryService = new CategoryService();

