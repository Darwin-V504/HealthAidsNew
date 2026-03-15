import { apiClient } from './apiClient';

export const appointmentService = {
  // Obtener citas de un usuario
  getUserAppointments: async (userId: number) => {
    try {
     
      const response = await apiClient.get(`/api/Appointment/user/${userId}`);
      
      return response;
    } catch (error) {
    
      return { appointments: [] };
    }
  },

  // Obtener próximas citas
  getUpcomingAppointments: async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/Appointment/upcoming/${userId}`);
      return response;
    } catch (error) {
      return { appointments: [] };
    }
  },

  // Obtener historial de citas
  getHistory: async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/Appointment/history/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      return { appointments: [] };
    }
  },

 
  createAppointment: async (appointmentData: any) => {
    try {
      
      const response = await apiClient.post('/api/Appointment', appointmentData);
   
      return response;
    } catch (error) {
     
      throw error;
    }
  },

  // Cancelar cita
  cancelAppointment: async (appointmentId: number) => {
    try {
      const response = await apiClient.patch(`/api/Appointment/${appointmentId}/cancel`, {});
      return response;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  // Obtener cita por ID
  getAppointmentById: async (appointmentId: number) => {
    try {
      const response = await apiClient.get(`/api/Appointment/${appointmentId}`);
      return response;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
  },
}; 