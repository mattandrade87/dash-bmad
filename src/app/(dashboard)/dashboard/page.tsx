"use client";

export const dynamic = 'force-dynamic';

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TopCategoriesDashboard } from "@/components/dashboard/top-categories-dashboard";
import { UpcomingGoals } from "@/components/dashboard/upcoming-goals";

export default function DashboardPage() {
  const { summary, recentTransactions, topCategories, upcomingGoals } =
    useDashboardData();

  const currentMonth = format(new Date(), "MMMM 'de' yyyy", { locale: ptBR });
  const capitalizedMonth =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {capitalizedMonth}
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards
        data={
          summary.data || {
            currentMonth: {
              income: 0,
              expense: 0,
              balance: 0,
              transactionCount: 0,
            },
            variation: { income: 0, expense: 0, balance: 0 },
            goals: {
              total: 0,
              active: 0,
              completed: 0,
              completedThisMonth: 0,
              variation: 0,
            },
          }
        }
        isLoading={summary.isLoading}
      />

      {/* Grid com Transações Recentes e Metas Próximas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentTransactions
          transactions={recentTransactions.data?.transactions || []}
          isLoading={recentTransactions.isLoading}
        />

        <UpcomingGoals
          goals={upcomingGoals.data || []}
          isLoading={upcomingGoals.isLoading}
        />
      </div>

      {/* Top Categorias (full width) */}
      <TopCategoriesDashboard
        categories={topCategories.data?.expense || []}
        isLoading={topCategories.isLoading}
      />
    </div>
  );
}
