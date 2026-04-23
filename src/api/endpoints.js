/**
 * API endpoints configuration
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_BASE_URL_AWS = import.meta.env.VITE_API_BASE_URL_AWS || 'https://w1887gqeij.execute-api.us-west-2.amazonaws.com/dev';

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
    UPDATE_CLIENT_PASSWORD: `${API_BASE_URL}/ecommerce/auth/update_client_password`,
    DELETE_CLIENT_ACCOUNT: `${API_BASE_URL}/ecommerce/auth/delete_client_account`,
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

  // Home
  HOME: {
    GET_HOME: `${API_BASE_URL}/ecommerce/home/get_home`,
  },

  // Products
  PRODUCTS: {
    GET_PRODUCTS: `${API_BASE_URL}/ecommerce/products/get_products`,
    GET_PRODUCT_BY_ID: `${API_BASE_URL}/ecommerce/products/get_product_by_id`,
    GET_SIMILAR_PRODUCTS: `${API_BASE_URL}/ecommerce/products/get_similar_products`,
    GET_AFFILIATE_PRODUCTS: `${API_BASE_URL}/ecommerce/products/get_affiliate_products`,
  },

  // Ecommerce Payments
  ECOMMERCE_PAYMENTS: {
    GET_PENDING_PAYMENTS: `${API_BASE_URL}/ecommerce/payments/get_pending_payments`,
  },

  // Ecommerce Affiliates
  ECOMMERCE_AFFILIATES: {
    GET_AFFILIATE_SALES_SUMMARY: `${API_BASE_URL}/ecommerce/affiliates/get_affiliate_sales_summary`,
  },

  // Ecommerce Carts
  ECOMMERCE_CARTS: {
    GET_CART: `${API_BASE_URL}/ecommerce/carts/get_cart`,
    ADD_PRODUCT_CART: `${API_BASE_URL}/ecommerce/carts/add_product_cart`,
    DELETE_PRODUCT_CART: `${API_BASE_URL}/ecommerce/carts/delete_product`,
    UPDATE_PRODUCT_QUANTITY: `${API_BASE_URL}/ecommerce/carts/update_product_quantity`,
    DELETE_CART: `${API_BASE_URL}/ecommerce/carts/delete_cart`,
  },

  // Ecommerce Orders
  ECOMMERCE_ORDERS: {
    CREATE_ORDER: `${API_BASE_URL}/ecommerce/orders/create_order`,
    GET_ORDERS_BY_STATUS: `${API_BASE_URL}/ecommerce/orders/get_orders_by_status`,
    GET_ORDER_BY_ID: `${API_BASE_URL}/ecommerce/orders/get_order_by_id`,
  },

  // Orders
  ORDERS: {
    CREATE_ORDER: `${API_BASE_URL}/ecommerce/orders/create_order`,
    GET_ORDERS_BY_STATUS: `${API_BASE_URL}/ecommerce/orders/get_orders_by_status`,
    GET_ORDER_BY_ID: `${API_BASE_URL}/ecommerce/orders/get_order_by_id`,
  },

  // Addresses
  ADDRESSES: {
    GET_ADDRESSES: `${API_BASE_URL}/ecommerce/addresses/get_addresses`,
    CREATE_DELIVERY_ADDRESS: `${API_BASE_URL}/ecommerce/addresses/create_delivery_address`,
    UPDATE_DELIVERY_ADDRESS: `${API_BASE_URL}/ecommerce/addresses/update_delivery_address`,
  },

  // Mercado Pago (AWS)
  MERCADO_PAGO: {
    GET_PAYMENT_METHODS: `${API_BASE_URL_AWS}/mercado-pago/get-payment-methods-mp`,
    CREATE_CARD_TOKEN: `${API_BASE_URL_AWS}/mercado-pago/create-token`,
    GENERATE_PAYMENT: `${API_BASE_URL_AWS}/mercado-pago/mp-generate-payment`,
  },

  // KYC
  KYC: {
    EVALUATE: import.meta.env.DEV 
      ? '/api/kyc' 
      : 'https://w1887gqeij.execute-api.us-west-2.amazonaws.com/dev/kyc',
  },

  // Ecommerce profile
  ECOMMERCE_PROFILE: {
    GET_PROFILE_INFORMATION: `${API_BASE_URL}/ecommerce/profile/get_profile_information`,
    GET_PERSONAL_INFORMATION: `${API_BASE_URL}/ecommerce/profile/get_personal_information`,
    UPDATE_CLIENT: `${API_BASE_URL}/ecommerce/profile/update_client`,
  },

  // Credit line
  CREDIT_LINE: {
    GET_CREDIT_LINE: `${API_BASE_URL}/ecommerce/credit_line/get_credit_line`,
    GET_CREDIT_LINE_HISTORY: `${API_BASE_URL}/ecommerce/credit_line/get_credit_line_history`,
  },

  // Invoices
  INVOICES: {
    GET_BY_STATUS: `${API_BASE_URL}/ecommerce/invoices/get_invoices_by_status`,
  },

  // Credit line request
  CREDIT_LINE_REQUEST: {
    CREATE: `${API_BASE_URL}/ecommerce/credit_line_request/create_credit_line_request`,
    GET_REQUESTS: `${API_BASE_URL}/ecommerce/credit_line_request/get_credit_line_requests`,
    HAVE_CREDIT_LINE_REQUEST: `${API_BASE_URL}/ecommerce/credit_line_request/have_credit_line_request`,
  },

  // Email verification (AWS)
  EMAIL_VERIFICATION: {
    ADD_EMAIL: `${API_BASE_URL_AWS}/emails/add-email-verification`,
    VALIDATE_OTP: `${API_BASE_URL_AWS}/emails/validate-email-otp`,
  },
};
