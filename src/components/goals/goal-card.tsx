"use client";

import { MoreVertical, Target, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GOAL_CATEGORIES,
  getProgressColor,
  getProgressMessage,
} from "@/lib/validations/goal";
import { formatCurrency } from "@/lib/formatters";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount: number;
    category: string;
    deadline?: Date | null;
    isCompleted: boolean;
    progress: number;
    remaining: number;
  };
  onEdit: (goal: GoalCardProps["goal"]) => void;
  onDelete: (id: string) => void;
  onContribute: (goal: GoalCardProps["goal"]) => void;
  onViewDetails: (goal: GoalCardProps["goal"]) => void;
}

export function GoalCard({
  goal,
  onEdit,
  onDelete,
  onContribute,
  onViewDetails,
}: GoalCardProps) {
  const categoryConfig =
    GOAL_CATEGORIES[goal.category as keyof typeof GOAL_CATEGORIES];
  const progressColor = getProgressColor(goal.progress);
  const progressMessage = getProgressMessage(goal.progress);

  const daysUntilDeadline = goal.deadline
    ? differenceInDays(new Date(goal.deadline), new Date())
    : null;

  const deadlineStatus =
    daysUntilDeadline !== null
      ? daysUntilDeadline < 0
        ? "vencido"
        : daysUntilDeadline <= 7
        ? "urgente"
        : daysUntilDeadline <= 30
        ? "próximo"
        : "normal"
      : null;

  return (
    <div
      className="relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
      style={{
        borderLeftWidth: "4px",
        borderLeftColor: progressColor,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
            style={{
              backgroundColor: `${categoryConfig.color}20`,
            }}
          >
            {categoryConfig.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-none mb-1">
              {goal.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {categoryConfig.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {goal.isCompleted && (
            <Badge variant="default" className="bg-green-600">
              ✓ Concluída
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(goal)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(goal)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(goal.id)}
                className="text-destructive"
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {goal.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{goal.progress}%</span>
          <span className="text-xs text-muted-foreground">
            {progressMessage}
          </span>
        </div>
        <Progress
          value={goal.progress}
          className="h-2"
          style={{
            // @ts-expect-error - Custom CSS variable for dynamic color
            "--progress-color": progressColor,
          }}
        />
      </div>

      {/* Values */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Atual:</span>
          <span className="font-semibold" style={{ color: progressColor }}>
            {formatCurrency(goal.currentAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Meta:</span>
          <span className="font-semibold">
            {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        {goal.remaining > 0 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-medium">Faltam:</span>
            <span className="font-bold text-primary">
              {formatCurrency(goal.remaining)}
            </span>
          </div>
        )}
      </div>

      {/* Deadline */}
      {goal.deadline && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Prazo:</span>
          <span
            className={`font-medium ${
              deadlineStatus === "vencido"
                ? "text-red-600"
                : deadlineStatus === "urgente"
                ? "text-orange-600"
                : deadlineStatus === "próximo"
                ? "text-yellow-600"
                : ""
            }`}
          >
            {format(new Date(goal.deadline), "dd/MM/yyyy", { locale: ptBR })}
            {daysUntilDeadline !== null && daysUntilDeadline >= 0 && (
              <span className="text-muted-foreground ml-1">
                (
                {daysUntilDeadline === 0 ? "hoje" : `${daysUntilDeadline} dias`}
                )
              </span>
            )}
            {daysUntilDeadline !== null && daysUntilDeadline < 0 && (
              <span className="text-red-600 ml-1">
                (vencido há {Math.abs(daysUntilDeadline)} dias)
              </span>
            )}
          </span>
        </div>
      )}

      {/* Contribute Button */}
      {!goal.isCompleted && (
        <Button
          onClick={() => onContribute(goal)}
          className="w-full"
          style={{
            backgroundColor: progressColor,
          }}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Contribuir
        </Button>
      )}

      {goal.isCompleted && (
        <div className="flex items-center justify-center gap-2 py-3 rounded-md bg-green-50 text-green-700">
          <Target className="h-5 w-5" />
          <span className="font-medium">Meta atingida!</span>
        </div>
      )}
    </div>
  );
}
