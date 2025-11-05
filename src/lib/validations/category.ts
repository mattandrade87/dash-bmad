import { z } from "zod";

/**
 * Schema de validação para criação de categoria
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo deve ser INCOME ou EXPENSE",
  }),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar em formato hex (#RRGGBB)"),
  icon: z.string().emoji("Ícone deve ser um emoji válido").optional(),
});

/**
 * Schema de validação para atualização de categoria
 */
export const updateCategorySchema = createCategorySchema.partial().refine(
  () => {
    // Se atualizar type, precisa verificar no server-side se há transações
    return true;
  },
  { message: "Não é possível alterar o tipo de uma categoria" }
);

/**
 * Cores predefinidas para facilitar seleção
 */
export const PRESET_COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EF4444", // red
  "#F59E0B", // amber
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
  "#06B6D4", // cyan
  "#6B7280", // gray
];

/**
 * Ícones (emojis) predefinidos por tipo
 */
export const PRESET_ICONS = {
  INCOME: ["💰", "💼", "📈", "💵", "🏆", "💎", "🎁", "📊"],
  EXPENSE: ["🍔", "🚗", "🏠", "🏥", "📚", "🎮", "🛍️", "📱", "✈️", "💳"],
} as const;
