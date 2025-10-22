/**
 * API endpoints configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  // User management
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
  },

  // Payments
  PAYMENTS: {
    BASE: `${API_BASE_URL}/payments`,
    CREATE: `${API_BASE_URL}/payments`,
    GET_BY_ID: (id) => `${API_BASE_URL}/payments/${id}`,
    GET_BY_USER: `${API_BASE_URL}/payments/user`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/payments/${id}/status`,
  },

  // Transactions
  TRANSACTIONS: {
    BASE: `${API_BASE_URL}/transactions`,
    GET_BY_USER: `${API_BASE_URL}/transactions/user`,
    GET_BY_ID: (id) => `${API_BASE_URL}/transactions/${id}`,
    CREATE: `${API_BASE_URL}/transactions`,
  },

  // Contact
  CONTACT: {
    SEND_MESSAGE: `${API_BASE_URL}/contact/send-message`,
    GET_MESSAGES: `${API_BASE_URL}/contact/messages`,
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: `${API_BASE_URL}/analytics/dashboard`,
    PAYMENTS_STATS: `${API_BASE_URL}/analytics/payments`,
    USER_STATS: `${API_BASE_URL}/analytics/users`,
  },
};
