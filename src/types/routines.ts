export type RoutineExercise = {
  id: string;
  name: string;        // nombre del ejercicio (ej: "Dominadas")
  weight: number;      // kg (0 si calistenia sin peso)
  sets: number;        // series
  reps: number;        // repeticiones
  restSec: number;     // descanso en segundos
  rir: number;         // RIR (0-5 típico)
};

export type Routine = {
  id: string;
  name: string;                 // nombre de la rutina
  exercises: RoutineExercise[];  // lista de ejercicios
  createdAt: number;
  updatedAt?: number;
};

export type RoutineCreateInput = {
  name: string;
  exercises: Omit<RoutineExercise, 'id'>[]; // ids se generan al guardar
};

export type RoutineUpdateInput = Partial<Pick<Routine, 'name' | 'exercises'>>;

export type RoutineRepo = {
  list: () => Promise<Routine[]>;
  getById: (id: string) => Promise<Routine | null>;
  create: (input: RoutineCreateInput) => Promise<Routine>;
  update: (id: string, input: RoutineUpdateInput) => Promise<Routine>;
  remove: (id: string) => Promise<void>;
  clearAll?: () => Promise<void>;
};