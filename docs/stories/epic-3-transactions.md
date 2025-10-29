# Epic 3: Gerenciamento de Transações

**Prioridade:** Alta  
**Status:** Not Started  
**Estimativa:** 7-10 dias  
**Depende de:** Epic 2 (Autenticação)

## Descrição

Implementar todo o sistema de gerenciamento de transações financeiras (receitas e despesas), incluindo CRUD completo, filtros, e listagem.

---

## Story 3.1: Criar API de Transações (CRUD Completo)

**Como** sistema  
**Quero** APIs para gerenciar transações  
**Para que** possa processar operações CRUD de forma segura

### Critérios de Aceitação

- [ ] **GET /api/transactions** - Listar transações do usuário
  - Suporte a filtros: type, categoryId, startDate, endDate
  - Paginação: limit, offset
  - Ordenação por data (desc)
  - Include category nos resultados
- [ ] **POST /api/transactions** - Criar nova transação
  - Validação Zod server-side
  - Amount em centavos
  - Verificar se category existe e pertence ao user
  - Invalidar cache do dashboard
- [ ] **GET /api/transactions/[id]** - Buscar transação específica
  - Verificar ownership (userId)
  - Include category
- [ ] **PATCH /api/transactions/[id]** - Atualizar transação
  - Validação parcial
  - Verificar ownership
  - Invalidar cache
- [ ] **DELETE /api/transactions/[id]** - Deletar transação
  - Verificar ownership
  - Soft delete opcional (futuro)
  - Invalidar cache

### Tarefas Técnicas

```bash
# Estrutura de arquivos
src/app/api/transactions/route.ts
src/app/api/transactions/[id]/route.ts
src/lib/validations/transaction.ts
src/lib/repositories/transaction-repository.ts
```

### Schema de Validação

```typescript
export const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.number().int().positive(),
  description: z.string().min(1).max(255),
  categoryId: z.string().uuid(),
  date: z.coerce.date(),
});

export const updateTransactionSchema = createTransactionSchema.partial();
```

### Query Filters

```typescript
interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}
```

---

## Story 3.2: Criar Página de Listagem de Transações

**Como** usuário  
**Quero** ver todas as minhas transações  
**Para que** possa acompanhar meu histórico financeiro

### Critérios de Aceitação

- [ ] Página `/transactions` criada
- [ ] Tabela/lista de transações com colunas:
  - Data
  - Descrição
  - Categoria (com cor e ícone)
  - Tipo (badge receita/despesa)
  - Valor (formatado como moeda)
  - Ações (editar, deletar)
- [ ] Loading state (skeleton)
- [ ] Empty state (sem transações)
- [ ] Paginação (50 itens por página)
- [ ] Scroll infinito ou "Carregar mais" (opcional)
- [ ] Responsivo (cards em mobile, tabela em desktop)

### Componentes

```bash
src/app/(dashboard)/transactions/page.tsx
src/components/transactions/transaction-list.tsx
src/components/transactions/transaction-item.tsx
src/components/transactions/transaction-skeleton.tsx
src/components/common/empty-state.tsx
```

### Formatação de Valores

```typescript
const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
};
```

### Hook Personalizado

```typescript
// src/hooks/use-transactions.ts
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => apiClient.get('/transactions', { params: filters }),
  });
}
```

---

## Story 3.3: Criar Formulário de Nova Transação

**Como** usuário  
**Quero** adicionar uma nova transação  
**Para que** possa registrar minhas receitas e despesas

### Critérios de Aceitação

- [ ] Modal/drawer de formulário
- [ ] Botão "Nova Transação" visível
- [ ] Campos do formulário:
  - Tipo (toggle Receita/Despesa com cores)
  - Valor (R$, formatação automática)
  - Descrição (textarea)
  - Categoria (select filtrado por tipo)
  - Data (date picker, default hoje)
- [ ] Validação client-side (Zod + React Hook Form)
- [ ] Loading state no submit
- [ ] Feedback visual de sucesso/erro
- [ ] Fechar modal após sucesso
- [ ] Atualizar lista automaticamente (React Query invalidate)

### Componentes

```bash
src/components/transactions/transaction-form.tsx
src/components/transactions/transaction-modal.tsx
src/components/ui/date-picker.tsx
src/components/ui/currency-input.tsx
```

### UX Patterns

- **Optimistic Update:** Adicionar transação localmente antes da resposta do servidor
- **Rollback:** Reverter se houver erro
- **Toast:** Notificação de sucesso/erro

### Currency Input

