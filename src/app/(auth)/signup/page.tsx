import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Conta | Dashboard Financeiro",
  description: "Crie sua conta para começar a gerenciar suas finanças",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Controle suas finanças de forma inteligente
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
