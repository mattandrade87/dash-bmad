import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Buscar últimas transações
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    return NextResponse.json(
      {
        transactions,
        count: transactions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[RECENT_TRANSACTIONS_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao buscar transações recentes" },
      { status: 500 }
    );
  }
}
