import { ENDPOINTS } from '../endpoints';
import { getCookie, removeCookie } from '../../utils/cookieUtils';

/**
 * Authentication service
 */
class AuthService {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Login response
   */
  async login(email, password) {
    const response = await fetch(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return data;
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    const token = getCookie('authToken') || localStorage.getItem('authToken');
    
    if (token) {
      try {
        await fetch(ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    removeCookie('authToken');
    localStorage.removeItem('authToken');
  }

  /**
   * Get current user token (checks cookie first, then localStorage)
   * @returns {string|null} - Auth token or null
   */
  getToken() {
    return getCookie('authToken') || localStorage.getItem('authToken');
  }

  async loginClient(phoneNumber, password) {
    const response = await fetch(ENDPOINTS.ECOMMERCE_AUTH.LOGIN_CLIENT_WEB, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        password,
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      const error = new Error(data.message || 'Ocurrió un error, no se encontraron todos los parámetros o tienen un formato inválido');
      error.statusCode = 400;
      error.errors = data.error || [];
      throw error;
    }

    if (response.status === 500) {
      const error = new Error(data.message || 'Se produjo un error con el servidor');
      error.statusCode = 500;
      throw error;
    }

    if (response.status === 200 && data.success === false) {
      const error = new Error(data.statusMessage || 'El usuario o la contraseña son incorrectos');
      error.statusCode = 200;
      error.success = false;
      throw error;
    }

    if (response.status === 200 && data.success === true && data.body) {
      if (data.body.token) {
        localStorage.setItem('authToken', data.body.token);
      }

      return data;
    }

    throw new Error('Unexpected response format');
  }

  async registerClient(phoneNumber, password, name, paternalLastname, maternalLastname) {
    const response = await fetch(ENDPOINTS.ECOMMERCE_AUTH.REGISTER_CLIENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        password,
        name,
        paternalLastname,
        maternalLastname,
      }),
    });

    const data = await response.json();

    if (response.status === 400) {
      const error = new Error(data.message || 'Ocurrió un error, no se encontraron todos los parámetros o tienen un formato inválido');
      error.statusCode = 400;
      error.errors = data.error || [];
      throw error;
    }

    if (response.status === 500) {
      const error = new Error(data.message || 'Se produjo un error con el servidor');
      error.statusCode = 500;
      throw error;
    }

    if (response.status === 200 && data.success === false) {
      const error = new Error(data.statusMessage || 'El cliente con este número de teléfono ya existe');
      error.statusCode = 200;
      error.success = false;
      throw error;
    }

    if (response.status === 201 && data.success === true) {
      return data;
    }

    throw new Error('Unexpected response format');
  }
}

export const authService = new AuthService();
