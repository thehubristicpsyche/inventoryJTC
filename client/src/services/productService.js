import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Product Service
 * Handles all product-related API calls
 */
export const productService = {
  /**
   * Get all products with optional filters
   * @param {object} params - Query parameters (limit, page, search, etc.)
   * @returns {Promise<object>} Products data
   */
  async getAllProducts(params = {}) {
    // Default to fetching all products (high limit) if not specified
    const queryParams = {
      limit: 2000,
      ...params,
    };
    const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST, { params: queryParams });
    return response.data;
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<object>} Product data
   */
  async getProductById(id) {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET(id));
    return response.data;
  },

  /**
   * Create new product
   * @param {object} productData - Product data
   * @returns {Promise<object>} Created product data
   */
  async createProduct(productData) {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
    return response.data;
  },

  /**
   * Update existing product
   * @param {string} id - Product ID
   * @param {object} productData - Updated product data
   * @returns {Promise<object>} Updated product data
   */
  async updateProduct(id, productData) {
    const response = await api.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData);
    return response.data;
  },

  /**
   * Delete product
   * @param {string} id - Product ID
   * @returns {Promise<object>} Deletion result
   */
  async deleteProduct(id) {
    const response = await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    return response.data;
  },

  /**
   * Adjust product quantity
   * @param {string} id - Product ID
   * @param {number} adjustment - Quantity adjustment (positive or negative)
   * @param {string} reason - Reason for adjustment
   * @returns {Promise<object>} Updated product data
   */
  async adjustQuantity(id, adjustment, reason) {
    const response = await api.patch(`${API_ENDPOINTS.PRODUCTS.GET(id)}/quantity`, {
      adjustment,
      reason,
    });
    return response.data;
  },

  /**
   * Get product statistics
   * @returns {Promise<object>} Product statistics
   */
  async getStats() {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.STATS);
    return response.data;
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {object} params - Additional query parameters
   * @returns {Promise<object>} Search results
   */
  async searchProducts(query, params = {}) {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.SEARCH, {
      params: { q: query, ...params },
    });
    return response.data;
  },
};

