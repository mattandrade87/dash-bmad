import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";
import { TransactionRepository } from "@/lib/repositories/transaction-repository";
import { updateTransactionSchema } from "@/lib/validations/transaction";
import { invalidateDashboardCache } from "@/lib/cache";
import { z } from "zod";

/**
 * GET /api/transactions/[id]
 * Busca transação específica
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const transaction = await TransactionRepository.findById(
      params.id,
      user.id as string
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error("[TRANSACTION_GET_ERROR]", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao buscar transação" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/transactions/[id]
 * Atualiza transação existente
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const validatedData = updateTransactionSchema.parse(body);

    // If categoryId is being updated, verify it belongs to user
    if (validatedData.categoryId) {
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
    }

    // Update transaction
    const transaction = await TransactionRepository.update(
      params.id,
      user.id as string,
      validatedData
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Invalidate dashboard cache
    await invalidateDashboardCache(user.id as string);

    return NextResponse.json({
      success: true,
      data: transaction,
      message: "Transação atualizada com sucesso",
    });
  } catch (error) {
    console.error("[TRANSACTION_UPDATE_ERROR]", error);

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
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/transactions/[id]
 * Deleta transação
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth();

    const transaction = await TransactionRepository.delete(
      params.id,
      user.id as string
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Invalidate dashboard cache
    await invalidateDashboardCache(user.id as string);

    return NextResponse.json({
      success: true,
      message: "Transação deletada com sucesso",
    });
  } catch (error) {
    console.error("[TRANSACTION_DELETE_ERROR]", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    );
  }
}
