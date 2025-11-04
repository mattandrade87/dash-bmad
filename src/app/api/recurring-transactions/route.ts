import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRecurringTransactionSchema } from "@/lib/validations/recurring-transaction";

export const dynamic = "force-dynamic";

/**
 * GET /api/recurring-transactions
 * Lista transações recorrentes do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get("isActive");

    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        userId: session.user.id,
        ...(isActive !== null && { isActive: isActive === "true" }),
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: recurringTransactions });
  } catch (error) {
    console.error("Erro ao buscar transações recorrentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações recorrentes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/recurring-transactions
 * Cria nova transação recorrente
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createRecurringTransactionSchema.parse(body);

    // Verificar se categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: validatedData.categoryId,
        OR: [{ userId: session.user.id }, { isDefault: true }],
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Criar transação recorrente
    const recurringTransaction = await prisma.recurringTransaction.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({ data: recurringTransaction }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação recorrente:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar transação recorrente" },
      { status: 500 }
    );
  }
}
