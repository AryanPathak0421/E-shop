import api from './api.js';

export const orderService = {
  createOrder: async (shippingAddress) => {
    const response = await api.post('/orders', { shippingAddress });
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get('/orders/user/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrders: async (filters = {}) => {
    const response = await api.get('/orders', { params: filters });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}`, status);
    return response.data;
  },
};