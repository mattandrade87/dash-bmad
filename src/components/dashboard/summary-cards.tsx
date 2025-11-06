import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Target,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardsProps {
  data: {
    currentMonth: {
      income: number;
      expense: number;
      balance: number;
      transactionCount: number;
    };
    variation: {
      income: number;
      expense: number;
      balance: number;
    };
    goals?: {
      total: number;
      active: number;
      completed: number;
      completedThisMonth: number;
      variation: number;
    };
  };
  isLoading?: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Receitas",
      value: data.currentMonth.income,
      variation: data.variation.income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      isPositive: true,
    },
    {
      title: "Despesas",
      value: data.currentMonth.expense,
      variation: data.variation.expense,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
      isPositive: false,
    },
    {
      title: "Saldo",
      value: data.currentMonth.balance,
      variation: data.variation.balance,
      icon: DollarSign,
      color: data.currentMonth.balance >= 0 ? "text-blue-600" : "text-red-600",
      bgColor:
        data.currentMonth.balance >= 0
          ? "bg-blue-100 dark:bg-blue-900"
          : "bg-red-100 dark:bg-red-900",
      isPositive: data.currentMonth.balance >= 0,
    },
    {
      title: "Transações",
      value: data.currentMonth.transactionCount,
      variation: 0,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      isPositive: true,
      isCount: true,
    },
    {
      title: "Metas",
      value: `${data.goals?.completed || 0}/${data.goals?.total || 0}`,
      variation: data.goals?.variation || 0,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900",
      isPositive: true,
      isGoals: true,
      customLabel: data.goals?.completedThisMonth
        ? `+${data.goals.completedThisMonth} concluída${
            data.goals.completedThisMonth > 1 ? "s" : ""
          }`
        : "Nenhuma concluída",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const variation = card.variation;
        const showVariation =
          !card.isCount && !card.isGoals && Math.abs(variation) > 0;

        return (
          <div
            key={card.title}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <div className={`${card.bgColor} rounded-full p-2`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>

            <div className="mt-3">
              <p className={`text-3xl font-bold ${card.color}`}>
                {card.isCount || card.isGoals
                  ? card.value
                  : formatCurrency(Number(card.value))}
              </p>

              {showVariation && (
                <div className="mt-2 flex items-center gap-1">
                  {variation > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      variation > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {variation > 0 ? "+" : ""}
                    {variation.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    vs mês anterior
                  </span>
                </div>
              )}

              {!showVariation && !card.isCount && !card.isGoals && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Este mês
                </p>
              )}

              {card.isCount && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  No mês atual
                </p>
              )}

              {card.isGoals && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {card.customLabel}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
