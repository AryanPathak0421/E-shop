import api from './api.js';

export const chatService = {
  sendMessage: async (message) => {
    const response = await api.post('/chat/message', { message });
    return response.data;
  },
};