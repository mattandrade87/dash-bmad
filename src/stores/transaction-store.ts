import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  type: "INCOME" | "EXPENSE";
}

interface Transaction {
  id: string;
  description: string;
  amountCents: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  categoryId: string;
  category?: Category;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TransactionFilters {
  type?: "INCOME" | "EXPENSE" | "ALL";
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  filters: TransactionFilters;
  isLoading: boolean;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  setCategories: (categories: Category[]) => void;

  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;

  setLoading: (isLoading: boolean) => void;

  // Computed values
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
}

export const useTransactionStore = create<TransactionState>()(
  devtools((set, get) => ({
    transactions: [],
    categories: [],
    filters: {
      type: "ALL",
    },
    isLoading: false,

    setTransactions: (transactions) => set({ transactions }),

    addTransaction: (transaction) =>
      set((state) => ({
        transactions: [transaction, ...state.transactions],
      })),

    updateTransaction: (id, updatedTransaction) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updatedTransaction } : t
        ),
      })),

    deleteTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

    setCategories: (categories) => set({ categories }),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

    clearFilters: () =>
      set({
        filters: { type: "ALL" },
      }),

    setLoading: (isLoading) => set({ isLoading }),

    getFilteredTransactions: () => {
      const { transactions, filters } = get();
      let filtered = [...transactions];

      // Filter by type
      if (filters.type && filters.type !== "ALL") {
        filtered = filtered.filter((t) => t.type === filters.type);
      }

      // Filter by category
      if (filters.categoryId) {
        filtered = filtered.filter((t) => t.categoryId === filters.categoryId);
      }

      // Filter by date range
      if (filters.startDate) {
        filtered = filtered.filter((t) => t.date >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter((t) => t.date <= filters.endDate!);
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.description.toLowerCase().includes(query) ||
            t.notes?.toLowerCase().includes(query)
        );
      }

      return filtered;
    },

    getTotalIncome: () => {
      const filtered = get().getFilteredTransactions();
      return filtered
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amountCents, 0);
    },

    getTotalExpense: () => {
      const filtered = get().getFilteredTransactions();
      return filtered
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amountCents, 0);
    },

    getBalance: () => {
      return get().getTotalIncome() - get().getTotalExpense();
    },
  }))
);
