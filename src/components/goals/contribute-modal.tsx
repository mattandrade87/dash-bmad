"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TrendingUp, Target, PartyPopper } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  contributeGoalSchema,
  type ContributeGoalInput,
  calculateProgress,
  getProgressColor,
  GOAL_CATEGORIES,
} from "@/lib/validations/goal";
import { useContributeGoal } from "@/hooks/use-goals";
import { formatCurrency } from "@/lib/formatters";

interface ContributeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: {
    id: string;
    name: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
  } | null;
}

export function ContributeModal({
  open,
  onOpenChange,
  goal,
}: ContributeModalProps) {
  const [contributionAmount, setContributionAmount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const contributeMutation = useContributeGoal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ContributeGoalInput>({
    resolver: zodResolver(contributeGoalSchema),
    mode: "onSubmit",
    defaultValues: {
      amount: 0,
      note: "",
    },
  });

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (!open) {
      // Use setTimeout para evitar setState durante render
      const timer = setTimeout(() => {
        reset();
        setContributionAmount(0);
        setShowCelebration(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, reset]);

  if (!goal) return null;

  const categoryConfig =
    GOAL_CATEGORIES[goal.category as keyof typeof GOAL_CATEGORIES];
  const currentProgress = calculateProgress(
    goal.currentAmount,
    goal.targetAmount
  );
  const newCurrentAmount = goal.currentAmount + contributionAmount;
  const newProgress = calculateProgress(newCurrentAmount, goal.targetAmount);
  const willComplete = newCurrentAmount >= goal.targetAmount;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const currentProgressColor = getProgressColor(currentProgress);
  const newProgressColor = getProgressColor(newProgress);

  const onSubmit = (data: ContributeGoalInput) => {
    contributeMutation.mutate(
      { id: goal.id, data },
      {
        onSuccess: (response) => {
          // Se atingiu 100%, mostrar celebração
          if (response.justCompleted) {
            setShowCelebration(true);
            setTimeout(() => {
              onOpenChange(false);
            }, 3000); // Fechar após 3 segundos
          } else {
            onOpenChange(false);
          }
          reset();
          setContributionAmount(0);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Adicionar Contribuição
          </DialogTitle>
          <DialogDescription>
            Registre uma nova contribuição para sua meta:{" "}
            <strong>{goal.name}</strong>
          </DialogDescription>
        </DialogHeader>

        {showCelebration ? (
          // Tela de Celebração
          <div className="py-12 text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <PartyPopper className="h-24 w-24 text-green-600 animate-bounce" />
                <div className="absolute inset-0 bg-green-600/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-600">
                🎉 Parabéns! Meta Atingida! 🎉
              </h3>
              <p className="text-lg text-muted-foreground">
                Você alcançou sua meta <strong>{goal.name}</strong>!
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Info da Meta */}
            <div
              className="rounded-lg border-2 p-4 flex items-center gap-4"
              style={{
                borderColor: categoryConfig.color,
                backgroundColor: `${categoryConfig.color}05`,
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-2xl shrink-0"
                style={{
                  backgroundColor: `${categoryConfig.color}30`,
                }}
              >
                {categoryConfig.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{goal.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} de{" "}
                  {formatCurrency(goal.targetAmount)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-2xl font-bold"
                  style={{ color: categoryConfig.color }}
                >
                  {currentProgress}%
                </p>
                <p className="text-xs text-muted-foreground">progresso</p>
              </div>
            </div>

            {/* Valor da Contribuição */}
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Contribuição *</Label>
              <CurrencyInput
                value={contributionAmount}
                onChange={(cents) => {
                  setContributionAmount(cents);
                  setValue("amount", cents);
                }}
                disabled={isSubmitting}
                placeholder="R$ 0,00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
              {remaining > 0 && (
                <p className="text-sm text-muted-foreground">
                  Faltam {formatCurrency(remaining)} para atingir a meta
                </p>
              )}
            </div>

            {/* Nota (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="note">Nota (opcional)</Label>
              <Textarea
                id="note"
                placeholder="Ex: Salário do mês, venda de item..."
                {...register("note")}
                disabled={isSubmitting}
                rows={3}
              />
              {errors.note && (
                <p className="text-sm text-destructive">
                  {errors.note.message}
                </p>
              )}
            </div>

            {/* Preview do Progresso */}
            {contributionAmount > 0 && (
              <div className="space-y-4 rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Target className="h-4 w-4" />
                  Após a contribuição:
                </div>

                {/* Progresso Atual */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Antes:</span>
                    <span className="font-medium">{currentProgress}%</span>
                  </div>
                  <Progress
                    value={currentProgress}
                    className="h-2"
                    style={{
                      // @ts-expect-error - Custom CSS variable
                      "--progress-color": currentProgressColor,
                    }}
                  />
                </div>

                {/* Novo Progresso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Depois:</span>
                    <span className="font-bold text-green-600">
                      {newProgress}%
                    </span>
                  </div>
                  <Progress
                    value={newProgress}
                    className="h-2"
                    style={{
                      // @ts-expect-error - Custom CSS variable
                      "--progress-color": newProgressColor,
                    }}
                  />
                </div>

                {/* Valores */}
                <div className="space-y-1 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Novo valor:</span>
                    <span className="font-semibold">
                      {formatCurrency(newCurrentAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Faltará:</span>
                    <span
                      className="font-bold"
                      style={{ color: newProgressColor }}
                    >
                      {willComplete ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Meta atingida!
                        </span>
                      ) : (
                        formatCurrency(goal.targetAmount - newCurrentAmount)
                      )}
                    </span>
                  </div>
                </div>

                {/* Alerta de conclusão */}
                {willComplete && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 text-green-700 text-sm">
                    <PartyPopper className="h-5 w-5 shrink-0" />
                    <span className="font-medium">
                      🎉 Esta contribuição vai completar sua meta!
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || contributionAmount === 0}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <TrendingUp className="mr-2 h-4 w-4" />
                Adicionar Contribuição
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
