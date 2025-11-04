import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/metrics";

/**
 * GET /api/dashboard/metrics
 * Retorna métricas do dashboard do usuário autenticado
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const metrics = await getDashboardMetrics(session.user.id);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Erro ao buscar métricas" },
      { status: 500 }
    );
  }
}
