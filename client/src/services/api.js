import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../constants/api';
import { STORAGE_KEYS, storage } from '../constants/storage';
import { ROUTES } from '../constants/routes';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Request interceptor to add auth token
 */
api.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status } = error.response;

      // Handle unauthorized errors
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        // Clear stored auth data
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        
        // Redirect to login if not already there
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN;
        }
      }

      // Handle forbidden errors
      if (status === HTTP_STATUS.FORBIDDEN) {
        console.error('Access forbidden:', error.response.data);
      }

      // Handle server errors
      if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      console.error('Network error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;






