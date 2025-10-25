import api from './api';

export const quotationService = {
  // Get all quotations with filters
  async getAllQuotations(params = {}) {
    const response = await api.get('/quotations', { params });
    return response.data;
  },

  // Get quotation statistics
  async getStats() {
    const response = await api.get('/quotations/stats');
    return response.data;
  },

  // Get single quotation by ID
  async getQuotationById(id) {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  },

  // Create new quotation
  async createQuotation(quotationData) {
    const response = await api.post('/quotations', quotationData);
    return response.data;
  },

  // Update quotation
  async updateQuotation(id, quotationData) {
    const response = await api.put(`/quotations/${id}`, quotationData);
    return response.data;
  },

  // Update quotation status
  async updateStatus(id, status, notes) {
    const response = await api.patch(`/quotations/${id}/status`, { status, notes });
    return response.data;
  },

  // Delete quotation
  async deleteQuotation(id) {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  },

  // Duplicate quotation
  async duplicateQuotation(id) {
    const response = await api.post(`/quotations/${id}/duplicate`);
    return response.data;
  },

  // Line item operations
  async addLineItem(quotationId, lineItemData) {
    const response = await api.post(`/quotations/${quotationId}/line-items`, lineItemData);
    return response.data;
  },

  async updateLineItem(quotationId, lineItemId, lineItemData) {
    const response = await api.put(`/quotations/${quotationId}/line-items/${lineItemId}`, lineItemData);
    return response.data;
  },

  async deleteLineItem(quotationId, lineItemId) {
    const response = await api.delete(`/quotations/${quotationId}/line-items/${lineItemId}`);
    return response.data;
  },
};





