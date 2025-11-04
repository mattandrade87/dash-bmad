/**
 * Utilitários para exportação de dados em formato CSV
 */

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  date: Date | string;
  type: "INCOME" | "EXPENSE";
  description: string;
  category: {
    name: string;
  };
  amountCents: number;
}

/**
 * Converte um array de transações em formato CSV
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  // Header do CSV
  const headers = ["Data", "Tipo", "Descrição", "Categoria", "Valor (R$)"];

  // Converter cada transação em linha do CSV
  const rows = transactions.map((transaction) => {
    const date = format(new Date(transaction.date), "dd/MM/yyyy", {
      locale: ptBR,
    });

    const type = transaction.type === "INCOME" ? "Receita" : "Despesa";

    // Escapar aspas duplas na descrição
    const description = `"${transaction.description.replace(/"/g, '""')}"`;

    const category = `"${transaction.category.name.replace(/"/g, '""')}"`;

    // Formatar valor em reais
    const amount = (transaction.amountCents / 100).toFixed(2).replace(".", ",");

    return [date, type, description, category, amount].join(";");
  });

  // Juntar header e rows
  return [headers.join(";"), ...rows].join("\n");
}

/**
 * Faz o download de um arquivo CSV
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Adicionar BOM (Byte Order Mark) para suporte a UTF-8 no Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Liberar memória
  URL.revokeObjectURL(url);
}

/**
 * Gera nome de arquivo CSV com data/hora atual
 */
export function generateCSVFilename(prefix: string = "transacoes"): string {
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  return `${prefix}_${timestamp}.csv`;
}
