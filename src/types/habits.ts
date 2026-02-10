export type Habit = {
  id: string;
  name: string;
  icon?: string; // e.g. emoji or icon name
  timesPerDay: number;
  createdAt: number;
  updatedAt?: number;
};

export type HabitCreateInput = {
  name: string;
  icon?: string;
  timesPerDay: number;
};

export type HabitRepo = {
  list: () => Promise<Habit[]>;
  getById: (id: string) => Promise<Habit | null>;
  create: (input: HabitCreateInput) => Promise<Habit>;
  update: (id: string, input: Partial<HabitCreateInput>) => Promise<Habit>;
  remove: (id: string) => Promise<void>;
  clearAll?: () => Promise<void>;
};
