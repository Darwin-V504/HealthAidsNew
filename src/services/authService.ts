import { apiClient } from './apiClient';
import { ENDPOINTS } from '../infoutils/constants/api';

export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, { email, password });
  },

  register: async (name: string, email: string, password: string, phone: string) => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, { name, email, password, phone });
  },

  getUser: async (id: number) => {
    return apiClient.get(ENDPOINTS.AUTH.USER(id));
  },
};