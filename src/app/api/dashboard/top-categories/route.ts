import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Buscar transações do mês atual agrupadas por categoria
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });

    // Calcular total geral de despesas para percentuais
    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amountCents, 0);

    // Agrupar por categoria e tipo
    const categoryMap = new Map<
      string,
      {
        id: string;
        name: string;
        color: string;
        icon: string;
        type: "INCOME" | "EXPENSE";
        total: number;
        transactionCount: number;
      }
    >();

    transactions.forEach((transaction) => {
      const key = transaction.categoryId;
      const existing = categoryMap.get(key);

      if (existing) {
        existing.total += transaction.amountCents;
        existing.transactionCount += 1;
      } else {
        categoryMap.set(key, {
          id: transaction.category.id,
          name: transaction.category.name,
          color: transaction.category.color,
          icon: transaction.category.icon || "",
          type: transaction.type,
          total: transaction.amountCents,
          transactionCount: 1,
        });
      }
    });

    // Converter para array e separar por tipo
    const categories = Array.from(categoryMap.values());

    const expenseCategories = categories
      .filter((c) => c.type === "EXPENSE")
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((c) => ({
        ...c,
        percentage: totalExpense > 0 ? (c.total / totalExpense) * 100 : 0,
      }));

    const incomeCategories = categories
      .filter((c) => c.type === "INCOME")
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map((c) => ({
        ...c,
        percentage: totalIncome > 0 ? (c.total / totalIncome) * 100 : 0,
      }));

    return NextResponse.json(
      {
        expense: expenseCategories,
        income: incomeCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TOP_CATEGORIES_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias principais" },
      { status: 500 }
    );
  }
}
