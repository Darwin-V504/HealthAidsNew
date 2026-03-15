import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../infoutils/constants/api';
import { ApiResponse } from '../infoutils/types';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
 
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
 
  } else {
   
  }

  try {
    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    
    
    let data = text ? JSON.parse(text) : {};
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  } catch (error) {
    
    throw error;
  }
}

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();