import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib";
import {
  contributeGoalSchema,
  calculateProgress,
} from "@/lib/validations/goal";
import { z } from "zod";

// POST /api/goals/[id]/contribute - Contribuir para uma meta
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: goalId } = await params;
    const body = await request.json();

    // Validar dados
    const validatedData = contributeGoalSchema.parse(body);

    // Buscar meta
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

    if (goal.isCompleted) {
      return NextResponse.json(
        { error: "Não é possível contribuir para uma meta já concluída" },
        { status: 400 }
      );
    }

    const currentAmount = goal.currentAmount || 0;
    const targetAmount = goal.targetAmount || 0;
    const newCurrentAmount = currentAmount + validatedData.amount;
    const isNowCompleted = newCurrentAmount >= targetAmount;

    // Atualizar meta e criar registro de contribuição
    const [updatedGoal] = await Promise.all([
      prisma.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: newCurrentAmount,
          isCompleted: isNowCompleted,
          completedAt: isNowCompleted ? new Date() : null,
        },
      }),
      // Registrar contribuição no histórico
      prisma.contribution.create({
        data: {
          goalId,
          amount: validatedData.amount,
          note: validatedData.note,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedGoal,
        progress: calculateProgress(newCurrentAmount, targetAmount),
        remaining: Math.max(0, targetAmount - newCurrentAmount),
        justCompleted: isNowCompleted && !goal.isCompleted,
      },
      message: isNowCompleted
        ? "🎉 Parabéns! Meta concluída!"
        : "Contribuição adicionada com sucesso!",
    });
  } catch (error) {
    console.error("[GOAL_CONTRIBUTE]", error);

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao contribuir para meta" },
      { status: 500 }
    );
  }
}
