import api from './api';
import { API_ENDPOINTS } from '../constants/api';
import { STORAGE_KEYS, storage } from '../constants/storage';

/**
 * Authentication Service
 * Handles all authentication-related API calls and storage operations
 */
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Response data with token and user
   */
  async login(email, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Response data with token and user
   */
  async register(userData) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Get current authenticated user
   * @returns {Promise<object>} Current user data
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Logout user - clears stored auth data
   */
  logout() {
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  },

  /**
   * Get stored authentication token
   * @returns {string|null} Token or null
   */
  getStoredToken() {
    return storage.get(STORAGE_KEYS.TOKEN, false); // Don't parse JSON for token (it's a string)
  },

  /**
   * Get stored user data
   * @returns {object|null} User data or null
   */
  getStoredUser() {
    return storage.get(STORAGE_KEYS.USER);
  },

  /**
   * Store authentication data
   * @param {string} token - JWT token
   * @param {object} user - User data object
   */
  storeAuth(token, user) {
    storage.set(STORAGE_KEYS.TOKEN, token, false); // Don't stringify token (it's already a string)
    storage.set(STORAGE_KEYS.USER, user, true); // Stringify user object
  },
};






