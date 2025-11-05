import { useQuery } from "@tanstack/react-query";
import { calculateProgress } from "@/lib/validations/goal";

interface DashboardSummary {
  currentMonth: {
    income: number;
    expense: number;
    balance: number;
    transactionCount: number;
  };
  previousMonth: {
    income: number;
    expense: number;
    balance: number;
  };
  variation: {
    income: number;
    expense: number;
    balance: number;
  };
  goals: {
    total: number;
    active: number;
    completed: number;
    completedThisMonth: number;
    variation: number;
  };
}

interface RecentTransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  description: string;
  amountCents: number;
  date: string | Date;
  category: {
    name: string;
    color: string;
    icon: string | null;
  };
}

interface TopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: "INCOME" | "EXPENSE";
  total: number;
  transactionCount: number;
  percentage: number;
}

interface TopCategoriesResponse {
  expense: TopCategory[];
  income: TopCategory[];
}

interface UpcomingGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  progress: number;
}

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/summary");
      if (!response.ok) {
        throw new Error("Erro ao buscar resumo do dashboard");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}

export function useRecentTransactions(limit: number = 10) {
  return useQuery<{ transactions: RecentTransaction[]; count: number }>({
    queryKey: ["recent-transactions", limit],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/recent-transactions?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar transações recentes");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}

export function useTopCategories() {
  return useQuery<TopCategoriesResponse>({
    queryKey: ["top-categories"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/top-categories");
      if (!response.ok) {
        throw new Error("Erro ao buscar categorias principais");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}

export function useUpcomingGoals(limit: number = 3) {
  return useQuery<UpcomingGoal[]>({
    queryKey: ["upcoming-goals", limit],
    queryFn: async () => {
      // Buscar metas ativas com prazo, ordenadas por deadline mais próximo
      const response = await fetch(
        `/api/goals?status=active&orderBy=deadline&order=asc`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar metas próximas");
      }
      const data = await response.json();

      // Filtrar apenas metas com deadline e pegar as primeiras N
      const goalsWithDeadline = data.data
        .filter((goal: UpcomingGoal) => goal.deadline !== null)
        .slice(0, limit);

      // Calcular progresso para cada meta
      return goalsWithDeadline.map((goal: UpcomingGoal) => ({
        ...goal,
        progress: calculateProgress(goal.currentAmount, goal.targetAmount),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
  });
}

// Hook combinado para facilitar uso
export function useDashboardData() {
  const summary = useDashboardSummary();
  const recentTransactions = useRecentTransactions(5);
  const topCategories = useTopCategories();
  const upcomingGoals = useUpcomingGoals(3);

  return {
    summary,
    recentTransactions,
    topCategories,
    upcomingGoals,
    isLoading:
      summary.isLoading ||
      recentTransactions.isLoading ||
      topCategories.isLoading ||
      upcomingGoals.isLoading,
    isError:
      summary.isError ||
      recentTransactions.isError ||
      topCategories.isError ||
      upcomingGoals.isError,
  };
}
