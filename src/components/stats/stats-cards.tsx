import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface StatsCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  incomeVariation?: number;
  expenseVariation?: number;
}

/**
 * Cards de resumo com estatísticas principais
 */
export function StatsCards({
  totalIncome,
  totalExpense,
  balance,
  transactionCount,
  incomeVariation = 0,
  expenseVariation = 0,
}: StatsCardsProps) {
  const balanceColor = balance >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Receitas */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Receitas</p>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
          {incomeVariation !== 0 && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                incomeVariation > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {incomeVariation > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(incomeVariation).toFixed(1)}% vs mês anterior
            </p>
          )}
        </div>
      </div>

      {/* Total de Despesas */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Despesas</p>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpense)}
          </p>
          {expenseVariation !== 0 && (
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${
                expenseVariation > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {expenseVariation > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(expenseVariation).toFixed(1)}% vs mês anterior
            </p>
          )}
        </div>
      </div>

      {/* Saldo */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Saldo</p>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-bold ${balanceColor}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {balance >= 0 ? "Positivo" : "Negativo"}
          </p>
        </div>
      </div>

      {/* Total de Transações */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Transações
          </p>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{transactionCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Últimos meses</p>
        </div>
      </div>
    </div>
  );
}
