"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "./transaction-form";
import { useState } from "react";
import type { CreateTransactionFormInput } from "@/lib/validations/transaction";

interface TransactionModalProps {
  mode?: "create" | "edit";
  transactionId?: string;
  initialData?: Partial<CreateTransactionFormInput>;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionModal({
  mode = "create",
  transactionId,
  initialData,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: TransactionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize as informações da sua transação."
              : "Adicione uma nova receita ou despesa para acompanhar suas finanças."}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          mode={mode}
          transactionId={transactionId}
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
