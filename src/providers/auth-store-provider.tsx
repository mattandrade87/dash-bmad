"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Provider para sincronizar o estado de autenticação
 * entre NextAuth e Zustand
 */
export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
  }, [session, status, setUser, setLoading]);

  return <>{children}</>;
}
