"use client";

import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";

/**
 * Componente de métricas do dashboard com cache
 */
export function CachedDashboardMetrics() {
  const { metrics, isLoading, error, refetch } = useDashboardMetrics();

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">Erro ao carregar métricas: {error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resumo do Mês</h2>
        <button
          onClick={refetch}
          className="text-sm text-muted-foreground hover:text-foreground"
          title="Atualizar métricas"
        >
          🔄 Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Receitas */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-sm text-green-600">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(metrics.totalIncome)}
            </p>
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm text-red-600">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">
              {formatCurrency(metrics.totalExpense)}
            </p>
          </CardContent>
        </Card>

        {/* Saldo */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm text-blue-600">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">
              {formatCurrency(metrics.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Transações</p>
          <p className="text-xl font-bold">{metrics.transactionsCount}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Categorias</p>
          <p className="text-xl font-bold">{metrics.categoriesCount}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Metas</p>
          <p className="text-xl font-bold">{metrics.goalsCount}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Metas Ativas</p>
          <p className="text-xl font-bold">{metrics.activeGoalsCount}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Última atualização:{" "}
        {new Date(metrics.lastUpdated).toLocaleString("pt-BR")}
        {" • "}
        <span className="text-green-600">✓ Cache ativo (5 min)</span>
      </p>
    </div>
  );
}
