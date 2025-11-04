import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Rotas públicas (acessíveis sem autenticação)
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];

  // Rotas de autenticação (login/signup)
  const authRoutes = ["/login", "/signup"];

  // Verifica se é rota pública
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith("/api/auth");

  // Verifica se é rota de autenticação
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Se não está logado e tenta acessar rota protegida
  if (!isLoggedIn && !isPublicRoute) {
    // Salva a URL original para redirecionar após login
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Se está logado e tenta acessar rotas de autenticação (login/signup)
  // Redireciona para dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
