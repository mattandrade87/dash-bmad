import { NextResponse } from "next/server";
import { changePasswordSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib";
import { requireAuth } from "@/lib";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function PATCH(request: Request) {
  try {
    // Verificar autenticação
    const user = await requireAuth();

    const body = await request.json();

    // Validar dados com Zod
    const validatedData = changePasswordSchema.parse(body);

    // Buscar usuário completo do banco de dados
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id as string },
      select: {
        id: true,
        password: true,
      },
    });

    if (!dbUser || !dbUser.password) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      dbUser.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Senha atual incorreta" },
        { status: 400 }
      );
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      dbUser.password
    );

    if (isSamePassword) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da senha atual" },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    // Atualizar senha no banco de dados
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Senha alterada com sucesso",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PASSWORD_CHANGE_ERROR]", error);

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
      { error: "Erro ao alterar senha. Tente novamente." },
      { status: 500 }
    );
  }
}
