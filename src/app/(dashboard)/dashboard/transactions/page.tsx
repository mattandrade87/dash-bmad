"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionModal } from "@/components/transactions/transaction-modal";
import { ExportButton } from "@/components/transactions/export-button";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    type?: "INCOME" | "EXPENSE";
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }>({});

  const { data, isLoading } = useTransactions({
    limit: 50,
    offset: 0,
    orderBy: "date",
    order: "desc",
    ...filters,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton />
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <TransactionFilters
        onFiltersChange={setFilters}
        resultsCount={data?.pagination.total}
      />

      {/* Lista de transações */}
      <TransactionList transactions={data?.data || []} isLoading={isLoading} />

      {/* Modal */}
      <TransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
