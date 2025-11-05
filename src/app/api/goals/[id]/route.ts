import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateGoalSchema, calculateProgress } from "@/lib/validations/goal";
import { z } from "zod";

// GET /api/goals/[id] - Buscar meta específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const goalId = params.id;

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

    const targetAmount = goal.targetAmount || 0;
    const currentAmount = goal.currentAmount || 0;

    return NextResponse.json({
      success: true,
      data: {
        ...goal,
        progress: calculateProgress(currentAmount, targetAmount),
        remaining: targetAmount - currentAmount,
      },
    });
  } catch (error) {
    console.error("[GOAL_GET]", error);
    return NextResponse.json({ error: "Erro ao buscar meta" }, { status: 500 });
  }
}

// PATCH /api/goals/[id] - Atualizar meta
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const goalId = params.id;
    const body = await request.json();

    // Verificar se meta existe e pertence ao usuário
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Meta não encontrada" },
        { status: 404 }
      );
    }

    // Validar dados
    const validatedData = updateGoalSchema.parse(body);

    // Preparar dados para atualização
    const updateData: {
      name?: string;
      description?: string | null;
      targetAmount?: number;
      category?: import("@prisma/client").GoalCategory;
      deadline?: Date | null;
      isCompleted?: boolean;
      completedAt?: Date | null;
      currentAmount?: number;
    } = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.targetAmount !== undefined)
      updateData.targetAmount = validatedData.targetAmount;
    if (validatedData.category !== undefined)
      updateData.category =
        validatedData.category as import("@prisma/client").GoalCategory;
    if (validatedData.deadline !== undefined)
      updateData.deadline = validatedData.deadline;
    if (validatedData.isCompleted !== undefined) {
      updateData.isCompleted = validatedData.isCompleted;
      if (validatedData.isCompleted && !existingGoal.isCompleted) {
        updateData.completedAt = new Date();
      }
    }

    // Atualizar meta
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
    });

    const targetAmount = goal.targetAmount || 0;
    const currentAmount = goal.currentAmount || 0;

    return NextResponse.json({
      success: true,
      data: {
        ...goal,
        progress: calculateProgress(currentAmount, targetAmount),
        remaining: targetAmount - currentAmount,
      },
    });
  } catch (error) {
    console.error("[GOAL_PATCH]", error);

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao atualizar meta" },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Deletar meta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const goalId = params.id;

    // Verificar se meta existe e pertence ao usuário
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Meta não encontrada" },
        { status: 404 }
      );
    }

    // Deletar meta
    await prisma.goal.delete({
      where: { id: goalId },
    });

    return NextResponse.json({
      success: true,
      message: "Meta deletada com sucesso",
    });
  } catch (error) {
    console.error("[GOAL_DELETE]", error);
    return NextResponse.json(
      { error: "Erro ao deletar meta" },
      { status: 500 }
    );
  }
}
