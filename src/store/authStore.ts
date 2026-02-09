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

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (username: string, password: string) => {
    // Marcamos loading para que UI pueda deshabilitar inputs si quieres
    set({ isLoading: true, error: null });

    try {
      const user = validateCredentials(username, password);

      if (!user) {
        const msg = 'Usuario o contraseña incorrectos';
        set({ isAuthenticated: false, token: null, user: null, error: msg, isLoading: false });
        throw new Error(msg);
      }

      const token = `token-${user.id}-${Date.now()}`;

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (e) {
      // Si algo falla (storage, etc.), deja el estado consistente
      const msg = e instanceof Error ? e.message : 'Error al iniciar sesión';
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        error: msg,
        isLoading: false,
      });
      throw e;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } finally {
      // Siempre deja el estado limpio
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  loadSession: async () => {
    set({ isLoading: true, error: null });

    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = await AsyncStorage.getItem(AUTH_USER_KEY);

      if (token && userStr) {
        const user: User = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false, error: null });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
      }
    } catch (e) {
      console.error('Error cargando sesión:', e);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  clearError: () => set({ error: null }),
}));
