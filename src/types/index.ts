// Tipos de datos principales

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  muscleGroup?: string;
  description?: string;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  weight?: number;
  notes?: string;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSet {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  routineId?: string;
  routineName?: string;
  date: Date;
  exercises: WorkoutExercise[];
  duration: number;
  notes?: string;
  completed: boolean;
}