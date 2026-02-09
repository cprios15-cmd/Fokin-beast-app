import { create } from 'zustand';
import type { Routine, RoutineExercise } from '../types/routines';
import { getRoutineRepo } from '../config/routineRepo';
import { useAuthStore } from './authStore';

type RoutineState = {
  routines: Routine[];
  isLoading: boolean;
  error: string | null;

  loadRoutines: () => Promise<void>;
  addRoutine: (data: { name: string; exercises: Omit<RoutineExercise, 'id'>[] }) => Promise<Routine>;
  removeRoutine: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useRoutineStore = create<RoutineState>((set, get) => ({
  routines: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      const repo = getRoutineRepo({ userId });

      const routines = await repo.list();
      set({ routines, isLoading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error cargando rutinas', isLoading: false });
    }
  },

  addRoutine: async ({ name, exercises }) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      const repo = getRoutineRepo({ userId });

      const routine = await repo.create({ name, exercises });
      set({ routines: [routine, ...get().routines], isLoading: false });
      return routine;
    } catch (e: any) {
      set({ error: e?.message ?? 'Error creando rutina', isLoading: false });
      throw e;
    }
  },

  removeRoutine: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.id;
      const repo = getRoutineRepo({ userId });

      await repo.remove(id);
      set({ routines: get().routines.filter((r) => r.id !== id), isLoading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error borrando rutina', isLoading: false });
      throw e;
    }
  },
}));
