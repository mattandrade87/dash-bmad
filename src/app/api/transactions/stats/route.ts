import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const dynamic = "force-dynamic";

/**
 * GET /api/transactions/stats
 * Retorna estatísticas e dados para gráficos
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const months = parseInt(searchParams.get("months") || "6");

    // Calcular período (últimos N meses)
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(endDate, months - 1));

    // Buscar todas as transações do período
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calcular totais gerais
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const balance = totalIncome - totalExpense;

    // Agrupar por mês para gráfico de evolução
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((transaction) => {
      const monthKey = format(new Date(transaction.date), "yyyy-MM");

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === "INCOME") {
        monthlyData[monthKey].income += transaction.amountCents;
      } else {
        monthlyData[monthKey].expense += transaction.amountCents;
      }
    });

    // Converter para array ordenado
    const monthlyEvolution = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense,
      }));

    // Top 5 categorias por despesas
    const categoryExpenses: Record<
      string,
      { name: string; total: number; color: string }
    > = {};

    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((transaction) => {
        const categoryId = transaction.categoryId;

        if (!categoryExpenses[categoryId]) {
          categoryExpenses[categoryId] = {
            name: transaction.category.name,
            total: 0,
            color: transaction.category.color,
          };
        }

        categoryExpenses[categoryId].total += transaction.amountCents;
      });

    const topCategories = Object.values(categoryExpenses)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Estatísticas do mês atual vs mês anterior
    const currentMonth = format(new Date(), "yyyy-MM");
    const previousMonth = format(subMonths(new Date(), 1), "yyyy-MM");

    const currentMonthStats = monthlyData[currentMonth] || {
      income: 0,
      expense: 0,
    };
    const previousMonthStats = monthlyData[previousMonth] || {
      income: 0,
      expense: 0,
    };

    const incomeVariation =
      previousMonthStats.income > 0
        ? ((currentMonthStats.income - previousMonthStats.income) /
            previousMonthStats.income) *
          100
        : 0;

    const expenseVariation =
      previousMonthStats.expense > 0
        ? ((currentMonthStats.expense - previousMonthStats.expense) /
            previousMonthStats.expense) *
          100
        : 0;

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
        transactionCount: transactions.length,
      },
      monthlyEvolution,
      topCategories,
      variation: {
        income: incomeVariation,
        expense: expenseVariation,
      },
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        months,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
