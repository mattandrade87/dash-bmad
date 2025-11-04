"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";
import {
  useFilteredTransactions,
  useFinancialTotals,
} from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/utils";

/**
 * Exemplo de componente usando as Zustand stores
 */
export function DashboardStats() {
  const user = useAuthStore((state) => state.user);
  const theme = useUIStore((state) => state.theme);
  const transactions = useFilteredTransactions();
  const { totalIncome, totalExpense, balance } = useFinancialTotals();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Olá, {user.name}! 👋</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Receitas */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Receitas</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        {/* Card Despesas */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Despesas</p>
          <p className="text-2xl font-bold text-red-700">
            {formatCurrency(totalExpense)}
          </p>
        </div>

        {/* Card Saldo */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Saldo</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Total de transações: {transactions.length}</p>
        <p>Tema atual: {theme}</p>
      </div>
    </div>
  );
}
