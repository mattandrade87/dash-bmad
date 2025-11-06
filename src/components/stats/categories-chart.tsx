"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface CategoryData {
  name: string;
  total: number;
  color: string;
}

interface CategoriesChartProps {
  data: CategoryData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    value: number;
    payload: {
      name: string;
    };
  }>;
}

// Customizar tooltip
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-semibold mb-1">{payload[0].payload.name}</p>
        <p className="text-sm" style={{ color: payload[0].color }}>
          Total: {formatCurrency(payload[0].value || 0)}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Gráfico de barras com top 5 categorias por despesas
 */
export function CategoriesChart({ data }: CategoriesChartProps) {
  // Transformar dados para o formato do gráfico
  const chartData = data.map((item) => ({
    name: item.name,
    total: item.total / 100, // Converter centavos para reais
    fill: item.color,
  }));

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Top 5 Categorias</h3>
        <p className="text-sm text-muted-foreground">
          Maiores despesas por categoria
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <p>Nenhuma despesa registrada</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
