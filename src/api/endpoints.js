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

  // Ecommerce Authentication
  ECOMMERCE_AUTH: {
    LOGIN_CLIENT_WEB: `${API_BASE_URL}/ecommerce/auth/login_client_web`,
    REGISTER_CLIENT: `${API_BASE_URL}/ecommerce/auth/register_client`,
  },

  // OTP
  OTP: {
    INSERT: `${API_BASE_URL}/otp/insert`,
    VALIDATE: `${API_BASE_URL}/otp/validate_otp`,
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

  // Categories
  CATEGORIES: {
    GET_ACTIVE: `${API_BASE_URL}/categories/get_active_categories`,
  },

  // Subcategories
  SUBCATEGORIES: {
    GET_ACTIVE: `${API_BASE_URL}/subcategories/get_active_subcategories`,
  },

  // Products
  PRODUCTS: {
    GET_PRODUCTS: `${API_BASE_URL}/ecommerce/products/get_products`,
  },

  // Ecommerce Orders
  ECOMMERCE_ORDERS: {
    CREATE_ORDER: `${API_BASE_URL}/ecommerce/orders/create_order`,
  },

  // KYC
  KYC: {
    EVALUATE: import.meta.env.DEV 
      ? '/api/kyc' 
      : 'https://w1887gqeij.execute-api.us-west-2.amazonaws.com/dev/kyc',
  },

  // Credit line request
  CREDIT_LINE_REQUEST: {
    CREATE: `${API_BASE_URL}/ecommerce/credit_line_request/create_credit_line_request`,
    GET_REQUESTS: `${API_BASE_URL}/ecommerce/credit_line_request/get_credit_line_requests`,
    HAVE_CREDIT_LINE_REQUEST: `${API_BASE_URL}/ecommerce/credit_line_request/have_credit_line_request`,
  },
};
