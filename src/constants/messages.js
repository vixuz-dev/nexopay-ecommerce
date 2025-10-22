/**
 * Application messages and text constants
 */

export const MESSAGES = {
  // Success messages
  SUCCESS: {
    LOGIN: 'Login successful!',
    LOGOUT: 'Logout successful!',
    REGISTER: 'Registration successful!',
    PAYMENT_CREATED: 'Payment created successfully!',
    PAYMENT_UPDATED: 'Payment updated successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    MESSAGE_SENT: 'Message sent successfully!',
  },

  // Error messages
  ERROR: {
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    PAYMENT_FAILED: 'Payment processing failed.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
  },

  // Validation messages
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters',
    PASSWORD_MISMATCH: 'Passwords do not match',
    PHONE_INVALID: 'Please enter a valid phone number',
    URL_INVALID: 'Please enter a valid URL',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  },

  // Loading messages
  LOADING: {
    LOGIN: 'Logging in...',
    REGISTER: 'Creating account...',
    PAYMENT: 'Processing payment...',
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    SENDING: 'Sending...',
  },

  // Info messages
  INFO: {
    NO_DATA: 'No data available',
    NO_RESULTS: 'No results found',
    COMING_SOON: 'Coming soon!',
    MAINTENANCE: 'We are currently under maintenance. Please try again later.',
  },
};

export const PLACEHOLDERS = {
  EMAIL: 'Enter your email address',
  PASSWORD: 'Enter your password',
  CONFIRM_PASSWORD: 'Confirm your password',
  FIRST_NAME: 'Enter your first name',
  LAST_NAME: 'Enter your last name',
  PHONE: 'Enter your phone number',
  MESSAGE: 'Enter your message',
  SEARCH: 'Search...',
};

export const LABELS = {
  EMAIL: 'Email Address',
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  PHONE: 'Phone Number',
  MESSAGE: 'Message',
  SUBJECT: 'Subject',
  AMOUNT: 'Amount',
  CURRENCY: 'Currency',
  DESCRIPTION: 'Description',
};
