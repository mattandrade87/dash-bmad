"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./color-picker";
import { IconPicker } from "./icon-picker";
import { createCategorySchema } from "@/lib/validations/category";
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-categories";
import { z } from "zod";
import { Loader2 } from "lucide-react";

type CategoryFormData = z.infer<typeof createCategorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
    color: string;
    icon: string | null;
  };
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
}: CategoryModalProps) {
  const isEditing = !!category;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
      color: "#EF4444",
      icon: "💳",
    },
  });

  const selectedType = watch("type");
  const selectedColor = watch("color");
  const selectedIcon = watch("icon");
  const name = watch("name");

  // Atualizar form quando modal abre/fecha ou categoria muda
  useEffect(() => {
    if (isOpen && category) {
      reset({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon || undefined,
      });
    } else if (isOpen && !category) {
      reset({
        name: "",
        type: "EXPENSE",
        color: "#EF4444",
        icon: "💳",
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onClose();
      reset();
    } catch {
      // Erros já são tratados nos hooks com toast
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Alimentação"
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setValue("type", "INCOME")}
                disabled={isEditing}
                className={`
                  flex-1 rounded-lg border-2 p-3 text-center transition-all
                  ${
                    selectedType === "INCOME"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                  }
                  ${
                    isEditing
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                <span className="text-lg">💰</span>
                <p className="mt-1 font-medium">Receita</p>
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "EXPENSE")}
                disabled={isEditing}
                className={`
                  flex-1 rounded-lg border-2 p-3 text-center transition-all
                  ${
                    selectedType === "EXPENSE"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                  }
                  ${
                    isEditing
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >
                <span className="text-lg">💸</span>
                <p className="mt-1 font-medium">Despesa</p>
              </button>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Não é possível alterar o tipo de uma categoria existente
              </p>
            )}
          </div>

          {/* Cor */}
          <ColorPicker
            value={selectedColor}
            onChange={(color) => setValue("color", color)}
          />
          {errors.color && (
            <p className="text-sm text-red-600">{errors.color.message}</p>
          )}

          {/* Ícone */}
          <IconPicker
            value={selectedIcon || ""}
            onChange={(icon) => setValue("icon", icon)}
            type={selectedType}
          />

          {/* Preview */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                style={{
                  backgroundColor: `${selectedColor}20`,
                  color: selectedColor,
                }}
              >
                {selectedIcon || "❓"}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {name || "Nome da categoria"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedType === "INCOME" ? "Receita" : "Despesa"}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar Alterações" : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
