import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExportTransactions } from "@/hooks/use-export-transactions";
import type { TransactionFilters } from "@/lib/validations/transaction";

interface Transaction {
  id: string;
  date: Date | string; // Pode vir como string da API
  type: "INCOME" | "EXPENSE";
  description: string;
  amountCents: number;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

interface ExportButtonProps {
  /**
   * Transações carregadas atualmente na tela
   */
  currentTransactions?: Transaction[];

  /**
   * Filtros ativos (para exportar todas as transações filtradas)
   */
  filters?: Partial<TransactionFilters>;

  /**
   * Variante do botão
   */
  variant?: "default" | "outline" | "ghost";

  /**
   * Tamanho do botão
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Botão para exportar transações em formato CSV
 */
export function ExportButton({
  currentTransactions = [],
  filters,
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const { exportTransactions, exportAll, isExporting } =
    useExportTransactions();

  const handleExportCurrent = () => {
    exportTransactions(currentTransactions);
  };

  const handleExportAll = () => {
    exportAll(filters);
  };

  // Se não há transações carregadas, mostrar apenas opção de exportar tudo
  if (currentTransactions.length === 0) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleExportAll}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </>
        )}
      </Button>
    );
  }

  // Se há transações, mostrar dropdown com opções
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportCurrent}>
          <Download className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Exportar página atual</span>
            <span className="text-xs text-muted-foreground">
              {currentTransactions.length} transação(ões)
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExportAll}>
          <Download className="mr-2 h-4 w-4" />
          <div className="flex flex-col">
            <span>Exportar todas</span>
            <span className="text-xs text-muted-foreground">
              Com filtros aplicados
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
