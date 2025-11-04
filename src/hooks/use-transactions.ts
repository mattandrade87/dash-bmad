"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionFilters } from "@/lib/validations/transaction";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  description: string;
  date: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

async function fetchTransactions(
  filters?: TransactionFilters
): Promise<TransactionsResponse> {
  const params = new URLSearchParams();

  if (filters?.type) params.append("type", filters.type);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.startDate)
    params.append("startDate", filters.startDate.toISOString());
  if (filters?.endDate) params.append("endDate", filters.endDate.toISOString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.offset) params.append("offset", filters.offset.toString());
  if (filters?.orderBy) params.append("orderBy", filters.orderBy);
  if (filters?.order) params.append("order", filters.order);

  const response = await fetch(`/api/transactions?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar transações");
  }

  return response.json();
}

async function deleteTransaction(id: string): Promise<void> {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao deletar transação");
  }
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      // Invalida todas as queries de transações para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
