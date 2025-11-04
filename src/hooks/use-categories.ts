"use client";

import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string;
  color: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

async function fetchCategories(): Promise<CategoriesResponse> {
  const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
