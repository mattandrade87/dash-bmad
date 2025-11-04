import { useState } from "react";
import { toast } from "sonner";
import {
  transactionsToCSV,
  downloadCSV,
  generateCSVFilename,
} from "@/lib/utils/csv";
import type { TransactionFilters } from "@/lib/validations/transaction";

interface Transaction {
  id: string;
  date: Date | string; // Pode vir como string da API
  type: "INCOME" | "EXPENSE";
  description: string;
  amountCents: number;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface UseExportTransactionsReturn {
  exportTransactions: (transactions: Transaction[]) => void;
  exportAll: (filters?: Partial<TransactionFilters>) => Promise<void>;
  isExporting: boolean;
}

/**
 * Hook para exportar transações em formato CSV
 */
export function useExportTransactions(): UseExportTransactionsReturn {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Exporta transações já carregadas na memória
   */
  const exportTransactions = (transactions: Transaction[]) => {
    try {
      if (transactions.length === 0) {
        toast.error("Nenhuma transação para exportar");
        return;
      }

      // Converter para CSV
      const csvContent = transactionsToCSV(transactions);

      // Fazer download
      const filename = generateCSVFilename("transacoes");
      downloadCSV(csvContent, filename);

      toast.success(
        `${transactions.length} transação(ões) exportada(s) com sucesso!`
      );
    } catch (error) {
      console.error("Erro ao exportar transações:", error);
      toast.error("Erro ao exportar transações");
    }
  };

  /**
   * Busca todas as transações com filtros e exporta
   * (sem limite de paginação)
   */
  const exportAll = async (filters?: Partial<TransactionFilters>) => {
    setIsExporting(true);

    try {
      // Buscar todas as transações com filtros aplicados (sem limite)
      const params = new URLSearchParams();

      if (filters?.type) params.set("type", filters.type);
      if (filters?.categoryId) params.set("categoryId", filters.categoryId);
      if (filters?.startDate)
        params.set("startDate", filters.startDate.toISOString());
      if (filters?.endDate)
        params.set("endDate", filters.endDate.toISOString());
      if (filters?.search) params.set("search", filters.search);

      // Buscar sem limite para pegar tudo
      params.set("limit", "10000");
      params.set("offset", "0");

      const response = await fetch(`/api/transactions?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar transações");
      }

      const data = await response.json();

      if (!data.transactions || data.transactions.length === 0) {
        toast.error("Nenhuma transação encontrada para exportar");
        return;
      }

      // Exportar
      exportTransactions(data.transactions);
    } catch (error) {
      console.error("Erro ao exportar todas as transações:", error);
      toast.error("Erro ao exportar transações");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportTransactions,
    exportAll,
    isExporting,
  };
}
