import { z } from "zod";

/**
 * Frequências de recorrência
 */
export const recurrenceFrequencyEnum = z.enum([
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);

export type RecurrenceFrequency = z.infer<typeof recurrenceFrequencyEnum>;

/**
 * Schema para criar transação recorrente
 */
export const createRecurringTransactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], {
      message: "Tipo inválido",
    }),
    amountCents: z
      .number({ message: "Valor é obrigatório" })
      .int({ message: "Valor deve ser um número inteiro" })
      .positive({ message: "Valor deve ser positivo" }),
    description: z
      .string({ message: "Descrição é obrigatória" })
      .min(1, "Descrição é obrigatória")
      .max(255, "Descrição muito longa"),
    categoryId: z.string().uuid({ message: "Categoria inválida" }),
    frequency: recurrenceFrequencyEnum,
    startDate: z.coerce.date({ message: "Data de início inválida" }),
    endDate: z.coerce.date({ message: "Data de fim inválida" }).optional(),
    dayOfMonth: z
      .number()
      .int()
      .min(1, "Dia do mês deve ser entre 1 e 31")
      .max(31, "Dia do mês deve ser entre 1 e 31")
      .optional(),
    dayOfWeek: z
      .number()
      .int()
      .min(0, "Dia da semana deve ser entre 0 e 6")
      .max(6, "Dia da semana deve ser entre 0 e 6")
      .optional(),
    notes: z.string().max(1000, "Notas muito longas").optional(),
  })
  .refine(
    (data) => {
      // Se frequência é mensal, dayOfMonth é obrigatório
      if (data.frequency === "MONTHLY" && !data.dayOfMonth) {
        return false;
      }
      // Se frequência é semanal, dayOfWeek é obrigatório
      if (data.frequency === "WEEKLY" && data.dayOfWeek === undefined) {
        return false;
      }
      return true;
    },
    {
      message: "Configuração de recorrência inválida",
      path: ["frequency"],
    }
  )
  .refine(
    (data) => {
      // Se endDate existe, deve ser maior que startDate
      if (data.endDate && data.endDate <= data.startDate) {
        return false;
      }
      return true;
    },
    {
      message: "Data de fim deve ser posterior à data de início",
      path: ["endDate"],
    }
  );

/**
 * Schema para formulário (sem coerce)
 */
export const createRecurringTransactionFormSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo inválido",
  }),
  amountCents: z
    .number({ message: "Valor é obrigatório" })
    .int({ message: "Valor deve ser um número inteiro" })
    .positive({ message: "Valor deve ser positivo" }),
  description: z
    .string({ message: "Descrição é obrigatória" })
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição muito longa"),
  categoryId: z.string().uuid({ message: "Categoria inválida" }),
  frequency: recurrenceFrequencyEnum,
  startDate: z.date({ message: "Data de início inválida" }),
  endDate: z.date({ message: "Data de fim inválida" }).optional(),
  dayOfMonth: z
    .number()
    .int()
    .min(1, "Dia do mês deve ser entre 1 e 31")
    .max(31, "Dia do mês deve ser entre 1 e 31")
    .optional(),
  dayOfWeek: z
    .number()
    .int()
    .min(0, "Dia da semana deve ser entre 0 e 6")
    .max(6, "Dia da semana deve ser entre 0 e 6")
    .optional(),
  notes: z.string().max(1000, "Notas muito longas").optional(),
});

/**
 * Schema para atualizar transação recorrente
 */
export const updateRecurringTransactionSchema = createRecurringTransactionSchema
  .partial()
  .extend({
    isActive: z.boolean().optional(),
  });

/**
 * Types
 */
export type CreateRecurringTransactionInput = z.infer<
  typeof createRecurringTransactionSchema
>;
export type CreateRecurringTransactionFormInput = z.infer<
  typeof createRecurringTransactionFormSchema
>;
export type UpdateRecurringTransactionInput = z.infer<
  typeof updateRecurringTransactionSchema
>;
