"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransactionFormSchema,
  type CreateTransactionFormInput,
  type CreateTransactionInput,
} from "@/lib/validations/transaction";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { DatePicker } from "@/components/ui/date-picker";
import { useCategories } from "@/hooks/use-categories";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  mode?: "create" | "edit";
  transactionId?: string;
  initialData?: Partial<CreateTransactionFormInput>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

async function createTransaction(data: CreateTransactionInput) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao criar transação");
  }

  return response.json();
}

async function updateTransaction(id: string, data: CreateTransactionInput) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao atualizar transação");
  }

  return response.json();
}

export function TransactionForm({
  mode = "create",
  transactionId,
  initialData,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    initialData?.type || "EXPENSE"
  );
  const queryClient = useQueryClient();
  const { data: categoriesData } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateTransactionFormInput>({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      type: initialData?.type || "EXPENSE",
      amountCents: initialData?.amountCents || 0,
      description: initialData?.description || "",
      categoryId: initialData?.categoryId || "",
      date: initialData?.date || new Date(),
    },
  });

  // Atualizar formulário quando initialData mudar
  useEffect(() => {
    if (initialData) {
      reset(initialData as CreateTransactionFormInput);
      setTransactionType(initialData.type || "EXPENSE");
    }
  }, [initialData, reset]);

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação criada com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateTransactionInput) => {
      if (!transactionId) throw new Error("ID da transação não fornecido");
      return updateTransaction(transactionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transação atualizada com sucesso!");
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateTransactionFormInput) => {
    if (mode === "edit") {
      updateMutation.mutate(data as CreateTransactionInput);
    } else {
      createMutation.mutate(data as CreateTransactionInput);
    }
  };

  const handleTypeChange = (type: "INCOME" | "EXPENSE") => {
    setTransactionType(type);
    setValue("type", type);
    setValue("categoryId", ""); // Reset category quando mudar tipo
  };

  const amountCents = watch("amountCents");
  const selectedDate = watch("date");

  // Filtrar categorias por tipo
  const filteredCategories =
    categoriesData?.data.filter((cat) => cat.type === transactionType) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Toggle de Tipo */}
      <div className="space-y-2">
        <Label>Tipo de Transação</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={transactionType === "INCOME" ? "default" : "outline"}
            className={cn(
              "w-full",
              transactionType === "INCOME" && "bg-green-600 hover:bg-green-700"
            )}
            onClick={() => handleTypeChange("INCOME")}
          >
            💰 Receita
          </Button>
          <Button
            type="button"
            variant={transactionType === "EXPENSE" ? "default" : "outline"}
            className={cn(
              "w-full",
              transactionType === "EXPENSE" && "bg-red-600 hover:bg-red-700"
            )}
            onClick={() => handleTypeChange("EXPENSE")}
          >
            💸 Despesa
          </Button>
        </div>
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <Label htmlFor="amount">Valor *</Label>
        <CurrencyInput
          value={amountCents}
          onChange={(cents) => setValue("amountCents", cents)}
          disabled={isSubmitting}
          placeholder="R$ 0,00"
        />
        {errors.amountCents && (
          <p className="text-sm text-destructive">
            {errors.amountCents.message}
          </p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          placeholder="Ex: Supermercado, Salário, Conta de luz..."
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

      {/* Categoria */}
      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select
          value={watch("categoryId")}
          onValueChange={(value) => setValue("categoryId", value)}
          disabled={isSubmitting || filteredCategories.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
        {filteredCategories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma categoria de{" "}
            {transactionType === "INCOME" ? "receita" : "despesa"} disponível
          </p>
        )}
      </div>

      {/* Data */}
      <div className="space-y-2">
        <Label>Data *</Label>
        <DatePicker
          date={selectedDate}
          onSelect={(date) => setValue("date", date || new Date())}
          disabled={isSubmitting}
          placeholder="Selecione a data"
        />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-2 justify-end pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Atualizar Transação" : "Criar Transação"}
        </Button>
      </div>
    </form>
  );
}
