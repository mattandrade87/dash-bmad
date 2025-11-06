"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/formatters";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    payload: {
      month: string;
    };
  }>;
}

// Customizar tooltip
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-semibold mb-2">{payload[0].payload.month}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency((entry.value || 0) * 100)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Gráfico de evolução mensal de receitas, despesas e saldo
 */
export function MonthlyChart({ data }: MonthlyChartProps) {
  // Transformar dados para o formato do gráfico
  const chartData = data.map((item) => {
    const date = parse(item.month, "yyyy-MM", new Date());
    const monthLabel = format(date, "MMM/yy", { locale: ptBR });

    return {
      month: monthLabel,
      receitas: item.income / 100, // Converter centavos para reais
      despesas: item.expense / 100,
      saldo: item.balance / 100,
    };
  });

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Evolução Mensal</h3>
        <p className="text-sm text-muted-foreground">
          Receitas, despesas e saldo ao longo do tempo
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Line
            type="monotone"
            dataKey="receitas"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={2}
            dot={{ fill: "hsl(142, 76%, 36%)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Receitas"
          />
          <Line
            type="monotone"
            dataKey="despesas"
            stroke="hsl(0, 84%, 60%)"
            strokeWidth={2}
            dot={{ fill: "hsl(0, 84%, 60%)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Despesas"
          />
          <Line
            type="monotone"
            dataKey="saldo"
            stroke="hsl(221, 83%, 53%)"
            strokeWidth={2}
            dot={{ fill: "hsl(221, 83%, 53%)", r: 4 }}
            activeDot={{ r: 6 }}
            name="Saldo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
