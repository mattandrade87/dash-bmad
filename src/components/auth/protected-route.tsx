import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Componente para proteger rotas no lado do servidor
 * Redireciona para login se não estiver autenticado
 */
export async function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const session = await auth();

  if (!session?.user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
