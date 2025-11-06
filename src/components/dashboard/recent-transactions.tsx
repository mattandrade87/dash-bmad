import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
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

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function RecentTransactions({
  transactions,
  isLoading,
}: RecentTransactionsProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transações Recentes
        </h2>
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma transação encontrada
          </p>
          <Link
            href="/dashboard/transactions"
            className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Adicionar primeira transação
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transações Recentes
        </h2>
        <Link
          href="/dashboard/transactions"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const date = new Date(transaction.date);
          const relativeTime = formatDistanceToNow(date, {
            addSuffix: true,
            locale: ptBR,
          });

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{
                  backgroundColor: `${transaction.category.color}20`,
                  color: transaction.category.color,
                }}
              >
                {transaction.category.icon || "💰"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transaction.category.name} • {relativeTime}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(transaction.amountCents)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
