import { apiClient } from './apiClient';

export const appointmentService = {
  // Obtener citas de un usuario
  getUserAppointments: async (userId: number) => {
    try {
      console.log('📤 Solicitando citas para usuario:', userId);
      const response = await apiClient.get(`/api/Appointment/user/${userId}`);
      console.log('📦 Respuesta citas:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching user appointments:', error);
      return { appointments: [] };
    }
  },

  // Obtener próximas citas
  getUpcomingAppointments: async (userId: number) => {
    try {
      const response = await apiClient.get(`/api/Appointment/upcoming/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
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

  // ✅ CREAR NUEVA CITA (CORREGIDO)
  createAppointment: async (appointmentData: any) => {
    try {
      console.log('📤 Service - Enviando a /api/Appointment:', appointmentData);
      const response = await apiClient.post('/api/Appointment', appointmentData);
      console.log('📦 Service - Respuesta:', response);
      return response;
    } catch (error) {
      console.error('❌ Service - Error:', error);
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