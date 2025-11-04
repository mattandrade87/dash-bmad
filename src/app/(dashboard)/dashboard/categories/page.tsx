import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias | FinanceDash",
  description: "Gerencie suas categorias",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Categorias
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Organize suas transações por categorias personalizadas
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          Esta página será implementada no Epic 6 (Categorias)
        </p>
      </div>
    </div>
  );
}
