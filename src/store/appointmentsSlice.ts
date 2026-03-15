import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentService } from '../services/appointmentService';
import { AppointmentsState } from './types/storeTypes';
import { Appointment } from '../infoutils/types';
import { sortAppointmentsByDate, filterUpcomingAppointments, filterPastAppointments } from '../utils/appointmentUtils';

const initialState: AppointmentsState = {
  appointments: [],
  upcoming: [],
  history: [],
  loading: false,
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (userId: number) => {
    const response = await appointmentService.getUserAppointments(userId);
    return response.appointments || [];
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'appointments/fetchUpcoming',
  async (userId: number) => {
    const response = await appointmentService.getUpcomingAppointments(userId);
    return response.appointments || [];
  }
);

export const fetchHistory = createAsyncThunk(
  'appointments/fetchHistory',
  async (userId: number) => {
    const response = await appointmentService.getHistory(userId);
    return response.appointments || [];
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async ({ userId, appointmentId }: { userId: number; appointmentId: number }) => {
    const response = await appointmentService.cancelAppointment(appointmentId);
    if (response.success) {
      const updated = await appointmentService.getUserAppointments(userId);
      return updated.appointments || [];
    }
    throw new Error('Error al cancelar cita');
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
        
        state.upcoming = sortAppointmentsByDate(
          filterUpcomingAppointments(action.payload),
          true
        );
        state.history = sortAppointmentsByDate(
          filterPastAppointments(action.payload),
          false
        );
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar citas';
      })
      
      // Fetch Upcoming
      .addCase(fetchUpcomingAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.upcoming = sortAppointmentsByDate(action.payload, true);
      })
      .addCase(fetchUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar citas';
      })
      
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.history = sortAppointmentsByDate(action.payload, false);
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar historial';
      })
      
      // Cancel
      .addCase(cancelAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAppointment.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.loading = false;
        state.appointments = action.payload;
        
        state.upcoming = sortAppointmentsByDate(
          filterUpcomingAppointments(action.payload),
          true
        );
        state.history = sortAppointmentsByDate(
          filterPastAppointments(action.payload),
          false
        );
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cancelar cita';
      });
  },
});

export const { clearError } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;