import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateRecurringTransactionSchema } from "@/lib/validations/recurring-transaction";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/recurring-transactions/[id]
 * Atualiza transação recorrente (incluindo ativar/desativar)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se existe e pertence ao usuário
    const existing = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transação recorrente não encontrada" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = updateRecurringTransactionSchema.parse(body);

    // Atualizar
    const updated = await prisma.recurringTransaction.update({
      where: {
        id: params.id,
      },
      data: validatedData,
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Erro ao atualizar transação recorrente:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar transação recorrente" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/recurring-transactions/[id]
 * Deleta transação recorrente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se existe e pertence ao usuário
    const existing = await prisma.recurringTransaction.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transação recorrente não encontrada" },
        { status: 404 }
      );
    }

    // Deletar
    await prisma.recurringTransaction.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar transação recorrente:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transação recorrente" },
      { status: 500 }
    );
  }
}
