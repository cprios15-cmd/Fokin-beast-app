import { create } from 'zustand';
import type { Habit, HabitCreateInput } from '../types/habits';
import { habitRepoLocal } from '../repositories/habitRepo.local';

type HabitState = {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;

  loadHabits: () => Promise<void>;
  addHabit: (input: HabitCreateInput) => Promise<Habit>;
  removeHabit: (id: string) => Promise<void>;
  clearError: () => void;
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await habitRepoLocal.list();
      set({ habits: list, isLoading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error cargando hábitos', isLoading: false });
    }
  },

  addHabit: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const h = await habitRepoLocal.create(input);
      set({ habits: [h, ...get().habits], isLoading: false });
      return h;
    } catch (e: any) {
      set({ error: e?.message ?? 'Error creando hábito', isLoading: false });
      throw e;
    }
  },

  removeHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await habitRepoLocal.remove(id);
      set({ habits: get().habits.filter((h) => h.id !== id), isLoading: false });
    } catch (e: any) {
      set({ error: e?.message ?? 'Error borrando hábito', isLoading: false });
      throw e;
    }
  },
}));
