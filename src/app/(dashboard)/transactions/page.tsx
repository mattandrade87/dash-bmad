"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { ExportButton } from "@/components/transactions/export-button";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionFilters as FiltersType } from "@/lib/validations/transaction";

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [offset, setOffset] = useState(0);
  const limit = 50;

  // Ler filtros da URL
  const initialFilters: Partial<FiltersType> = {
    type: (searchParams.get("type") as "INCOME" | "EXPENSE") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    startDate: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined,
    endDate: searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined,
    search: searchParams.get("search") || undefined,
  };

  const [filters, setFilters] = useState<Partial<FiltersType>>(initialFilters);

  const { data, isLoading, error } = useTransactions({
    ...filters,
    limit,
    offset,
    orderBy: "date",
    order: "desc",
  });

  const handleFiltersChange = useCallback(
    (newFilters: Partial<FiltersType>) => {
      setFilters(newFilters);
      setOffset(0); // Reset paginação ao mudar filtros

      // Atualizar URL com query params
      const params = new URLSearchParams();
      if (newFilters.type) params.set("type", newFilters.type);
      if (newFilters.categoryId)
        params.set("categoryId", newFilters.categoryId);
      if (newFilters.startDate)
        params.set("startDate", newFilters.startDate.toISOString());
      if (newFilters.endDate)
        params.set("endDate", newFilters.endDate.toISOString());
      if (newFilters.search) params.set("search", newFilters.search);

      router.push(`/dashboard/transactions?${params.toString()}`, {
        scroll: false,
      });
    },
    [router]
  );

  const handleLoadMore = () => {
    if (data?.pagination.hasMore) {
      setOffset((prev) => prev + limit);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-destructive font-medium">
            Erro ao carregar transações
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
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton
            currentTransactions={data?.data || []}
            filters={filters}
          />
          <TransactionModal
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            }
          />
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total de Transações</p>
            <p className="text-2xl font-bold mt-2">{data.pagination.total}</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Receitas</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {data.data.filter((t) => t.type === "INCOME").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {data.data.filter((t) => t.type === "EXPENSE").length}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <TransactionFilters
        onFiltersChange={handleFiltersChange}
        resultsCount={data?.pagination.total}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={data?.data || []}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        hasMore={data?.pagination.hasMore}
        isLoadingMore={false}
      />
    </div>
  );
}
