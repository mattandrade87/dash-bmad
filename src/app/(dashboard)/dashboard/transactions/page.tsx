import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transações | FinanceDash",
  description: "Gerencie suas transações financeiras",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie suas receitas e despesas
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          Esta página será implementada no Epic 3 (Transações)
        </p>
      </div>
    </div>
  );
}
