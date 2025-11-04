import { z } from "zod";

// Schema para criar transação (API - coerce date)
export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo deve ser INCOME ou EXPENSE",
  }),
  amountCents: z.number().int().positive({
    message: "Valor deve ser um número inteiro positivo (em centavos)",
  }),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição muito longa"),
  categoryId: z.string().uuid("ID de categoria inválido"),
  date: z.coerce.date({
    message: "Data inválida",
  }),
});

// Schema para formulário client-side (date já é Date)
export const createTransactionFormSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "Tipo deve ser INCOME ou EXPENSE",
  }),
  amountCents: z.number().int().positive({
    message: "Valor deve ser um número inteiro positivo (em centavos)",
  }),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição muito longa"),
  categoryId: z.string().uuid("ID de categoria inválido"),
  date: z.date({
    message: "Data inválida",
  }),
});

// Schema para atualizar transação (campos opcionais)
export const updateTransactionSchema = createTransactionSchema.partial();

// Schema para filtros de busca
export const transactionFiltersSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  orderBy: z.enum(["date", "amountCents", "createdAt"]).default("date"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// TypeScript types
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateTransactionFormInput = z.infer<
  typeof createTransactionFormSchema
>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;
