"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";

interface CurrencyInputProps {
  value: number;
  onChange: (cents: number) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function CurrencyInput({
  value,
  onChange,
  disabled,
  placeholder = "R$ 0,00",
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("");

  React.useEffect(() => {
    if (value === 0 && !displayValue) {
      setDisplayValue("");
    } else if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, [value, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo exceto dígitos
    const rawValue = e.target.value.replace(/\D/g, "");
    const cents = parseInt(rawValue || "0", 10);

    onChange(cents);

    // Atualiza display formatado
    if (cents === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(formatCurrency(cents));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Seleciona todo o texto ao focar
    e.target.select();
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      disabled={disabled}
      placeholder={placeholder}
      className="text-right font-mono"
    />
  );
}
