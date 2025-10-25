import api from './api';

export const productService = {
  async getAllProducts(params = {}) {
    // Default to fetching all products (high limit) if not specified
    const queryParams = {
      limit: 2000,
      ...params
    };
    const response = await api.get('/products', { params: queryParams });
    return response.data;
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async adjustQuantity(id, adjustment, reason) {
    const response = await api.patch(`/products/${id}/quantity`, {
      adjustment,
      reason,
    });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/products/stats');
    return response.data;
  },
};

