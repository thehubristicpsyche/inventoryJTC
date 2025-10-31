/**
 * API Configuration Constants
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    GET: (id) => `/products/${id}`,
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    STATS: '/products/stats',
    SEARCH: '/products/search',
  },
  QUOTATIONS: {
    LIST: '/quotations',
    CREATE: '/quotations',
    GET: (id) => `/quotations/${id}`,
    UPDATE: (id) => `/quotations/${id}`,
    DELETE: (id) => `/quotations/${id}`,
  },
  IMPORT: {
    CSV: '/import/csv',
    BATCH: '/import/batch',
    PREVIEW: '/import/preview',
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

