import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib";
import { updateCategorySchema } from "@/lib/validations/category";
import { z } from "zod";

// PATCH /api/categories/[id] - Atualizar categoria
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: categoryId } = await params;
    const body = await request.json();

    // Verificar se categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Validar dados
    const validatedData = updateCategorySchema.parse(body);

    // Se tentar alterar type e houver transações, bloquear
    if (validatedData.type && validatedData.type !== category.type) {
      if (category._count.transactions > 0) {
        return NextResponse.json(
          {
            error: `Não é possível alterar o tipo de uma categoria com ${category._count.transactions} transações vinculadas`,
          },
          { status: 400 }
        );
      }
    }

    // Se alterar nome, verificar duplicação
    if (validatedData.name && validatedData.name !== category.name) {
      const existing = await prisma.category.findFirst({
        where: {
          userId,
          name: validatedData.name,
          id: { not: categoryId },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Já existe uma categoria com este nome" },
          { status: 400 }
        );
      }
    }

    // Atualizar categoria
    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: validatedData,
    });

    return NextResponse.json(
      { success: true, category: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CATEGORY_PATCH_ERROR]", error);

    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Deletar categoria
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: categoryId } = await params;

    // Verificar se categoria existe e pertence ao usuário
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // BLOQUEIO: Não deletar se houver transações vinculadas
    if (category._count.transactions > 0) {
      return NextResponse.json(
        {
          error: `Não é possível deletar esta categoria pois ela possui ${category._count.transactions} transações vinculadas`,
          transactionCount: category._count.transactions,
          suggestion: "Reassocie as transações a outra categoria primeiro",
        },
        { status: 400 }
      );
    }

    // Deletar categoria
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { success: true, message: "Categoria deletada com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CATEGORY_DELETE_ERROR]", error);

    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    );
  }
}
