import { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiClient } from '../services/apiClient';
import { storage } from '../utils/storage';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
} | null;

type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  updateUserData: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await storage.getToken();
      const userData = await storage.getUser();
      
      if (token && userData) {
        apiClient.setToken(token); // ✅ AHORA FUNCIONA
        setUser(userData);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await apiClient.post('/api/Auth/login', { email, password }) as any;
    
    if (response?.success === true) {
      // ✅ Guardar token y usuario
      await storage.setToken(response.token);
      await storage.setUser(response.user);
      
      // ✅ IMPORTANTE: También setear el token en apiClient
      apiClient.setToken(response.token);
      
      setUser(response.user);
      return true;
    } else {
      Alert.alert('Error', response?.message || 'Credenciales inválidas');
      return false;
    }
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Error al iniciar sesión');
    return false;
  }
};

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      // ✅ URL CORREGIDA
      const response = await apiClient.post('/api/Auth/register', { name, email, password, phone }) as any;
      
      if (response?.success) {
        Alert.alert('Éxito', 'Cuenta creada exitosamente');
        return true;
      } else {
        Alert.alert('Error', response?.message || 'Error al registrarse');
        return false;
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrarse');
      return false;
    }
  };

  const logout = async () => {
    await storage.removeToken();
    await storage.removeUser();
    apiClient.clearToken(); // ✅ AHORA FUNCIONA
    setUser(null);
  };

  const updateUserData = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    if (user) {
      storage.setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};