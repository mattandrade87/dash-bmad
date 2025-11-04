import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata valor em centavos para moeda brasileira (BRL)
 * @param cents - Valor em centavos
 * @returns String formatada como moeda (ex: "R$ 1.234,56")
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/**
 * Formata data para o padrão brasileiro
 * @param date - Data a ser formatada
 * @returns String formatada (ex: "31/12/2025")
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR").format(d);
}

/**
 * Formata data com horário
 * @param date - Data a ser formatada
 * @returns String formatada (ex: "31/12/2025 às 14:30")
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}
