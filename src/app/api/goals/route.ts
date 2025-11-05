import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createGoalSchema,
  goalsFiltersSchema,
  calculateProgress,
} from "@/lib/validations/goal";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

// GET /api/goals - Listar metas do usuário
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Validar filtros
    const filters = goalsFiltersSchema.parse({
      status: searchParams.get("status") || "active",
      category: searchParams.get("category") || undefined,
      orderBy: searchParams.get("orderBy") || "createdAt",
      order: searchParams.get("order") || "desc",
    });

    // Construir where clause
    const where: Prisma.GoalWhereInput = {
      userId,
    };

    if (filters.status === "active") {
      where.isCompleted = false;
    } else if (filters.status === "completed") {
      where.isCompleted = true;
    }
    // "all" não adiciona filtro

    if (filters.category) {
      where.category = filters.category;
    }

    // Buscar metas
    const goals = await prisma.goal.findMany({
      where,
      orderBy: {
        [filters.orderBy]: filters.order,
      },
    });

    // Adicionar progresso calculado a cada meta
    const goalsWithProgress = goals.map((goal) => {
      const targetAmount = goal.targetAmount || 0;
      const currentAmount = goal.currentAmount || 0;

      return {
        ...goal,
        progress: calculateProgress(currentAmount, targetAmount),
        remaining: targetAmount - currentAmount,
      };
    });

    return NextResponse.json({
      success: true,
      data: goalsWithProgress,
    });
  } catch (error) {
    console.error("[GOALS_GET]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Filtros inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao buscar metas" },
      { status: 500 }
    );
  }
}

// POST /api/goals - Criar nova meta
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validar dados
    const validatedData = createGoalSchema.parse(body);

    // Criar meta
    const goal = await prisma.goal.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        targetAmount: validatedData.targetAmount,
        category: validatedData.category,
        deadline: validatedData.deadline,
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...goal,
          progress: 0,
          remaining: validatedData.targetAmount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[GOALS_POST]", error);

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 });
  }
}
