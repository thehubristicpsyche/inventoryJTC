/**
 * Error Messages Constants
 */

export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Cannot connect to server. Please make sure the backend server is running.',
    TIMEOUT: 'Request timeout. Please try again.',
    UNKNOWN: 'Network error occurred. Please try again.',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    UNAUTHORIZED: 'You are not authorized to access this resource.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    TOKEN_INVALID: 'Invalid authentication token.',
    LOGIN_REQUIRED: 'Please log in to access this page.',
  },
  VALIDATION: {
    REQUIRED: 'This field is required.',
    EMAIL_INVALID: 'Please enter a valid email address.',
    PASSWORD_WEAK: 'Password must be at least 8 characters long.',
    PASSWORDS_NOT_MATCH: 'Passwords do not match.',
  },
  PRODUCTS: {
    NOT_FOUND: 'Product not found.',
    CREATE_FAILED: 'Failed to create product.',
    UPDATE_FAILED: 'Failed to update product.',
    DELETE_FAILED: 'Failed to delete product.',
    SKU_EXISTS: 'A product with this SKU already exists.',
  },
  QUOTATIONS: {
    NOT_FOUND: 'Quotation not found.',
    CREATE_FAILED: 'Failed to create quotation.',
    UPDATE_FAILED: 'Failed to update quotation.',
    DELETE_FAILED: 'Failed to delete quotation.',
  },
  GENERAL: {
    SERVER_ERROR: 'An error occurred on the server. Please try again later.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
    OPERATION_FAILED: 'Operation failed. Please try again.',
  },
};

export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;

  // Network errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK.CONNECTION_FAILED;
  }

  // HTTP response errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message;

    if (message) return message;

    switch (status) {
      case 401:
        return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
      case 404:
        return ERROR_MESSAGES.GENERAL.OPERATION_FAILED;
      case 500:
        return ERROR_MESSAGES.GENERAL.SERVER_ERROR;
      default:
        return ERROR_MESSAGES.GENERAL.OPERATION_FAILED;
    }
  }

  // Generic error message
  return error.message || ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR;
};

