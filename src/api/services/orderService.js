import axios from 'axios';
import { ENDPOINTS } from '../endpoints';
import { ROUTES } from '../../utils/routes';
import { authService } from './authService';

class OrderService {
  async createOrder(payload) {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No se encontró una sesión activa. Por favor, inicia sesión.');
    }
    
    try {
      const response = await axios.post(
        ENDPOINTS.ECOMMERCE_ORDERS.CREATE_ORDER,
        payload,
        { headers: { 'token': token } }
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

export const orderService = new OrderService();