```typescript
// Formatar input como moeda enquanto digita
const handleAmountChange = (e) => {
  const value = e.target.value.replace(/\D/g, '');
  const cents = parseInt(value || '0');
  setAmount(cents);

  // Display formatado
  const formatted = formatCurrency(cents);
  e.target.value = formatted;
};
```

---

## Story 3.4: Implementar Filtros de Transações

**Como** usuário  
**Quero** filtrar minhas transações  
**Para que** possa encontrar rapidamente o que procuro

### Critérios de Aceitação

- [ ] Barra de filtros acima da lista
- [ ] Filtros disponíveis:
  - Tipo (Todas, Receitas, Despesas)
  - Categoria (dropdown multi-select)
  - Período (preset + custom range):
    - Últimos 7 dias
    - Último mês
    - Últimos 3 meses
    - Personalizado (date range picker)
- [ ] Botão "Limpar filtros"
- [ ] Contador de resultados
- [ ] Filtros persistentes na URL (query params)
- [ ] Loading state ao aplicar filtros
- [ ] Responsivo (collapse em mobile)

### Componentes

```bash
src/components/transactions/transaction-filters.tsx
src/components/transactions/date-range-picker.tsx
src/components/transactions/category-filter.tsx
```

### URL Query Params

```typescript
// Exemplo: /transactions?type=EXPENSE&categoryId=abc&startDate=2025-01-01
const searchParams = useSearchParams();
const router = useRouter();

const applyFilters = (filters) => {
  const params = new URLSearchParams(filters);
  router.push(`/transactions?${params.toString()}`);
};
```

### Store Zustand

```typescript
// src/stores/transaction-store.ts
interface TransactionState {
  filters: TransactionFilters;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  clearFilters: () => void;
}
```

---

## Story 3.5: Implementar Edição de Transação

**Como** usuário  
**Quero** editar uma transação existente  
**Para que** possa corrigir erros ou atualizar informações

### Critérios de Aceitação

- [ ] Botão "Editar" em cada transação
- [ ] Abrir modal com formulário preenchido
- [ ] Todos os campos editáveis
- [ ] Validação client-side
- [ ] Loading state no submit
- [ ] Feedback de sucesso/erro
- [ ] Atualizar lista automaticamente
- [ ] Optimistic update

### Componentes

- Reutilizar `transaction-form.tsx` com modo "edit"
- Passar `initialData` e `transactionId`

### API Call

```typescript
const updateTransaction = useMutation({
  mutationFn: ({ id, data }) => apiClient.patch(`/transactions/${id}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries(['transactions']);
    toast.success('Transação atualizada!');
  },
});
```

---

## Story 3.6: Implementar Exclusão de Transação

**Como** usuário  
**Quero** deletar uma transação  
**Para que** possa remover registros incorretos

### Critérios de Aceitação

- [ ] Botão "Deletar" em cada transação
- [ ] Dialog de confirmação:
  - "Tem certeza que deseja deletar esta transação?"
  - "Esta ação não pode ser desfeita"
- [ ] Botões "Cancelar" e "Deletar"
- [ ] Loading state no botão deletar
- [ ] Feedback de sucesso/erro
- [ ] Remover da lista imediatamente (optimistic)
- [ ] Rollback se houver erro

### Componentes

```bash
src/components/common/confirm-dialog.tsx
```

### Confirmation Dialog

```typescript
const handleDelete = async (id: string) => {
  const confirmed = await confirmDialog({
    title: 'Deletar transação',
    description: 'Esta ação não pode ser desfeita.',
    confirmText: 'Deletar',
    cancelText: 'Cancelar',
  });

  if (confirmed) {
    await deleteTransaction(id);
  }
};
```

---

## Story 3.7: Criar Página de Detalhes da Transação

**Como** usuário  
**Quero** ver detalhes completos de uma transação  
**Para que** possa revisar todas as informações

### Critérios de Aceitação

- [ ] Página `/transactions/[id]` criada
- [ ] Exibir todos os campos:
  - Tipo (badge)
  - Valor (destaque)
  - Descrição
  - Categoria (com ícone)
  - Data (formatada)
  - Data de criação
  - Última atualização
- [ ] Botões de ação:
  - Editar
  - Deletar
  - Voltar
- [ ] Loading state
- [ ] Error state (404 se não encontrado)
- [ ] Breadcrumb navigation

### Componentes

```bash
src/app/(dashboard)/transactions/[id]/page.tsx
src/components/transactions/transaction-details.tsx
```

### Server Component

```typescript
// Usar Server Component para fetch inicial
export default async function TransactionPage({ params }) {
  const session = await getServerSession(authOptions);
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id, userId: session.user.id },
    include: { category: true },
  });

  if (!transaction) {
    notFound();
  }

  return <TransactionDetails transaction={transaction} />;
}
```

---

## Story 3.8: Adicionar Busca de Transações

**Como** usuário  
**Quero** buscar transações por descrição  
**Para que** possa encontrar rapidamente uma transação específica

### Critérios de Aceitação

- [ ] Campo de busca na página de transações
- [ ] Busca por descrição (case-insensitive)
- [ ] Debounce de 300ms
- [ ] Loading state durante busca
- [ ] Highlight dos termos encontrados (opcional)
- [ ] Limpar busca (botão X)
- [ ] Combo com filtros existentes

### Componentes

```bash
src/components/transactions/transaction-search.tsx
```

### Implementation

```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    setFilters({ ...filters, search: debouncedSearch });
  }
}, [debouncedSearch]);
```

### Backend

```typescript
// Adicionar ao query filter
where: {
  userId,
  description: {
    contains: search,
    mode: 'insensitive',
  },
}
```

---

## Story 3.9: Implementar Bulk Actions (Ações em Lote)

**Como** usuário  
**Quero** selecionar múltiplas transações  
**Para que** possa deletar ou categorizar várias de uma vez

### Critérios de Aceitação

- [ ] Checkbox em cada transação
- [ ] Checkbox "Selecionar todas" no header
- [ ] Contador de selecionados
- [ ] Barra de ações em lote:
  - Deletar selecionadas
  - Alterar categoria (futuro)
  - Exportar selecionadas (futuro)
- [ ] Confirmação antes de ações destrutivas
- [ ] Loading state durante operação
- [ ] Feedback de sucesso/erro

### Componentes

```bash
src/components/transactions/bulk-actions-bar.tsx
src/components/transactions/transaction-checkbox.tsx
```

### State Management

```typescript
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const toggleSelect = (id: string) => {
  setSelectedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};
