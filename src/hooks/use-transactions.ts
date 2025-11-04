import { useTransactionStore } from "@/stores/transaction-store";

/**
 * Hook para obter transações filtradas
 */
export function useFilteredTransactions() {
  return useTransactionStore((state) => state.getFilteredTransactions());
}

/**
 * Hook para obter totais financeiros
 */
export function useFinancialTotals() {
  const totalIncome = useTransactionStore((state) => state.getTotalIncome());
  const totalExpense = useTransactionStore((state) => state.getTotalExpense());
  const balance = useTransactionStore((state) => state.getBalance());

  return {
    totalIncome,
    totalExpense,
    balance,
  };
}

/**
 * Hook para operações com transações
 */
export function useTransactionActions() {
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  );
  const deleteTransaction = useTransactionStore(
    (state) => state.deleteTransaction
  );
  const setFilters = useTransactionStore((state) => state.setFilters);
  const clearFilters = useTransactionStore((state) => state.clearFilters);

  return {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    clearFilters,
  };
}
