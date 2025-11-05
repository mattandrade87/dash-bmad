import { z } from "zod";

/**
 * Enum de categorias de metas
 */
export enum GoalCategory {
  SAVINGS = "SAVINGS",
  EMERGENCY = "EMERGENCY",
  INVESTMENT = "INVESTMENT",
  PURCHASE = "PURCHASE",
  DEBT = "DEBT",
  VACATION = "VACATION",
  EDUCATION = "EDUCATION",
  OTHER = "OTHER",
}

/**
 * Configurações das categorias de metas
 */
export const GOAL_CATEGORIES = {
  SAVINGS: { icon: "💰", color: "#10B981", label: "Economia" },
  EMERGENCY: { icon: "🚨", color: "#EF4444", label: "Emergência" },
  INVESTMENT: { icon: "📈", color: "#3B82F6", label: "Investimento" },
  PURCHASE: { icon: "🛒", color: "#F59E0B", label: "Compra" },
  DEBT: { icon: "💳", color: "#DC2626", label: "Dívida" },
  VACATION: { icon: "✈️", color: "#8B5CF6", label: "Viagem" },
  EDUCATION: { icon: "📚", color: "#06B6D4", label: "Educação" },
  OTHER: { icon: "🎯", color: "#6B7280", label: "Outros" },
} as const;

/**
 * Schema para criar meta
 */
export const createGoalSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo (máximo 100 caracteres)"),
  description: z
    .string()
    .max(500, "Descrição muito longa (máximo 500 caracteres)")
    .optional()
    .nullable(),
  targetAmount: z
    .number()
    .int("Valor deve ser um número inteiro (em centavos)")
    .min(100, "Valor mínimo é R$ 1,00")
    .positive("Valor deve ser positivo"),
  category: z.nativeEnum(GoalCategory, {
    message: "Categoria inválida",
  }),
  deadline: z.coerce
    .date({
      message: "Data inválida",
    })
    .refine((date) => date > new Date(), "Prazo deve ser uma data futura")
    .optional()
    .nullable(),
});

/**
 * Schema para atualizar meta
 */
export const updateGoalSchema = createGoalSchema
  .partial()
  .extend({
    currentAmount: z
      .number()
      .int()
      .min(0, "Valor atual não pode ser negativo")
      .optional(),
    isCompleted: z.boolean().optional(),
    completedAt: z.coerce.date().optional().nullable(),
  })
  .refine(
    () => {
      // Validação de currentAmount vs targetAmount será feita no servidor
      return true;
    },
    { message: "Dados de meta inválidos" }
  );

/**
 * Schema para contribuir para uma meta
 */
export const contributeGoalSchema = z.object({
  amount: z
    .number()
    .int("Valor deve ser um número inteiro (em centavos)")
    .positive("Valor deve ser positivo"),
  note: z
    .string()
    .max(255, "Nota muito longa (máximo 255 caracteres)")
    .optional()
    .nullable(),
});

/**
 * Schema para filtros de busca de metas
 */
export const goalsFiltersSchema = z.object({
  status: z.enum(["active", "completed", "all"]).optional().default("active"),
  category: z.nativeEnum(GoalCategory).optional(),
  orderBy: z
    .enum(["progress", "deadline", "targetAmount", "createdAt"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

/**
 * TypeScript types
 */
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ContributeGoalInput = z.infer<typeof contributeGoalSchema>;
export type GoalsFilters = z.infer<typeof goalsFiltersSchema>;

/**
 * Helper para calcular progresso
 */
export function calculateProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount === 0) return 0;
  return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
}

/**
 * Helper para obter cor do progresso
 */
export function getProgressColor(progress: number): string {
  if (progress >= 75) return "#10B981"; // Verde
  if (progress >= 50) return "#F59E0B"; // Amarelo
  if (progress >= 25) return "#F97316"; // Laranja
  return "#EF4444"; // Vermelho
}

/**
 * Helper para obter mensagem de status do progresso
 */
export function getProgressMessage(progress: number): string {
  if (progress >= 75) return "Excelente progresso!";
  if (progress >= 50) return "No caminho certo";
  if (progress >= 25) return "Continue contribuindo";
  return "Precisa de atenção";
}
