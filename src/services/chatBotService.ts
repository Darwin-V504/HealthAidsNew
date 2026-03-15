import { apiClient } from './apiClient';
import { ENDPOINTS } from '../infoutils/constants/api';

export const chatbotService = {
  start: async () => {
    return apiClient.get(ENDPOINTS.CHATBOT.START);
  },

  selectOption: async (optionId: number) => {
    return apiClient.post(ENDPOINTS.CHATBOT.SELECT, { optionId });
  },
  
  reset: async () => {
    return apiClient.post(ENDPOINTS.CHATBOT.RESET, {});
  },

  getCurrent: async () => {
    return apiClient.get(ENDPOINTS.CHATBOT.CURRENT);
  },

  getNode: async (nodeId: number) => {
    return apiClient.get(ENDPOINTS.CHATBOT.NODE(nodeId));
  },

  getInfo: async () => {
    return apiClient.get(ENDPOINTS.CHATBOT.INFO);
  },
};