```

---

## Story 3.10: Testes E2E de Transações

**Como** desenvolvedor  
**Quero** testes E2E para fluxo de transações  
**Para que** garanta que CRUD funciona corretamente

### Critérios de Aceitação

- [ ] Teste E2E: Criar transação
- [ ] Teste E2E: Listar transações
- [ ] Teste E2E: Filtrar transações
- [ ] Teste E2E: Buscar transação
- [ ] Teste E2E: Editar transação
- [ ] Teste E2E: Deletar transação
- [ ] Teste E2E: Bulk delete
- [ ] Todos os testes passando no CI

### Tarefas Técnicas

```typescript
// tests/e2e/transactions.spec.ts
test('should create income transaction', async ({ page }) => {
  await page.goto('/transactions');
  await page.click('button:text("Nova Transação")');

  // Preencher formulário
  await page.click('[data-testid="type-income"]');
  await page.fill('[name="amount"]', '1000');
  await page.fill('[name="description"]', 'Salário');
  await page.selectOption('[name="categoryId"]', 'salario');
  await page.click('button[type="submit"]');

  // Verificar na lista
  await expect(page.locator('text=Salário')).toBeVisible();
  await expect(page.locator('text=R$ 10,00')).toBeVisible();
});
```

---

## Definição de Pronto (DoD) para o Epic

- [ ] Todas as stories completadas
- [ ] CRUD completo funcionando
- [ ] Filtros e busca funcionando
- [ ] Bulk actions implementadas
- [ ] Testes E2E passando
- [ ] Performance adequada (lista de 500+ transações)
- [ ] Responsivo em mobile e desktop
- [ ] Sem bugs críticos
- [ ] Code review completo
- [ ] Documentação atualizada

---

## Performance

### Otimizações

- [ ] Paginação server-side
- [ ] Debounce em buscas
- [ ] Virtualização de lista (react-window) se >1000 itens
- [ ] Cache com React Query (5 minutos)
- [ ] Optimistic updates
- [ ] Lazy loading de modals

### Métricas Alvo

- Tempo de carregamento inicial: < 2s
- Tempo de aplicar filtros: < 500ms
- Tempo de criar transação: < 1s
- FPS ao scrollar: 60fps

## Dependências

- Epic 2 completo (Autenticação)
- Categorias criadas (seed)
- API de categorias (futuro ou mock)

## Riscos

- Performance com muitas transações
- Complexidade dos filtros
- Sincronização de cache
- Edge cases em datas

## Notas Técnicas

- Sempre trabalhar com valores em centavos
- Usar `date-fns` para manipulação de datas
- Invalidar cache do dashboard ao modificar transações
- Considerar soft delete para auditoria (futuro)
