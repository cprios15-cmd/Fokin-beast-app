import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Habit, HabitCreateInput, HabitRepo } from '../types/habits';

const KEY = 'habits_v1';

async function readAll(): Promise<Habit[]> {
  const raw = await AsyncStorage.getItem(KEY);
  const parsed: Habit[] = raw ? JSON.parse(raw) : [];
  return parsed.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

async function writeAll(items: Habit[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export const habitRepoLocal: HabitRepo = {
  list: async () => await readAll(),

  getById: async (id) => {
    const all = await readAll();
    return all.find((h) => h.id === id) ?? null;
  },

  create: async (input: HabitCreateInput) => {
    const all = await readAll();
    const now = Date.now();
    const item: Habit = {
      id: `h-${now}`,
      name: input.name,
      icon: input.icon,
      timesPerDay: input.timesPerDay,
      createdAt: now,
      updatedAt: now,
    };
    const next = [item, ...all];
    await writeAll(next);
    return item;
  },

  update: async (id, input) => {
    const all = await readAll();
    const idx = all.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error('Habit not found');
    const updated: Habit = { ...all[idx], ...input, updatedAt: Date.now() } as Habit;
    const next = [...all];
    next[idx] = updated;
    await writeAll(next);
    return updated;
  },

  remove: async (id) => {
    const all = await readAll();
    const next = all.filter((h) => h.id !== id);
    await writeAll(next);
  },

  clearAll: async () => {
    await AsyncStorage.removeItem(KEY);
  },
};
