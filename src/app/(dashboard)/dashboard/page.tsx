import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | FinanceDash",
  description: "Gerencie suas finanças pessoais",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo ao seu painel financeiro
        </p>
      </div>

      {/* Placeholder content - will be implemented in Epic 3+ */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Receitas
            </p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-green-600">R$ 0,00</p>
          <p className="mt-1 text-xs text-gray-500">Este mês</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Despesas
            </p>
            <span className="text-2xl">💸</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-red-600">R$ 0,00</p>
          <p className="mt-1 text-xs text-gray-500">Este mês</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Saldo
            </p>
            <span className="text-2xl">📊</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-blue-600">R$ 0,00</p>
          <p className="mt-1 text-xs text-gray-500">Total</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Metas
            </p>
            <span className="text-2xl">🎯</span>
          </div>
          <p className="mt-2 text-3xl font-bold text-purple-600">0/0</p>
          <p className="mt-1 text-xs text-gray-500">Atingidas</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Primeiros passos
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              ✓
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Conta criada com sucesso
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sua conta foi configurada e está pronta para uso
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Adicione sua primeira transação
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comece registrando uma receita ou despesa
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Configure suas metas financeiras
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Defina objetivos e acompanhe seu progresso
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
