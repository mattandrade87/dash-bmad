import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alertas | FinanceDash",
  description: "Gerencie seus alertas e notificações",
};

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Alertas e Notificações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Acompanhe alertas de limites, metas e transações recorrentes
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          Esta página será implementada no Epic 5 (Alertas)
        </p>
      </div>
    </div>
  );
}
