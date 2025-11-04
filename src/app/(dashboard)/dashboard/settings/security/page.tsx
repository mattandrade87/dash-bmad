import { Metadata } from "next";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Segurança | FinanceDash",
  description: "Configurações de segurança da conta",
};

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/settings">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Configurações
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Segurança
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie as configurações de segurança da sua conta
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - Change Password Form */}
        <div className="lg:col-span-2">
          <ChangePasswordForm />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Tips */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Dicas de Senha Forte
                </h3>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Mínimo 8 caracteres</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Letras maiúsculas e minúsculas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Pelo menos um número</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Evite palavras óbvias</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Não reutilize senhas antigas</span>
              </li>
            </ul>
          </div>

          {/* Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Segurança da Conta
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Após alterar sua senha, você permanecerá conectado neste
              dispositivo.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Recomendamos alterar sua senha periodicamente para manter sua
              conta segura.
            </p>
          </div>

          {/* Coming Soon - Two-Factor Auth */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Em Breve
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span>🔐</span>
                <span>Autenticação de dois fatores</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>Gerenciar sessões ativas</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔑</span>
                <span>Chaves de recuperação</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
