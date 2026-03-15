import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from '../infoutils/types';

export interface DoctorsState {
  items: Doctor[];
  selectedDoctor: Doctor | null;
  specialties: string[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorsState = {
  items: [],
  selectedDoctor: null,
  specialties: [],
  loading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.items = action.payload;
      const specialtiesSet = new Set(action.payload.map(d => d.specialty));
      state.specialties = Array.from(specialtiesSet).sort();
    },
    addDoctor: (state, action: PayloadAction<Doctor>) => {
      state.items.push(action.payload);
      if (!state.specialties.includes(action.payload.specialty)) {
        state.specialties.push(action.payload.specialty);
        state.specialties.sort();
      }
    },
    updateDoctor: (state, action: PayloadAction<Doctor>) => {
      const index = state.items.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    setDoctorsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDoctorsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearDoctors: (state) => {
      state.items = [];
      state.selectedDoctor = null;
      state.specialties = [];
    },
  },
});

export const {
  setDoctors,
  addDoctor,
  updateDoctor,
  setSelectedDoctor,
  setDoctorsLoading,
  setDoctorsError,
  clearDoctors,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;