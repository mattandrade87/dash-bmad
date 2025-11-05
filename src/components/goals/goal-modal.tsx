"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { CurrencyInput } from "@/components/ui/currency-input";
import { GoalCategoryPicker } from "./goal-category-picker";
import {
  createGoalSchema,
  type CreateGoalInput,
  GoalCategory,
  GOAL_CATEGORIES,
  calculateProgress,
} from "@/lib/validations/goal";
import { useCreateGoal, useUpdateGoal } from "@/hooks/use-goals";
import { formatCurrency } from "@/lib/utils";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: {
    id: string;
    name: string;
    description?: string | null;
    targetAmount: number;
    currentAmount: number;
    category: string;
    deadline?: Date | null;
  } | null;
}

export function GoalModal({ open, onOpenChange, goal }: GoalModalProps) {
  const isEditing = !!goal;
  const createMutation = useCreateGoal();
  const updateMutation = useUpdateGoal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateGoalInput>({
    // @ts-expect-error - Zod coerce.date() returns unknown, but works at runtime
    resolver: zodResolver(createGoalSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      targetAmount: 0,
      category: GoalCategory.SAVINGS,
      deadline: undefined,
    },
  });

  // Atualizar formulário quando goal mudar
  useEffect(() => {
    if (goal) {
      reset({
        name: goal.name,
        description: goal.description || "",
        targetAmount: goal.targetAmount,
        category: goal.category as GoalCategory,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      });
    } else {
      reset({
        name: "",
        description: "",
        targetAmount: 0,
        category: GoalCategory.SAVINGS,
        deadline: undefined,
      });
    }
  }, [goal, reset, open]);

  const selectedCategory = watch("category");
  const targetAmount = watch("targetAmount");
  const selectedName = watch("name");
  const selectedDeadline = watch("deadline");

  const categoryConfig = GOAL_CATEGORIES[selectedCategory];
  const progress = goal
    ? calculateProgress(goal.currentAmount, targetAmount || goal.targetAmount)
    : 0;

  const onSubmit: SubmitHandler<CreateGoalInput> = (data) => {
    if (isEditing && goal) {
      updateMutation.mutate(
        { id: goal.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Meta" : "Nova Meta Financeira"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Formulário */}
          {/* @ts-expect-error - React Hook Form type inference issue with Zod resolver */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Meta *</Label>
              <Input
                id="name"
                placeholder="Ex: Fundo de Emergência"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva sua meta..."
                {...register("description")}
                disabled={isSubmitting}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Valor Alvo */}
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Valor Alvo *</Label>
              <CurrencyInput
                value={targetAmount}
                onChange={(cents) => setValue("targetAmount", cents)}
                disabled={isSubmitting}
                placeholder="R$ 0,00"
              />
              {errors.targetAmount && (
                <p className="text-sm text-destructive">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <GoalCategoryPicker
                value={selectedCategory}
                onChange={(category) => setValue("category", category)}
                disabled={isSubmitting}
              />
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <Label>Prazo (Opcional)</Label>
              <DatePicker
                date={selectedDeadline || undefined}
                onSelect={(date) => setValue("deadline", date || undefined)}
                disabled={isSubmitting}
                placeholder="Selecione o prazo"
              />
              {errors.deadline && (
                <p className="text-sm text-destructive">
                  {errors.deadline.message}
                </p>
              )}
            </div>

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
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Atualizar Meta" : "Criar Meta"}
              </Button>
            </div>
          </form>

          {/* Preview */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground">
              Pré-visualização
            </div>

            <div
              className="rounded-lg border-2 p-6 space-y-4"
              style={{
                borderColor: categoryConfig.color,
                backgroundColor: `${categoryConfig.color}05`,
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-3xl"
                  style={{
                    backgroundColor: `${categoryConfig.color}30`,
                  }}
                >
                  {categoryConfig.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedName || "Nome da meta"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryConfig.label}
                  </p>
                </div>
              </div>

              {/* Progress (apenas se editando) */}
              {isEditing && goal && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{progress}%</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} de{" "}
                      {formatCurrency(targetAmount || goal.targetAmount)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: categoryConfig.color,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Valores */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meta:</span>
                  <span className="font-bold text-lg">
                    {targetAmount > 0
                      ? formatCurrency(targetAmount)
                      : "R$ 0,00"}
                  </span>
                </div>
                {isEditing && goal && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Atual:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Falta:</span>
                      <span
                        className="font-bold"
                        style={{ color: categoryConfig.color }}
                      >
                        {formatCurrency(
                          Math.max(
                            0,
                            (targetAmount || goal.targetAmount) -
                              goal.currentAmount
                          )
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Prazo */}
              {selectedDeadline && (
                <div className="flex items-center gap-2 text-sm pt-2 border-t">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Prazo:</span>
                  <span className="font-medium">
                    {selectedDeadline.toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
