export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:5286',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    USER: (id: number) => `/api/Auth/user/${id}`,
  },
  APPOINTMENTS: {
    
    BASE: '/api/Appointment', 
    USER: (userId: number) => `/api/Appointment/user/${userId}`,
    UPCOMING: (userId: number) => `/api/Appointment/upcoming/${userId}`, 
    HISTORY: (userId: number) => `/api/Appointment/history/${userId}`, 
    CANCEL: (id: number) => `/api/Appointment/${id}/cancel`, 
  },
  CHATBOT: {
    START: '/api/Chatbot/start',
    SELECT: '/api/Chatbot/select',
    RESET: '/api/Chatbot/reset',
    CURRENT: '/api/Chatbot/current',
    NODE: (id: number) => `/api/Chatbot/node/${id}`,
    INFO: '/api/Chatbot/info',
  },
};