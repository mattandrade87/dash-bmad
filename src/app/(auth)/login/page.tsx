import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

// Fix: Force dynamic rendering for pages using useSearchParams
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | Dashboard Financeiro",
  description: "Faça login para acessar sua conta",
};

export default function LoginPage() {
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

        <LoginForm />
      </div>
    </div>
  );
}
