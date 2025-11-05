"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  GOAL_CATEGORIES,
  calculateProgress,
  getProgressColor,
} from "@/lib/validations/goal";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, Target, Clock, DollarSign } from "lucide-react";

interface Contribution {
  id: string;
  amount: number;
  note?: string | null;
  createdAt: Date | string;
}

interface Goal {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | null;
  isCompleted: boolean;
  completedAt?: Date | null;
  createdAt: Date | string;
}

interface GoalDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
}

async function fetchContributions(goalId: string): Promise<Contribution[]> {
  const response = await fetch(`/api/goals/${goalId}/contributions`);
  if (!response.ok) {
    throw new Error("Erro ao buscar contribuições");
  }
  const data = await response.json();
  return data.data;
}

export function GoalDetailsModal({
  open,
  onOpenChange,
  goal,
}: GoalDetailsModalProps) {
  const { data: contributions, isLoading } = useQuery({
    queryKey: ["goal-contributions", goal?.id],
    queryFn: () => fetchContributions(goal!.id),
    enabled: !!goal && open,
  });

  if (!goal) return null;

  const categoryConfig =
    GOAL_CATEGORIES[goal.category as keyof typeof GOAL_CATEGORIES];
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const progressColor = getProgressColor(progress);

  // Calcular estatísticas
  const monthsSinceCreation = differenceInMonths(
    new Date(),
    new Date(goal.createdAt)
  );
  const effectiveMonths = Math.max(monthsSinceCreation, 1);
  const averagePerMonth = goal.currentAmount / effectiveMonths;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const monthsToComplete =
    remaining > 0 && averagePerMonth > 0
      ? Math.ceil(remaining / averagePerMonth)
      : 0;

  const daysUntilDeadline = goal.deadline
    ? differenceInDays(new Date(goal.deadline), new Date())
    : null;

  const requiredPerMonth =
    goal.deadline && daysUntilDeadline && daysUntilDeadline > 0
      ? Math.ceil((remaining / daysUntilDeadline) * 30)
      : null;

  // Preparar dados do gráfico
  const chartData = contributions
    ? (() => {
        const sorted = [...contributions].reverse();
        let accumulated = 0;
        return sorted.map((contrib) => {
          accumulated += contrib.amount;
          return {
            date: format(new Date(contrib.createdAt), "dd/MM", {
              locale: ptBR,
            }),
            fullDate: format(new Date(contrib.createdAt), "dd/MM/yyyy", {
              locale: ptBR,
            }),
            value: accumulated,
            formatted: formatCurrency(accumulated),
          };
        });
      })()
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
              style={{ backgroundColor: `${categoryConfig.color}30` }}
            >
              {categoryConfig.icon}
            </div>
            <div>
              <span>{goal.name}</span>
              <p className="text-sm font-normal text-muted-foreground">
                {categoryConfig.label}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Progresso */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
              <p
                className="text-2xl font-bold"
                style={{ color: progressColor }}
              >
                {progress}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(goal.currentAmount)} de{" "}
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>

            {/* Média Mensal */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Média/Mês</span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(averagePerMonth)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos {effectiveMonths}{" "}
                {effectiveMonths === 1 ? "mês" : "meses"}
              </p>
            </div>

            {/* Projeção */}
            {!goal.isCompleted && monthsToComplete > 0 && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Projeção
                  </span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">
                  {monthsToComplete} {monthsToComplete === 1 ? "mês" : "meses"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  No ritmo atual
                </p>
              </div>
            )}

            {/* Necessário por Mês (se tiver deadline) */}
            {!goal.isCompleted &&
              requiredPerMonth &&
              daysUntilDeadline &&
              daysUntilDeadline > 0 && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Necessário
                    </span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(requiredPerMonth)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por mês até o prazo
                  </p>
                </div>
              )}

            {/* Deadline */}
            {goal.deadline && (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Prazo</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">
                  {daysUntilDeadline !== null && daysUntilDeadline >= 0
                    ? `${daysUntilDeadline}d`
                    : "Vencido"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(goal.deadline), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Gráfico de Progresso */}
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : chartData.length > 0 ? (
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução do Progresso
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-medium">
                              {data.fullDate}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {data.formatted}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={progressColor}
                    strokeWidth={2}
                    dot={{ fill: progressColor, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma contribuição registrada ainda</p>
            </div>
          )}

          {/* Lista de Contribuições */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Histórico de Contribuições</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : contributions && contributions.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {contributions.slice(0, 10).map((contrib) => (
                  <div
                    key={contrib.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${progressColor}20` }}
                      >
                        <TrendingUp
                          className="h-5 w-5"
                          style={{ color: progressColor }}
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {formatCurrency(contrib.amount)}
                        </p>
                        {contrib.note && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {contrib.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(contrib.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma contribuição ainda
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
