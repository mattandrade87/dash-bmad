import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib";
import { createCategorySchema } from "@/lib/validations/category";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// GET /api/categories - Listar categorias do usuário
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "INCOME" | "EXPENSE" | null;

    // Buscar categorias com contagem de transações
    const categories = await prisma.category.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("[CATEGORIES_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Criar nova categoria
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validar dados
    const validatedData = createCategorySchema.parse(body);

    // Verificar se já existe categoria com mesmo nome para este usuário
    const existing = await prisma.category.findFirst({
      where: {
        userId,
        name: validatedData.name,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este nome" },
        { status: 400 }
      );
    }

    // Criar categoria
    const category = await prisma.category.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES_POST_ERROR]", error);

    // Erros de validação Zod
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    // Erros do Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Já existe uma categoria com este nome" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}
