import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../infoutils/types';

export interface ClientState extends User {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: ClientState = {
  id: 0,
  email: '',
  fullName: '',
  phone: '',
  birthDate: '',
  bloodType: undefined,
  allergies: [],
  chronicConditions: [],
  emergencyContact: undefined,
  profileImage: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<ClientState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    updateUser: (state, action: PayloadAction<Partial<ClientState>>) => {
      Object.assign(state, action.payload);
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      state.profileImage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  updateUser,
  updateProfileImage,
  setLoading,
  setError,
  logout,
  clearError,
} = clientSlice.actions;

export default clientSlice.reducer;