"use client";

import { TransactionItem } from "./transaction-item";
import { TransactionListSkeleton } from "./transaction-skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function TransactionList({
  transactions,
  isLoading,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: TransactionListProps) {
  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-16 w-16" />}
        title="Nenhuma transação encontrada"
        description="Comece adicionando sua primeira transação para acompanhar suas finanças."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Carregando..." : "Carregar mais"}
          </Button>
        </div>
      )}
    </div>
  );
}
