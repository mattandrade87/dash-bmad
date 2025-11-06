import { NextResponse } from "next/server";
import { signupSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Categorias padrão que serão criadas para cada novo usuário
const DEFAULT_CATEGORIES = [
  { name: "Salário", type: "INCOME" as const, color: "#10B981", icon: "💰" },
  { name: "Freelance", type: "INCOME" as const, color: "#3B82F6", icon: "💼" },
  {
    name: "Investimentos",
    type: "INCOME" as const,
    color: "#8B5CF6",
    icon: "📈",
  },
  {
    name: "Outras Receitas",
    type: "INCOME" as const,
    color: "#6B7280",
    icon: "💵",
  },
  {
    name: "Alimentação",
    type: "EXPENSE" as const,
    color: "#EF4444",
    icon: "🍔",
  },
  {
    name: "Transporte",
    type: "EXPENSE" as const,
    color: "#F59E0B",
    icon: "🚗",
  },
  { name: "Moradia", type: "EXPENSE" as const, color: "#EC4899", icon: "🏠" },
  { name: "Saúde", type: "EXPENSE" as const, color: "#14B8A6", icon: "🏥" },
  { name: "Educação", type: "EXPENSE" as const, color: "#8B5CF6", icon: "📚" },
  { name: "Lazer", type: "EXPENSE" as const, color: "#F97316", icon: "🎮" },
  { name: "Compras", type: "EXPENSE" as const, color: "#06B6D4", icon: "🛍️" },
  {
    name: "Assinaturas",
    type: "EXPENSE" as const,
    color: "#A855F7",
    icon: "📱",
  },
  {
    name: "Outras Despesas",
    type: "EXPENSE" as const,
    color: "#6B7280",
    icon: "💳",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /**
     * FIX: Console.logs removidos de produção
     * Debug logs devem existir apenas em desenvolvimento
     * Removido para evitar poluição do console e vazamento de dados sensíveis
     */
    if (process.env.NODE_ENV === "development") {
      console.log("📝 Dados recebidos:", {
        name: body.name,
        email: body.email,
        hasPassword: !!body.password,
        hasConfirmPassword: !!body.confirmPassword,
      });
    }

    // Validar dados com Zod
    const validatedData = signupSchema.parse({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Criar usuário com categorias padrão
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: DEFAULT_CATEGORIES,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "Conta criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);

    // Erros de validação Zod
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      
      return NextResponse.json(
        {
          error: firstError.message,
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Erros do Prisma (ex: constraint violation)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Este email já está cadastrado" },
          { status: 400 }
        );
      }
    }

    // Outros erros
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
