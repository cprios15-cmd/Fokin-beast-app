import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';
import { validateCredentials } from '../data/users';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ error: null });

      // Validar contra usuarios hardcodeados
      const user = validateCredentials(username, password);

      if (!user) {
        set({ error: 'Usuario o contraseña incorrectos' });
        throw new Error('Credenciales inválidas');
      }

      // Generar token simple (en producción sería JWT real)
      const token = `token-${user.id}-${Date.now()}`;

      // Guardar sesión
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null 
    });
  },

  loadSession: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error cargando sesión:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));