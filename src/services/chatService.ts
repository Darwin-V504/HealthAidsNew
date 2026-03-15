import { apiClient } from './apiClient';
import { ChatMessage, ChatbotOption } from '../infoutils/types';

export const chatService = {
  // Obtener historial del chat
  getChatHistory: async (userId: number): Promise<ChatMessage[]> => {
    try {
      const response = await apiClient.get(`/api/Chat/history/${userId}`);
      return response.messages || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  },

  // Enviar mensaje
  sendMessage: async (userId: number, message: string): Promise<ChatMessage> => {
    try {
      const response = await apiClient.post('/api/Chat/message', { userId, message });
      return response.message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Obtener opciones del chat
  getChatOptions: async (): Promise<ChatbotOption[]> => {
    try {
      const response = await apiClient.get('/api/Chat/options');
      return response.options || [];
    } catch (error) {
      console.error('Error fetching chat options:', error);
      // Opciones por defecto en caso de error
      return [
        { id: 1, text: 'Agendar cita', nextNodeId: 2 },
        { id: 2, text: 'Ver doctores', nextNodeId: 3 },
        { id: 3, text: 'Información', nextNodeId: 4 },
        { id: 4, text: 'Contacto', nextNodeId: 5 },
      ];
    }
  },
};
