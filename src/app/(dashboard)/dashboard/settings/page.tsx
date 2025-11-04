import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Configurações | FinanceDash",
  description: "Configure sua conta e preferências",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Gerencie suas preferências e dados da conta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <li>• Nome e foto de perfil</li>
              <li>• Email de contato</li>
              <li>• Informações da conta</li>
            </ul>
            <Link href="/dashboard/settings/profile">
              <Button className="w-full">
                Editar Perfil
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Proteja sua conta</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <li>• Alterar senha</li>
              <li>• Gerenciar sessões ativas</li>
              <li>• Configurações de segurança</li>
            </ul>
            <Link href="/dashboard/settings/security">
              <Button variant="outline" className="w-full">
                Configurações de Segurança
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings - Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
          <CardDescription>Em breve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🎨 Aparência
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tema e preferências visuais
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🔔 Notificações
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Alertas e lembretes
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💾 Backup
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exportar seus dados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
