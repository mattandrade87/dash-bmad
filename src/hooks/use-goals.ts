import { useGoalStore } from "@/stores/goal-store";

/**
 * Hook para obter metas ativas
 */
export function useActiveGoals() {
  return useGoalStore((state) => state.getActiveGoals());
}

/**
 * Hook para obter metas completas
 */
export function useCompletedGoals() {
  return useGoalStore((state) => state.getCompletedGoals());
}

/**
 * Hook para obter progresso de uma meta
 */
export function useGoalProgress(goalId: string) {
  return useGoalStore((state) => state.getGoalProgress(goalId));
}

/**
 * Hook para operações com metas
 */
export function useGoalActions() {
  const addGoal = useGoalStore((state) => state.addGoal);
  const updateGoal = useGoalStore((state) => state.updateGoal);
  const deleteGoal = useGoalStore((state) => state.deleteGoal);
  const updateGoalProgress = useGoalStore((state) => state.updateGoalProgress);

  return {
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
  };
}
