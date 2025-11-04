import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Goal {
  id: string;
  name: string;
  targetCents: number;
  currentCents: number;
  categoryId?: string | null;
  deadline?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GoalState {
  goals: Goal[];
  isLoading: boolean;

  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoalProgress: (id: string, currentCents: number) => void;

  setLoading: (isLoading: boolean) => void;

  // Computed values
  getGoalProgress: (id: string) => number;
  getActiveGoals: () => Goal[];
  getCompletedGoals: () => Goal[];
}

export const useGoalStore = create<GoalState>()(
  devtools((set, get) => ({
    goals: [],
    isLoading: false,

    setGoals: (goals) => set({ goals }),

    addGoal: (goal) =>
      set((state) => ({
        goals: [...state.goals, goal],
      })),

    updateGoal: (id, updatedGoal) =>
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updatedGoal } : g
        ),
      })),

    deleteGoal: (id) =>
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      })),

    updateGoalProgress: (id, currentCents) =>
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, currentCents } : g
        ),
      })),

    setLoading: (isLoading) => set({ isLoading }),

    getGoalProgress: (id) => {
      const goal = get().goals.find((g) => g.id === id);
      if (!goal || goal.targetCents === 0) return 0;
      return Math.min((goal.currentCents / goal.targetCents) * 100, 100);
    },

    getActiveGoals: () => {
      return get().goals.filter((g) => g.currentCents < g.targetCents);
    },

    getCompletedGoals: () => {
      return get().goals.filter((g) => g.currentCents >= g.targetCents);
    },
  }))
);
