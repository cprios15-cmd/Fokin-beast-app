import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Routine, RoutineCreateInput, RoutineRepo, RoutineUpdateInput } from '../types/routines';

const KEY = 'routines_v2';

async function readAll(): Promise<Routine[]> {
  const raw = await AsyncStorage.getItem(KEY);
  const parsed: Routine[] = raw ? JSON.parse(raw) : [];
  return parsed.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

async function writeAll(routines: Routine[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(routines));
}

export const routineRepoLocal: RoutineRepo = {
  list: async () => {
    return await readAll();
  },

  getById: async (id) => {
    const all = await readAll();
    return all.find((r) => r.id === id) ?? null;
  },

  create: async (input: RoutineCreateInput) => {
    const all = await readAll();
    const now = Date.now();

    const routine: Routine = {
      id: `r-${now}`,
      name: input.name,
      exercises: input.exercises.map((ex, idx) => ({
        id: `ex-${now}-${idx}`,
        ...ex,
      })),
      createdAt: now,
      updatedAt: now,
    };

    const next = [routine, ...all];
    await writeAll(next);
    return routine;
  },

  update: async (id, input: RoutineUpdateInput) => {
    const all = await readAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Routine not found');

    const current = all[idx];

    const updated: Routine = {
      ...current,
      ...input,
      updatedAt: Date.now(),
      // si te pasan ejercicios sin id, aquí podrías normalizar; de momento asumimos que ya vienen con id
    };

    const next = [...all];
    next[idx] = updated;

    await writeAll(next);
    return updated;
  },

  remove: async (id) => {
    const all = await readAll();
    const next = all.filter((r) => r.id !== id);
    await writeAll(next);
  },

  clearAll: async () => {
    await AsyncStorage.removeItem(KEY);
  },
};
