"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Link from "next/link";

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

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hasTransactions = (category._count?.transactions || 0) > 0;

  const handleDeleteClick = () => {
    if (hasTransactions) {
      setShowDeleteDialog(true);
    } else {
      // Mostrar confirmação simples
      if (
        confirm(
          `Tem certeza que deseja deletar a categoria "${category.name}"?`
        )
      ) {
        onDelete(category.id);
      }
    }
  };

  return (
    <>
      <div className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl shrink-0"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color,
              }}
            >
              {category.icon || "📦"}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category._count?.transactions || 0} transações
              </p>
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(category)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {category.isDefault && (
          <span className="mt-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            Padrão
          </span>
        )}
      </div>

      {/* Modal de bloqueio de exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Não é possível deletar esta categoria
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Esta categoria possui{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {category._count?.transactions} transações
                </span>{" "}
                vinculadas.
              </p>
              <p>
                Para deletar esta categoria, você precisa primeiro reassociar as
                transações a outra categoria.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Fechar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link
                href={`/dashboard/transactions?category=${category.id}`}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ver Transações
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
