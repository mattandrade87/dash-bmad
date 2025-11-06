import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface TopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  transactionCount: number;
  percentage: number;
}

interface TopCategoriesDashboardProps {
  categories: TopCategory[];
  isLoading?: boolean;
}

export function TopCategoriesDashboard({
  categories,
  isLoading,
}: TopCategoriesDashboardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Principais Categorias
        </h2>
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma categoria com gastos este mês
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Principais Categorias
        </h2>
        <Link
          href="/dashboard/stats"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          Ver relatório
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.name}
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(category.total)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-12 text-right">
                {category.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
