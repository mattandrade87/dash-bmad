import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // Período atual (mês atual)
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // Período anterior (mês anterior)
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Buscar transações do mês atual
    const currentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      select: {
        type: true,
        amountCents: true,
      },
    });

    // Buscar transações do mês anterior
    const previousTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      select: {
        type: true,
        amountCents: true,
      },
    });

    // Calcular totais do mês atual
    const currentIncome = currentTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const currentExpense = currentTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const currentBalance = currentIncome - currentExpense;
    const currentCount = currentTransactions.length;

    // Calcular totais do mês anterior
    const previousIncome = previousTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const previousExpense = previousTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amountCents, 0);

    const previousBalance = previousIncome - previousExpense;

    // Calcular variações percentuais
    const calculateVariation = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const variation = {
      income: calculateVariation(currentIncome, previousIncome),
      expense: calculateVariation(currentExpense, previousExpense),
      balance: calculateVariation(currentBalance, previousBalance),
    };

    // Buscar dados de metas
    const [totalGoals, activeGoals, goalsCompletedThisMonth] =
      await Promise.all([
        // Total de metas
        prisma.goal.count({
          where: { userId },
        }),
        // Metas ativas (não concluídas)
        prisma.goal.count({
          where: {
            userId,
            isCompleted: false,
          },
        }),
        // Metas concluídas este mês
        prisma.goal.count({
          where: {
            userId,
            isCompleted: true,
            completedAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        }),
      ]);

    // Calcular metas concluídas no mês anterior
    const goalsCompletedLastMonth = await prisma.goal.count({
      where: {
        userId,
        isCompleted: true,
        completedAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    });

    const goals = {
      total: totalGoals,
      active: activeGoals,
      completed: totalGoals - activeGoals,
      completedThisMonth: goalsCompletedThisMonth,
      variation: calculateVariation(
        goalsCompletedThisMonth,
        goalsCompletedLastMonth
      ),
    };

    return NextResponse.json(
      {
        currentMonth: {
          income: currentIncome,
          expense: currentExpense,
          balance: currentBalance,
          transactionCount: currentCount,
        },
        previousMonth: {
          income: previousIncome,
          expense: previousExpense,
          balance: previousBalance,
        },
        variation,
        goals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DASHBOARD_SUMMARY_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao buscar resumo do dashboard" },
      { status: 500 }
    );
  }
}
