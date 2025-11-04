import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatDateTime } from "../utils";

describe("Utils - formatCurrency", () => {
  it("deve formatar centavos para BRL corretamente", () => {
    expect(formatCurrency(100)).toBe("R$ 1,00");
    expect(formatCurrency(123456)).toBe("R$ 1.234,56");
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("deve lidar com valores negativos", () => {
    expect(formatCurrency(-100)).toBe("-R$ 1,00");
    expect(formatCurrency(-123456)).toBe("-R$ 1.234,56");
  });

  it("deve lidar com valores grandes", () => {
    expect(formatCurrency(100000000)).toBe("R$ 1.000.000,00");
  });
});

describe("Utils - formatDate", () => {
  it("deve formatar data para padrão brasileiro", () => {
    const date = new Date("2025-11-04T12:00:00");
    const formatted = formatDate(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("deve aceitar string como entrada", () => {
    const formatted = formatDate("2025-11-04");
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("Utils - formatDateTime", () => {
  it("deve formatar data e hora", () => {
    const date = new Date("2025-11-04T14:30:00");
    const formatted = formatDateTime(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatted).toContain(":");
  });
});
