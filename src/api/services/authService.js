import { ENDPOINTS } from '../endpoints';

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
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Registration response
   */
  async register(userData) {
    const response = await fetch(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    const token = localStorage.getItem('authToken');
    
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

    localStorage.removeItem('authToken');
  }

  /**
   * Get current user token
   * @returns {string|null} - Auth token or null
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {Promise<object>} - Response
   */
  async forgotPassword(email) {
    const response = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send reset email');
    }

    return await response.json();
  }
}

export const authService = new AuthService();
