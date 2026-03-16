import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAppointments,
  fetchUpcomingAppointments,
  cancelAppointment as cancelAppointmentAction
} from '../store/appointmentsSlice';
import { Appointment } from '../infoutils/types';
import { appointmentService } from '../services/appointmentService';
import { AppState } from 'react-native';

export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, upcoming, history, loading, error } = 
    useAppSelector(state => state.appointments);

  // Cargar citas
  const loadAppointments = useCallback(async (clientId: number) => {
    try {
      await dispatch(fetchAppointments(clientId)).unwrap();
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  }, [dispatch]);

  // Cargar próximas citas
  const loadUpcomingAppointments = useCallback(async (clientId: number) => {
    try {
      await dispatch(fetchUpcomingAppointments(clientId)).unwrap();
    } catch (error) {
      console.error('Error loading upcoming appointments:', error);
    }
  }, [dispatch]);

  // Cancelar cita
  const cancelAppointmentById = useCallback(async (appointmentId: number, userId: number) => {
    try {
      await dispatch(cancelAppointmentAction({ userId, appointmentId })).unwrap();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }, [dispatch]);

  // Crear nueva cita
  const createAppointment = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
    try {
      const response = await appointmentService.createAppointment(appointmentData);
      if (response?.success === true) {
        if (appointmentData.clientId) {
          await loadAppointments(appointmentData.clientId);
        }
        return response.appointment || response;
      }
      return null;
    } catch (err) {
      console.error('Error creating appointment:', err);
      throw err;
    }
  }, [loadAppointments]);

  // Actualizar al volver a la app
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    appointments,
    upcoming,
    history,
    loading: loading === true,  // Forzar booleano
    error,
    loadAppointments,
    loadUpcomingAppointments,
    createAppointment,
    cancelAppointment: cancelAppointmentById,
  };
};