"use client";

import * as React from "react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  dateRange?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  disabled?: boolean;
}

const presets = [
  {
    label: "Últimos 7 dias",
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "Último mês",
    getValue: () => ({ from: subMonths(new Date(), 1), to: new Date() }),
  },
  {
    label: "Últimos 3 meses",
    getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
  },
  {
    label: "Este mês",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
];

export function DateRangePicker({
  dateRange,
  onSelect,
  disabled,
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = React.useState<string>("");

  const handlePresetSelect = (value: string) => {
    setSelectedPreset(value);
    const preset = presets.find((p) => p.label === value);
    if (preset) {
      onSelect(preset.getValue());
    }
  };

  const handleCustomRange = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setSelectedPreset("Personalizado");
      onSelect({ from: range.from, to: range.to });
    }
  };

  const formatRange = () => {
    if (!dateRange) return "Selecione um período";
    return `${format(dateRange.from, "dd/MM/yyyy", {
      locale: ptBR,
    })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
  };

  return (
    <div className="space-y-2">
      <Select
        value={selectedPreset}
        onValueChange={handlePresetSelect}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um período" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.label} value={preset.label}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value="Personalizado">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {selectedPreset === "Personalizado" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleCustomRange}
              numberOfMonths={2}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      )}

      {dateRange && selectedPreset && selectedPreset !== "Personalizado" && (
        <div className="text-sm text-muted-foreground">{formatRange()}</div>
      )}
    </div>
  );
}
