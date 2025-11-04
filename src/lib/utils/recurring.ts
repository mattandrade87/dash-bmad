import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfDay,
  isBefore,
  isAfter,
  isSameDay,
  setDate as setDayOfMonth,
  setDay,
} from "date-fns";

type RecurrenceFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface RecurringTransactionConfig {
  frequency: RecurrenceFrequency;
  startDate: Date;
  endDate?: Date | null;
  dayOfMonth?: number | null;
  dayOfWeek?: number | null;
  lastProcessed?: Date | null;
}

/**
 * Calcula a próxima data de ocorrência de uma transação recorrente
 */
export function getNextOccurrence(
  config: RecurringTransactionConfig
): Date | null {
  const {
    frequency,
    startDate,
    endDate,
    dayOfMonth,
    dayOfWeek,
    lastProcessed,
  } = config;

  // Data base para cálculo (última processada ou data de início)
  const baseDate = lastProcessed
    ? new Date(lastProcessed)
    : new Date(startDate);
  const today = startOfDay(new Date());

  let nextDate: Date;

  switch (frequency) {
    case "DAILY":
      nextDate = addDays(baseDate, 1);
      break;

    case "WEEKLY":
      if (dayOfWeek === null || dayOfWeek === undefined) {
        throw new Error("dayOfWeek é obrigatório para recorrência semanal");
      }
      nextDate = addWeeks(baseDate, 1);
      nextDate = setDay(nextDate, dayOfWeek);
      break;

    case "MONTHLY":
      if (!dayOfMonth) {
        throw new Error("dayOfMonth é obrigatório para recorrência mensal");
      }
      nextDate = addMonths(baseDate, 1);
      // Ajustar dia do mês (lidar com meses de diferentes tamanhos)
      try {
        nextDate = setDayOfMonth(nextDate, dayOfMonth);
      } catch {
        // Se o dia não existe no mês (ex: 31 em fevereiro), usar último dia do mês
        nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0);
      }
      break;

    case "YEARLY":
      nextDate = addYears(baseDate, 1);
      break;

    default:
      throw new Error(`Frequência inválida: ${frequency}`);
  }

  // Verificar se está dentro do período ativo
  if (isBefore(nextDate, startOfDay(startDate))) {
    return null;
  }

  if (endDate && isAfter(nextDate, startOfDay(endDate))) {
    return null;
  }

  // Não criar transação no futuro
  if (isAfter(nextDate, today)) {
    return null;
  }

  return nextDate;
}

/**
 * Obtém todas as datas pendentes de processamento
 */
export function getPendingOccurrences(
  config: RecurringTransactionConfig
): Date[] {
  const dates: Date[] = [];
  const currentConfig = { ...config };
  const maxIterations = 365; // Limite de segurança (1 ano de dias)
  let iterations = 0;

  while (iterations < maxIterations) {
    const nextDate = getNextOccurrence(currentConfig);

    if (!nextDate) {
      break;
    }

    dates.push(nextDate);
    currentConfig.lastProcessed = nextDate;
    iterations++;
  }

  return dates;
}

/**
 * Verifica se uma transação recorrente deve ser processada hoje
 */
export function shouldProcessToday(
  config: RecurringTransactionConfig
): boolean {
  const nextDate = getNextOccurrence(config);

  if (!nextDate) {
    return false;
  }

  const today = startOfDay(new Date());
  return isSameDay(nextDate, today);
}

/**
 * Formata a descrição da recorrência para exibição
 */
export function formatRecurrenceDescription(
  frequency: RecurrenceFrequency,
  dayOfMonth?: number | null,
  dayOfWeek?: number | null
): string {
  const weekDays = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  switch (frequency) {
    case "DAILY":
      return "Diariamente";

    case "WEEKLY":
      return dayOfWeek !== null && dayOfWeek !== undefined
        ? `Semanalmente (toda ${weekDays[dayOfWeek]})`
        : "Semanalmente";

    case "MONTHLY":
      return dayOfMonth ? `Mensalmente (dia ${dayOfMonth})` : "Mensalmente";

    case "YEARLY":
      return "Anualmente";

    default:
      return "Recorrente";
  }
}
