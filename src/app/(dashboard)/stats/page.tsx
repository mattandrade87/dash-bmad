"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatsCards } from "@/components/stats/stats-cards";
import { MonthlyChart } from "@/components/stats/monthly-chart";
import { CategoriesChart } from "@/components/stats/categories-chart";
import { useTransactionStats } from "@/hooks/use-transaction-stats";

export default function StatsPage() {
  const [months, setMonths] = useState(6);
  const { data, isLoading, error } = useTransactionStats({ months });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-destructive font-medium">
            Erro ao carregar estatísticas
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tente recarregar a página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estatísticas</h1>
          <p className="text-muted-foreground mt-1">
            Visualize seus dados financeiros em gráficos
          </p>
        </div>

        {/* Seletor de Período */}
        <Select
          value={months.toString()}
          onValueChange={(value) => setMonths(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
            <SelectItem value="24">Últimos 2 anos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Content */}
      {data && (
        <>
          {/* Cards de Resumo */}
          <StatsCards
            totalIncome={data.summary.totalIncome}
            totalExpense={data.summary.totalExpense}
            balance={data.summary.balance}
            transactionCount={data.summary.transactionCount}
            incomeVariation={data.variation.income}
            expenseVariation={data.variation.expense}
          />

          {/* Gráficos */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Evolução Mensal */}
            <div className="lg:col-span-2">
              <MonthlyChart data={data.monthlyEvolution} />
            </div>

            {/* Top Categorias */}
            <div className="lg:col-span-2">
              <CategoriesChart data={data.topCategories} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
