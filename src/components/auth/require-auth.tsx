"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Componente para proteger rotas no lado do cliente
 * Redireciona para login se não estiver autenticado
 */
export function RequireAuth({
  children,
  redirectTo = "/login",
  loadingComponent = <div>Carregando...</div>,
}: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === "loading") {
    return <>{loadingComponent}</>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
