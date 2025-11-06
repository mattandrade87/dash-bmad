"use client";

import Link from "next/link";
import { Target, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { GOAL_CATEGORIES, getProgressColor } from "@/lib/validations/goal";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Goal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date | null;
  progress: number;
}

interface UpcomingGoalsProps {
  goals: Goal[];
  isLoading?: boolean;
}

export function UpcomingGoals({ goals, isLoading }: UpcomingGoalsProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <Target className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          Nenhuma meta com prazo
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Defina prazos para suas metas para acompanhar o progresso aqui.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/goals">Ver Metas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Metas Próximas
          </h2>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/goals" className="flex items-center gap-1">
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const categoryConfig =
            GOAL_CATEGORIES[goal.category as keyof typeof GOAL_CATEGORIES];
          const progressColor = getProgressColor(goal.progress);

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
            <Link
              key={goal.id}
              href={`/dashboard/goals`}
              className="block rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{
                      backgroundColor: `${categoryConfig.color}20`,
                    }}
                  >
                    {categoryConfig.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {categoryConfig.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{goal.progress}%</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(goal.currentAmount)} de{" "}
                    {formatCurrency(goal.targetAmount)}
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

              {/* Deadline */}
              {goal.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={`font-medium ${
                      deadlineStatus === "vencido"
                        ? "text-red-600"
                        : deadlineStatus === "urgente"
                        ? "text-orange-600"
                        : deadlineStatus === "próximo"
                        ? "text-yellow-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(new Date(goal.deadline), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                    {daysUntilDeadline !== null && daysUntilDeadline >= 0 && (
                      <span className="text-muted-foreground ml-1">
                        (
                        {daysUntilDeadline === 0
                          ? "hoje"
                          : `${daysUntilDeadline} dias`}
                        )
                      </span>
                    )}
                    {daysUntilDeadline !== null && daysUntilDeadline < 0 && (
                      <span className="text-red-600 ml-1">(vencido)</span>
                    )}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
