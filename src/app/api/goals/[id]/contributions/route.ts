import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const goalId = params.id;

    // Verificar se a meta pertence ao usuário
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Meta não encontrada" },
        { status: 404 }
      );
    }

    // Buscar contribuições ordenadas por data (mais recentes primeiro)
    const contributions = await prisma.contribution.findMany({
      where: {
        goalId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limitar a 50 contribuições mais recentes
    });

    return NextResponse.json({
      success: true,
      data: contributions,
    });
  } catch (error) {
    console.error("[GOAL_CONTRIBUTIONS_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de contribuições" },
      { status: 500 }
    );
  }
}
