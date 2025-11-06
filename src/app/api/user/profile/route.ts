import { NextResponse } from "next/server";
import { updateProfileSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib";
import { requireAuth } from "@/lib";
import { z } from "zod";

export async function PATCH(request: Request) {
  try {
    // Verificar autenticação
    const user = await requireAuth();

    const body = await request.json();

    // Validar dados com Zod
    const validatedData = updateProfileSchema.parse(body);

    // Verificar se o novo email já está em uso por outro usuário
    if (validatedData.email && validatedData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização (apenas campos preenchidos)
    const updateData: {
      name?: string;
      email?: string;
      image?: string | null;
    } = {};

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.email !== undefined) {
      updateData.email = validatedData.email;
    }
    if (validatedData.image !== undefined) {
      updateData.image = validatedData.image || null;
    }

    // Atualizar usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: user.id as string },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        message: "Perfil atualizado com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);

    // Erros de validação Zod
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

    // Erro de autenticação
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Outros erros
    return NextResponse.json(
      { error: "Erro ao atualizar perfil. Tente novamente." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verificar autenticação
    const user = await requireAuth();

    // Buscar dados atualizados do usuário
    const userData = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}
