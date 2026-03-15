// Auth
export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  birthDate?: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  profileImage?: string | null;
  token?: string;
}

// Appointments
// Appointments
export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  clientId: number;
  userId?: number; // Para compatibilidad
  doctorId?: number;
  doctorName: string;
  doctorSpecialty: string; // ← AGREGAR ESTO (con 'S' mayúscula)
  specialty?: string; // Para compatibilidad
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  appointmentDate?: string; // Fecha completa del backend
}

// Chatbot - RESTAURADO
export interface ChatbotOption {
  id: number;
  text: string;
  nextNodeId: number;
  action?: 'login' | 'register';
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  isFromAI: boolean;
  createdAt: string;
  options?: ChatbotOption[];
}

export interface ChatbotNode {
  id: number;
  message: string;
  options: ChatbotOption[];
  isEndNode: boolean;
  action?: 'login' | 'register';
}

// Doctor - RESTAURADO
export interface Doctor {
  id: number;
  name: string;
  dni: string;
  specialty: string;
  email: string;
  isAvailable: boolean;
  experience?: number;
  rating?: number;
  profileImage?: string;
}

// Symptom Analysis
export interface SymptomAnalysis {
  id: string;
  symptoms: string;
  possibleDiagnosis: string;
  recommendations: string;
  severityLevel: number;
  createdAt: string;
}
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user?: User;
}