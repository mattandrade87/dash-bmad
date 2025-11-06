"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalModal } from "@/components/goals/goal-modal";
import { ContributeModal } from "@/components/goals/contribute-modal";
import { GoalDetailsModal } from "@/components/goals/goal-details-modal";
import { useGoals, useDeleteGoal } from "@/hooks/use-goals";
import type { GoalsFilters } from "@/lib/validations/goal";

// Tipos importados do hook
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

export default function GoalsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [contributingGoal, setContributingGoal] = useState<Goal | null>(null);
  const [detailsGoal, setDetailsGoal] = useState<Goal | null>(null);
  const [activeStatus, setActiveStatus] = useState<
    "active" | "completed" | "all"
  >("active");

  // Filtros para buscar metas
  const filters: GoalsFilters = {
    status: activeStatus,
    orderBy: "createdAt",
    order: "desc",
  };

  const { data: goalsResponse, isLoading } = useGoals(filters);
  const deleteMutation = useDeleteGoal();

  // Extrair array de metas da resposta
  const goals = goalsResponse?.data || [];

  // Handlers
  const handleNewGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (goal: Partial<Goal>) => {
    setEditingGoal(goal as Goal);
    setIsModalOpen(true);
  };

  const handleDelete = async (goalId: string) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      await deleteMutation.mutateAsync(goalId);
    }
  };

  const handleContribute = (goal: Partial<Goal>) => {
    setContributingGoal(goal as Goal);
  };

  const handleViewDetails = (goal: Partial<Goal>) => {
    setDetailsGoal(goal as Goal);
  };

  // Tabs config
  const tabs = [
    {
      id: "active" as const,
      label: "Ativas",
      count: goals.filter((g: Goal) => !g.isCompleted).length,
    },
    {
      id: "completed" as const,
      label: "Concluídas",
      count: goals.filter((g: Goal) => g.isCompleted).length,
    },
    { id: "all" as const, label: "Todas", count: goals.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Metas Financeiras
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button onClick={handleNewGoal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeStatus === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }
              `}
            >
              {tab.label}
              <span className="ml-2 text-xs text-gray-400">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && goals.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {activeStatus === "active" && "Nenhuma meta ativa"}
            {activeStatus === "completed" && "Nenhuma meta concluída"}
            {activeStatus === "all" && "Nenhuma meta cadastrada"}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {activeStatus === "active" &&
              "Comece definindo suas primeiras metas financeiras."}
            {activeStatus === "completed" &&
              "Você ainda não concluiu nenhuma meta."}
            {activeStatus === "all" &&
              "Crie sua primeira meta para começar a acompanhar seus objetivos."}
          </p>
          {activeStatus !== "completed" && (
            <Button onClick={handleNewGoal} className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Meta
            </Button>
          )}
        </div>
      )}

      {/* Goals Grid */}
      {!isLoading && goals.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal: Goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onContribute={handleContribute}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingGoal(null);
        }}
        goal={editingGoal}
      />

      {/* Contribute Modal */}
      <ContributeModal
        open={!!contributingGoal}
        onOpenChange={(open) => {
          if (!open) setContributingGoal(null);
        }}
        goal={contributingGoal}
      />

      {/* Goal Details Modal */}
      <GoalDetailsModal
        open={!!detailsGoal}
        onOpenChange={(open) => {
          if (!open) setDetailsGoal(null);
        }}
        goal={detailsGoal}
      />
    </div>
  );
}
