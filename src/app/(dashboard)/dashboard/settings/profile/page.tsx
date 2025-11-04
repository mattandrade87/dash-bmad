import { Metadata } from "next";
import { ProfileForm } from "@/components/profile/profile-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Perfil | FinanceDash",
  description: "Gerencie suas informações de perfil",
};

export default function ProfilePage() {
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
            Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie suas informações pessoais
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Segurança
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Proteja sua conta
                </p>
              </div>
            </div>
            <Link href="/dashboard/settings/security">
              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
            </Link>
          </div>

          {/* Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Dicas de Segurança
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Use uma senha forte e única</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Mantenha seu email atualizado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Não compartilhe sua senha</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
