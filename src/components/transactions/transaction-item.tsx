"use client";

import { Trash2, Pencil, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionModal } from "./transaction-modal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useDeleteTransaction } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  description: string;
  date: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDuplicateOpen, setIsDuplicateOpen] = useState(false);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(transaction.id);
      toast.success("Transação excluída com sucesso");
    } catch {
      toast.error("Erro ao excluir transação");
    }
  };

  const isIncome = transaction.type === "INCOME";

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Ícone e Informações */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-lg shrink-0"
            style={{
              backgroundColor: `${transaction.category.color}20`,
              color: transaction.category.color,
            }}
          >
            {transaction.category.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {transaction.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {transaction.category.name}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Valor e Ações */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={cn(
                "font-semibold text-base",
                isIncome ? "text-green-600" : "text-red-600"
              )}
            >
              {isIncome ? "+" : "-"} {formatCurrency(transaction.amountCents)}
            </p>
            <Badge
              variant={isIncome ? "default" : "destructive"}
              className="text-xs"
            >
              {isIncome ? "Receita" : "Despesa"}
            </Badge>
          </div>

          {/* Botão Editar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setIsEditOpen(true)}
            title="Editar transação"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Modal de Edição */}
          <TransactionModal
            mode="edit"
            transactionId={transaction.id}
            initialData={{
              type: transaction.type,
              amountCents: transaction.amountCents,
              description: transaction.description,
              categoryId: transaction.category.id,
              date: new Date(transaction.date),
            }}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
          />

          {/* Botão Duplicar */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={() => setIsDuplicateOpen(true)}
            title="Duplicar transação"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* Modal de Duplicação */}
          <TransactionModal
            mode="create"
            initialData={{
              type: transaction.type,
              amountCents: transaction.amountCents,
              description: transaction.description,
              categoryId: transaction.category.id,
              date: new Date(), // Data atual
            }}
            open={isDuplicateOpen}
            onOpenChange={setIsDuplicateOpen}
          />

          {/* Botão Deletar */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta transação? Esta ação não
                  pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}
