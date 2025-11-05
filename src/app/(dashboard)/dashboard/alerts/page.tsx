import { Metadata } from "next";
import Link from "next/link";
import { Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
        <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Em Breve: Sistema de Alertas
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Esta funcionalidade será implementada no Epic 7. Você poderá
          configurar alertas para metas próximas do prazo, limites de gastos e
          muito mais.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
