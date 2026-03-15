import { Doctor } from '../../infoutils/types';
import { ClientState } from '../clientSlice';
import { ChatState } from '../chatSlice';
import { DoctorsState } from '../doctorsSlice';

export interface AuthState {
  user: any;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AppointmentsState {
  appointments: any[];
  upcoming: any[];
  history: any[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  appointments: AppointmentsState;
  client: ClientState;
  chat: ChatState;
  doctors: DoctorsState; // Esta línea debe estar presente
}