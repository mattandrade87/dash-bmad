import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth-helpers";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar dados
    const validatedData = registerSchema.parse(body);

    // Criar usuário
    const user = await createUser(validatedData);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Dados inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar usuário",
      },
      { status: 500 }
    );
  }
}
