import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility para combinar classes CSS com Tailwind
 * Usa clsx para condicionais e twMerge para resolver conflitos do Tailwind
 * 
 * NOTA: Formatters movidos para @/lib/formatters
 * Referência: ARCHITECTURAL-REFACTORING-PLAN.md - Fase 1.3
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
