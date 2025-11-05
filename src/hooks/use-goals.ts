import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  GoalsFilters,
  CreateGoalInput,
  UpdateGoalInput,
  ContributeGoalInput,
} from "@/lib/validations/goal";

// Types
interface Goal {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: Date | null;
  isCompleted: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  progress: number;
  remaining: number;
}

interface GoalsResponse {
  success: boolean;
  data: Goal[];
}

interface GoalResponse {
  success: boolean;
  data: Goal;
  message?: string;
  justCompleted?: boolean;
}

// API Functions
async function fetchGoals(filters?: GoalsFilters): Promise<GoalsResponse> {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.orderBy) params.append("orderBy", filters.orderBy);
  if (filters?.order) params.append("order", filters.order);

  const response = await fetch(`/api/goals?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar metas");
  }

  return response.json();
}

async function fetchGoal(id: string): Promise<GoalResponse> {
  const response = await fetch(`/api/goals/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar meta");
  }

  return response.json();
}

async function createGoal(data: CreateGoalInput): Promise<GoalResponse> {
  const response = await fetch("/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar meta");
  }

  return response.json();
}

async function updateGoal(
  id: string,
  data: UpdateGoalInput
): Promise<GoalResponse> {
  const response = await fetch(`/api/goals/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar meta");
  }

  return response.json();
}

async function deleteGoal(
  id: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`/api/goals/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao deletar meta");
  }

  return response.json();
}

async function contributeGoal(
  id: string,
  data: ContributeGoalInput
): Promise<GoalResponse> {
  const response = await fetch(`/api/goals/${id}/contribute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao contribuir para meta");
  }

  return response.json();
}

// Hooks
export function useGoals(filters?: GoalsFilters) {
  return useQuery({
    queryKey: ["goals", filters],
    queryFn: () => fetchGoals(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: ["goals", id],
    queryFn: () => fetchGoal(id),
    staleTime: 1000 * 60 * 2, // 2 minutos
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Meta criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalInput }) =>
      updateGoal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Meta atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      toast.success("Meta deletada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useContributeGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContributeGoalInput }) =>
      contributeGoal(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      if (response.message) {
        toast.success(response.message);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
