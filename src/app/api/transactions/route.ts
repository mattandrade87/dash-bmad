import { NextResponse } from "next/server";
import { requireAuth } from "@/lib";
import { TransactionRepository } from "@/lib";
import {
  createTransactionSchema,
  transactionFiltersSchema,
} from "@/lib/validations/transaction";
import { invalidateDashboardCache } from "@/lib/cache";
import { z } from "zod";

/**
 * GET /api/transactions
 * Lista transações do usuário com filtros e paginação
 */
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    // Parse and validate filters
    const filters = transactionFiltersSchema.parse({
      type: searchParams.get("type") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      orderBy: searchParams.get("orderBy") || undefined,
      order: searchParams.get("order") || undefined,
    });

    const result = await TransactionRepository.findMany(
      user.id as string,
      filters
    );

    return NextResponse.json({
      success: true,
      data: result.transactions,
      pagination: {
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("[TRANSACTIONS_GET_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Filtros inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Cria nova transação
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = createTransactionSchema.parse(body);

    // Verify category belongs to user
    const categoryBelongsToUser =
      await TransactionRepository.verifyCategoryOwnership(
        validatedData.categoryId,
        user.id as string
      );

    if (!categoryBelongsToUser) {
      return NextResponse.json(
        { error: "Categoria não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Create transaction
    const transaction = await TransactionRepository.create({
      userId: user.id as string,
      type: validatedData.type,
      amountCents: validatedData.amountCents,
      description: validatedData.description,
      categoryId: validatedData.categoryId,
      date: validatedData.date,
    });

    // Invalidate dashboard cache
    await invalidateDashboardCache(user.id as string);

    return NextResponse.json(
      {
        success: true,
        data: transaction,
        message: "Transação criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TRANSACTION_CREATE_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
