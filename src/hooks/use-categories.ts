"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
  icon: string | null;
  isDefault: boolean;
  _count?: {
    transactions: number;
  };
}

interface CreateCategoryInput {
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
  icon?: string;
}

interface UpdateCategoryInput {
  name?: string;
  type?: "INCOME" | "EXPENSE";
  color?: string;
  icon?: string;
}

// Hook para listar categorias
export function useCategories(type?: "INCOME" | "EXPENSE") {
  return useQuery<{ categories: Category[] }>({
    queryKey: ["categories", type],
    queryFn: async () => {
      const params = type ? `?type=${type}` : "";
      const response = await fetch(`/api/categories${params}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: true,
  });
}

// Hook para criar categoria
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar categoria");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook para atualizar categoria
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryInput;
    }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao atualizar categoria");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["top-categories"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook para deletar categoria
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao deletar categoria");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Categoria deletada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
