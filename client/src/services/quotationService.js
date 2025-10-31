import api from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Quotation Service
 * Handles all quotation-related API calls
 */
export const quotationService = {
  /**
   * Get all quotations with filters
   * @param {object} params - Query parameters
   * @returns {Promise<object>} Quotations data
   */
  async getAllQuotations(params = {}) {
    const response = await api.get(API_ENDPOINTS.QUOTATIONS.LIST, { params });
    return response.data;
  },

  /**
   * Get quotation statistics
   * @returns {Promise<object>} Statistics data
   */
  async getStats() {
    const response = await api.get(`${API_ENDPOINTS.QUOTATIONS.LIST}/stats`);
    return response.data;
  },

  /**
   * Get single quotation by ID
   * @param {string} id - Quotation ID
   * @returns {Promise<object>} Quotation data
   */
  async getQuotationById(id) {
    const response = await api.get(API_ENDPOINTS.QUOTATIONS.GET(id));
    return response.data;
  },

  /**
   * Create new quotation
   * @param {object} quotationData - Quotation data
   * @returns {Promise<object>} Created quotation data
   */
  async createQuotation(quotationData) {
    const response = await api.post(API_ENDPOINTS.QUOTATIONS.CREATE, quotationData);
    return response.data;
  },

  /**
   * Update quotation
   * @param {string} id - Quotation ID
   * @param {object} quotationData - Updated quotation data
   * @returns {Promise<object>} Updated quotation data
   */
  async updateQuotation(id, quotationData) {
    const response = await api.put(API_ENDPOINTS.QUOTATIONS.UPDATE(id), quotationData);
    return response.data;
  },

  /**
   * Update quotation status
   * @param {string} id - Quotation ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise<object>} Updated quotation data
   */
  async updateStatus(id, status, notes) {
    const response = await api.patch(`${API_ENDPOINTS.QUOTATIONS.GET(id)}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  /**
   * Delete quotation
   * @param {string} id - Quotation ID
   * @returns {Promise<object>} Deletion result
   */
  async deleteQuotation(id) {
    const response = await api.delete(API_ENDPOINTS.QUOTATIONS.DELETE(id));
    return response.data;
  },

  /**
   * Duplicate quotation
   * @param {string} id - Quotation ID to duplicate
   * @returns {Promise<object>} Duplicated quotation data
   */
  async duplicateQuotation(id) {
    const response = await api.post(`${API_ENDPOINTS.QUOTATIONS.GET(id)}/duplicate`);
    return response.data;
  },

  /**
   * Add line item to quotation
   * @param {string} quotationId - Quotation ID
   * @param {object} lineItemData - Line item data
   * @returns {Promise<object>} Updated quotation data
   */
  async addLineItem(quotationId, lineItemData) {
    const response = await api.post(
      `${API_ENDPOINTS.QUOTATIONS.GET(quotationId)}/line-items`,
      lineItemData
    );
    return response.data;
  },

  /**
   * Update line item in quotation
   * @param {string} quotationId - Quotation ID
   * @param {string} lineItemId - Line item ID
   * @param {object} lineItemData - Updated line item data
   * @returns {Promise<object>} Updated quotation data
   */
  async updateLineItem(quotationId, lineItemId, lineItemData) {
    const response = await api.put(
      `${API_ENDPOINTS.QUOTATIONS.GET(quotationId)}/line-items/${lineItemId}`,
      lineItemData
    );
    return response.data;
  },

  /**
   * Delete line item from quotation
   * @param {string} quotationId - Quotation ID
   * @param {string} lineItemId - Line item ID
   * @returns {Promise<object>} Updated quotation data
   */
  async deleteLineItem(quotationId, lineItemId) {
    const response = await api.delete(
      `${API_ENDPOINTS.QUOTATIONS.GET(quotationId)}/line-items/${lineItemId}`
    );
    return response.data;
  },
};






