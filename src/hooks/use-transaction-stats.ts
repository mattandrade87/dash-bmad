import { useQuery } from "@tanstack/react-query";

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategoryData {
  name: string;
  total: number;
  color: string;
}

interface Variation {
  income: number;
  expense: number;
}

interface Period {
  startDate: string;
  endDate: string;
  months: number;
}

interface TransactionStatsResponse {
  summary: Summary;
  monthlyEvolution: MonthlyData[];
  topCategories: CategoryData[];
  variation: Variation;
  period: Period;
}

interface UseTransactionStatsOptions {
  months?: number;
}

/**
 * Hook para buscar estatísticas de transações
 */
export function useTransactionStats(options: UseTransactionStatsOptions = {}) {
  const { months = 6 } = options;

  return useQuery<TransactionStatsResponse>({
    queryKey: ["transaction-stats", months],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("months", months.toString());

      const response = await fetch(
        `/api/transactions/stats?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
