"use client";

import { useState, useEffect } from "react";
import { Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DateRangePicker } from "./date-range-picker";
import { useCategories } from "@/hooks/use-categories";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useDebounce } from "use-debounce";

interface DateRange {
  from: Date;
  to: Date;
}

interface TransactionFiltersProps {
  onFiltersChange: (filters: {
    type?: "INCOME" | "EXPENSE";
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) => void;
  resultsCount?: number;
}

export function TransactionFilters({
  onFiltersChange,
  resultsCount,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "ALL">("ALL");
  const [categoryId, setCategoryId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounce search term (300ms)
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const { data: categoriesData } = useCategories();

  useEffect(() => {
    const filters: {
      type?: "INCOME" | "EXPENSE";
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
    } = {};

    if (type !== "ALL") {
      filters.type = type;
    }

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (dateRange) {
      filters.startDate = dateRange.from;
      filters.endDate = dateRange.to;
    }

    if (debouncedSearch) {
      filters.search = debouncedSearch;
    }

    onFiltersChange(filters);
  }, [type, categoryId, dateRange, debouncedSearch, onFiltersChange]);

  const handleClearFilters = () => {
    setType("ALL");
    setCategoryId("");
    setDateRange(undefined);
    setSearchTerm("");
  };

  const activeFiltersCount = [
    type !== "ALL",
    categoryId !== "",
    dateRange !== undefined,
    debouncedSearch !== "",
  ].filter(Boolean).length;

  // Filtrar categorias por tipo se tipo estiver selecionado
  const filteredCategories =
    categoriesData?.data.filter((cat) => type === "ALL" || cat.type === type) ||
    [];

  return (
    <Card className="p-4 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>

            {resultsCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                {resultsCount} {resultsCount === 1 ? "resultado" : "resultados"}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        <CollapsibleContent>
          {/* Campo de Busca */}
          <div className="mb-4">
            <Label htmlFor="search">Buscar por descrição</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Ex: Supermercado, Netflix, Salário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Filtro de Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={type}
                onValueChange={(value: "INCOME" | "EXPENSE" | "ALL") =>
                  setType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="INCOME">💰 Receitas</SelectItem>
                  <SelectItem value="EXPENSE">💸 Despesas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro de Categoria */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
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
            </div>

            {/* Filtro de Período */}
            <div className="space-y-2">
              <Label>Período</Label>
              <DateRangePicker dateRange={dateRange} onSelect={setDateRange} />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
