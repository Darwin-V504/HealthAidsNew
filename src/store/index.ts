import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import appointmentsReducer from './appointmentsSlice';
import clientReducer from './clientSlice';
import chatReducer from './chatSlice';
import doctorsReducer from './doctorsSlice';
import { RootState } from './types/storeTypes';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentsReducer,
    client: clientReducer,
    chat: chatReducer,
    doctors: doctorsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };