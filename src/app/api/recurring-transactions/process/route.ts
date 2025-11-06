import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib";
import { getPendingOccurrences } from "@/lib/utils/recurring";
import { startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

/**
 * POST /api/recurring-transactions/process
 * Processa transações recorrentes pendentes
 *
 * Este endpoint deve ser chamado por um cron job diariamente
 * Verifica: CRON_SECRET para segurança
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar secret do cron (segurança)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const today = startOfDay(new Date());

    // Buscar transações recorrentes ativas
    const recurringTransactions = await prisma.recurringTransaction.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: today,
        },
        OR: [{ endDate: null }, { endDate: { gte: today } }],
      },
    });

    let processedCount = 0;
    const errors: string[] = [];

    // Processar cada transação recorrente
    for (const recurring of recurringTransactions) {
      try {
        const pendingDates = getPendingOccurrences({
          frequency: recurring.frequency as unknown as Parameters<
            typeof getPendingOccurrences
          >[0]["frequency"],
          startDate: recurring.startDate,
          endDate: recurring.endDate,
          dayOfMonth: recurring.dayOfMonth,
          dayOfWeek: recurring.dayOfWeek,
          lastProcessed: recurring.lastProcessed,
        });

        // Criar transações para datas pendentes
        for (const date of pendingDates) {
          await prisma.transaction.create({
            data: {
              description: recurring.description,
              amountCents: recurring.amountCents,
              type: recurring.type,
              date,
              categoryId: recurring.categoryId,
              userId: recurring.userId,
              notes: recurring.notes,
              recurringTransactionId: recurring.id,
            },
          });

          processedCount++;
        }

        // Atualizar lastProcessed
        if (pendingDates.length > 0) {
          await prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: {
              lastProcessed: pendingDates[pendingDates.length - 1],
            },
          });
        }
      } catch (error) {
        console.error(`Erro ao processar recorrente ${recurring.id}:`, error);
        errors.push(
          `ID ${recurring.id}: ${
            error instanceof Error ? error.message : "Erro desconhecido"
          }`
        );
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      totalRecurring: recurringTransactions.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Erro ao processar transações recorrentes:", error);
    return NextResponse.json(
      { error: "Erro ao processar transações recorrentes" },
      { status: 500 }
    );
  }
}
