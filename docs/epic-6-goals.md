# Epic 6: Metas Financeiras

## 📋 Visão Geral

Implementar sistema completo de metas financeiras que permite aos usuários definir objetivos de economia, controlar progresso em tempo real e receber alertas quando atingirem marcos importantes.

## 🎯 Objetivos

- Criar, editar e deletar metas financeiras
- Monitorar progresso em tempo real com base nas transações
- Alertas automáticos quando atingir/ultrapassar metas
- Visualização de histórico de metas concluídas
- Dashboard cards mostrando progresso das metas
- Sistema de categorias de metas (economia, investimento, etc)

## 📊 Valor de Negócio

- **Motivação do Usuário**: Visualização clara de progresso incentiva economia
- **Engajamento**: Notificações mantém usuários ativos
- **Retenção**: Metas a longo prazo aumentam lifetime value
- **Diferencial**: Recurso premium que destaca a aplicação

## 🏗️ Arquitetura

### Modelo de Dados

```prisma
model Goal {
  id            String   @id @default(cuid())
  userId        String
  name          String
  description   String?
  targetAmount  Int      // Em centavos
  currentAmount Int      @default(0)
  category      GoalCategory
  deadline      DateTime?
  isCompleted   Boolean  @default(false)
  completedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isCompleted])
}

enum GoalCategory {
  SAVINGS      // Economia geral
  EMERGENCY    // Fundo de emergência
  INVESTMENT   // Investimento
  PURCHASE     // Compra específica
  DEBT         // Quitação de dívida
  VACATION     // Viagem
  EDUCATION    // Educação
  OTHER        // Outros
}
```

### APIs

**GET /api/goals** - Listar metas do usuário

- Query params: `status` (active/completed/all), `category`
- Response: Array de metas com progresso calculado

**POST /api/goals** - Criar nova meta

- Body: name, description, targetAmount, category, deadline

**PATCH /api/goals/[id]** - Atualizar meta

- Body: Partial de Goal (não permite atualizar currentAmount diretamente)

**DELETE /api/goals/[id]** - Deletar meta

- Soft delete se já tiver progresso

**POST /api/goals/[id]/contribute** - Adicionar contribuição manual

- Body: amount (em centavos), note

**GET /api/goals/[id]/progress** - Detalhes de progresso

- Response: progresso, contribuições recentes, projeção

### Lógica de Negócio

1. **Cálculo de Progresso**:

   - `currentAmount` é atualizado via transações categorizadas como "contribuição para meta"
   - Progresso = (currentAmount / targetAmount) \* 100
   - Status: active | on_track | at_risk | completed

2. **Projeção de Conclusão**:

   - Baseado na média mensal de contribuições
   - Compara com deadline se existir

3. **Alertas**:
   - 25%, 50%, 75%, 100% da meta
   - 30 dias antes do deadline
   - Quando ultrapassar meta

## 📝 User Stories

### Story 6.1: Modelo Goal e Migrations (2h)

**Como** desenvolvedor  
**Quero** criar o modelo de dados Goal  
**Para que** possamos armazenar metas financeiras

**Critérios de Aceite:**

- ✅ Schema Prisma com todos os campos
- ✅ Enum GoalCategory com 8 categorias
- ✅ Relação com User (cascade delete)
- ✅ Índices para userId e isCompleted
- ✅ Migration criada e aplicada
- ✅ Seeds com metas de exemplo

**Arquivos:**

- `prisma/schema.prisma` - Adicionar Goal model
- `prisma/migrations/*` - Nova migration
- `prisma/seed.ts` - Seeds de metas

---

### Story 6.2: Validações e Types (1h)

**Como** desenvolvedor  
**Quero** criar validações Zod para metas  
**Para que** garantamos dados consistentes

**Critérios de Aceite:**

- ✅ createGoalSchema com todas validações
- ✅ updateGoalSchema (partial)
- ✅ contributeSchema para contribuições
- ✅ goalsFiltersSchema para queries
- ✅ TypeScript types inferidos
- ✅ Mensagens de erro em PT-BR

**Arquivos:**

- `src/lib/validations/goal.ts`

**Validações:**

```typescript
- name: 3-100 caracteres
- description: max 500 caracteres
- targetAmount: min 100 centavos (R$ 1,00)
- category: enum GoalCategory
- deadline: data futura opcional
- amount (contribuição): positivo
```

---

### Story 6.3: APIs CRUD de Goals (3h)

**Como** usuário  
**Quero** APIs para gerenciar metas  
**Para que** possa criar e controlar meus objetivos

**Critérios de Aceite:**

- ✅ GET /api/goals - Lista com filtros
- ✅ POST /api/goals - Criar meta
- ✅ PATCH /api/goals/[id] - Atualizar
- ✅ DELETE /api/goals/[id] - Deletar
- ✅ POST /api/goals/[id]/contribute - Contribuir
- ✅ Cálculo automático de progresso
- ✅ Validação de ownership
- ✅ Error handling completo

**Arquivos:**

- `src/app/api/goals/route.ts`
- `src/app/api/goals/[id]/route.ts`
- `src/app/api/goals/[id]/contribute/route.ts`

**Lógica:**

```typescript
// Cálculo de progresso
const progress = (currentAmount / targetAmount) * 100;
const remaining = targetAmount - currentAmount;

// Projeção
const avgMonthly = calculateAvgContribution(last3Months);
const monthsToComplete = remaining / avgMonthly;
const projectedDate = addMonths(today, monthsToComplete);
```

---

### Story 6.4: Hooks React Query (2h)

**Como** desenvolvedor  
**Quero** hooks para consumir APIs de goals  
**Para que** componentes tenham acesso fácil aos dados

**Critérios de Aceite:**

- ✅ useGoals(filters) - Lista de metas
- ✅ useGoal(id) - Meta específica
- ✅ useCreateGoal() - Mutation criar
- ✅ useUpdateGoal() - Mutation atualizar
- ✅ useDeleteGoal() - Mutation deletar
- ✅ useContributeGoal() - Mutation contribuir
- ✅ Invalidações automáticas
- ✅ Toast notifications
- ✅ Loading states

**Arquivos:**

- `src/hooks/use-goals.ts`

**Implementação:**

```typescript
export function useGoals(filters?: GoalsFilters) {
  return useQuery({
    queryKey: ["goals", filters],
    queryFn: () => fetchGoals(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
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
  });
}
```

---

### Story 6.5: GoalCard Component (2h)

**Como** usuário  
**Quero** visualizar minhas metas em cards  
**Para que** veja progresso de forma visual

**Critérios de Aceite:**

- ✅ Card com ícone da categoria
- ✅ Progress bar colorida (verde: >75%, amarelo: 50-75%, vermelho: <50%)
- ✅ Valor atual / valor meta
- ✅ Porcentagem de progresso
- ✅ Deadline se existir
- ✅ Botão "Contribuir"
- ✅ Menu com editar/deletar
- ✅ Badge "Concluída" se isCompleted
- ✅ Animação ao atingir 100%

**Arquivos:**

- `src/components/goals/goal-card.tsx`

**Design:**

```tsx
┌─────────────────────────────────────┐
│ 🎯 Emergência      [⋮]              │
│                                     │
│ ████████████░░░░░░░░░  75%          │
│                                     │
│ R$ 7.500,00 de R$ 10.000,00        │
│ Faltam: R$ 2.500,00                │
│                                     │
│ ⏰ Prazo: 31/12/2025 (2 meses)     │
│                                     │
│         [Contribuir]                │
└─────────────────────────────────────┘
```

---

### Story 6.6: GoalModal - Criar/Editar (3h)

**Como** usuário  
**Quero** modal para criar/editar metas  
**Para que** possa gerenciar meus objetivos

**Critérios de Aceite:**

- ✅ Dialog com formulário completo
- ✅ Nome da meta (Input)
- ✅ Descrição opcional (Textarea)
- ✅ Valor alvo (CurrencyInput)
- ✅ Categoria (Select com ícones)
- ✅ Prazo opcional (DatePicker)
- ✅ Preview do card ao lado
- ✅ Validação React Hook Form
- ✅ Loading states
- ✅ Modo create/edit

**Arquivos:**

- `src/components/goals/goal-modal.tsx`
- `src/components/goals/goal-category-picker.tsx`

**Categorias:**

```typescript
SAVINGS: { icon: '💰', color: '#10B981', label: 'Economia' }
EMERGENCY: { icon: '🚨', color: '#EF4444', label: 'Emergência' }
INVESTMENT: { icon: '📈', color: '#3B82F6', label: 'Investimento' }
PURCHASE: { icon: '🛒', color: '#F59E0B', label: 'Compra' }
DEBT: { icon: '💳', color: '#DC2626', label: 'Dívida' }
VACATION: { icon: '✈️', color: '#8B5CF6', label: 'Viagem' }
EDUCATION: { icon: '📚', color: '#06B6D4', label: 'Educação' }
OTHER: { icon: '🎯', color: '#6B7280', label: 'Outros' }
```

---

### Story 6.7: Página de Metas (3h)

**Como** usuário  
**Quero** página dedicada para metas  
**Para que** gerencie todos meus objetivos

**Critérios de Aceite:**

- ✅ Header com "Nova Meta" button
- ✅ Tabs: Ativas / Concluídas / Todas
- ✅ Grid responsivo de GoalCards
- ✅ Empty state com CTA
- ✅ Loading skeleton
- ✅ Filtro por categoria
- ✅ Ordenação (progresso, deadline, valor)
- ✅ GoalModal integration

**Arquivos:**

- `src/app/(dashboard)/dashboard/goals/page.tsx`

**Layout:**

```
┌──────────────────────────────────────────────┐
│ Metas Financeiras         [Nova Meta]       │
├──────────────────────────────────────────────┤
│ [Ativas] [Concluídas] [Todas]               │
│                                              │
│ Categoria: [Todas ▼]  Ordenar: [Progresso ▼]│
├──────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ Meta 1 │ │ Meta 2 │ │ Meta 3 │           │
│ └────────┘ └────────┘ └────────┘           │
│ ┌────────┐ ┌────────┐                       │
│ │ Meta 4 │ │ Meta 5 │                       │
│ └────────┘ └────────┘                       │
└──────────────────────────────────────────────┘
```

---

### Story 6.8: Dashboard Integration (2h)

**Como** usuário  
**Quero** ver progresso de metas no dashboard  
**Para que** tenha visão geral dos objetivos

**Critérios de Aceite:**

- ✅ Card "Metas" no SummaryCards
- ✅ Mostrar: X metas ativas, Y concluídas
- ✅ Seção "Próximas Metas" no dashboard
- ✅ Top 3 metas mais próximas do prazo
- ✅ Link "Ver todas" → /dashboard/goals
- ✅ Empty state se sem metas

**Arquivos:**

- `src/components/dashboard/summary-cards.tsx` - Adicionar card
- `src/components/dashboard/upcoming-goals.tsx` - Novo componente
- `src/app/(dashboard)/dashboard/page.tsx` - Integração
- `src/app/api/dashboard/summary/route.ts` - Adicionar goals data

**Card no Dashboard:**

```typescript
{
  title: "Metas",
  value: "5/8", // Concluídas / Total
  variation: "+2", // Metas concluídas este mês
  icon: Target,
  isPositive: true,
  color: "purple"
}
```

---

### Story 6.9: Contribute Modal (2h)

**Como** usuário  
**Quero** adicionar contribuições para metas  
**Para que** atualize meu progresso

**Critérios de Aceite:**

- ✅ Modal para contribuir
- ✅ Valor (CurrencyInput)
- ✅ Nota opcional (Textarea)
- ✅ Criação automática de transação INCOME
- ✅ Vinculação com categoria "Contribuição Meta"
- ✅ Atualização do currentAmount
- ✅ Animação se atingir 100%
- ✅ Notificação de sucesso

**Arquivos:**

- `src/components/goals/contribute-modal.tsx`

**Fluxo:**

1. Usuário clica "Contribuir" no GoalCard
2. Modal abre com valor pre-selecionado (valor faltante)
3. Usuário ajusta valor e adiciona nota
4. Submit cria:
   - Transaction (INCOME, categoria "Meta: [nome]")
   - Atualiza Goal.currentAmount
   - Se atingir target: marca isCompleted, salva completedAt

---

### Story 6.10: Goal Progress Details (2h)

**Como** usuário  
**Quero** ver detalhes do progresso  
**Para que** entenda minha evolução

**Critérios de Aceite:**

- ✅ Modal/Page com detalhes da meta
- ✅ Gráfico de progresso ao longo do tempo
- ✅ Lista de contribuições (últimas 10)
- ✅ Média mensal de contribuições
- ✅ Projeção de conclusão
- ✅ "Dias restantes" até deadline
- ✅ Sugestão de valor mensal necessário

**Arquivos:**

- `src/components/goals/goal-details-modal.tsx`
- `src/components/goals/goal-progress-chart.tsx`

**Dados:**

```typescript
{
  goal: Goal,
  progress: number,
  remaining: number,
  contributions: Transaction[],
  avgMonthly: number,
  projectedDate: Date | null,
  requiredMonthly: number | null, // Se tiver deadline
  daysRemaining: number | null
}
```

---

## 🎨 Design System

### Cores por Categoria

```typescript
const GOAL_COLORS = {
  SAVINGS: "#10B981", // Green
  EMERGENCY: "#EF4444", // Red
  INVESTMENT: "#3B82F6", // Blue
  PURCHASE: "#F59E0B", // Amber
  DEBT: "#DC2626", // Red dark
  VACATION: "#8B5CF6", // Purple
  EDUCATION: "#06B6D4", // Cyan
  OTHER: "#6B7280", // Gray
};
```

### Progress Bar States

- **>= 75%**: Verde (#10B981) - "Excelente progresso!"
- **50-74%**: Amarelo (#F59E0B) - "No caminho certo"
- **25-49%**: Laranja (#F97316) - "Continue contribuindo"
- **< 25%**: Vermelho (#EF4444) - "Precisa de atenção"

## ⚙️ Configurações

### Notificações (Epic 7 integration)

- Atingir 25% da meta
- Atingir 50% da meta
- Atingir 75% da meta
- Atingir 100% da meta
- 30 dias antes do deadline
- 7 dias antes do deadline
- Deadline passou e meta não concluída

### Cache Strategy

```typescript
// Goals list
staleTime: 5 * 60 * 1000  // 5 minutos

// Goal detail
staleTime: 2 * 60 * 1000  // 2 minutos

// Invalidar ao:
- Criar goal
- Atualizar goal
- Contribuir para goal
- Deletar goal
- Criar transação (pode afetar progresso)
```

## 📊 Métricas de Sucesso

- **Taxa de Criação**: % de usuários que criam pelo menos 1 meta
- **Engagement**: Média de contribuições por meta
- **Conclusão**: % de metas concluídas dentro do prazo
- **Retenção**: Usuários com metas ativas retornam 2x mais

## 🔄 Integrações

### Epic 3 (Transações)

- Contribuições criam transações INCOME
- Categoria especial "Meta: [nome]"
- Filtros mostram transações de metas

### Epic 4 (Dashboard)

- Card "Metas" no summary
- Widget "Próximas Metas"
- Progresso geral de metas

### Epic 7 (Alertas)

- Notificações de progresso
- Alertas de deadline
- Celebrações ao completar

## 📅 Timeline

**Estimativa Total**: 18-22 horas (~3-4 dias)

- **Dia 1**: Stories 6.1-6.3 (Backend completo)
- **Dia 2**: Stories 6.4-6.6 (Componentes principais)
- **Dia 3**: Stories 6.7-6.8 (Página + Dashboard)
- **Dia 4**: Stories 6.9-6.10 (Detalhes + Polimento)

## ✅ Definition of Done

- [ ] Todas as 10 stories completadas
- [ ] Testes unitários (>80% coverage)
- [ ] Testes E2E principais fluxos
- [ ] Documentação API atualizada
- [ ] README atualizado
- [ ] Migrations aplicadas
- [ ] Seeds funcionando
- [ ] Deploy em staging
- [ ] Code review aprovado
- [ ] QA sign-off

## 🚀 Pós-Epic

Após conclusão do Epic 6:

1. Epic 7 (Alertas e Notificações)
2. Epic 8 (Relatórios e Gráficos)
3. Epic 9 (Exportação de Dados)
4. Epic 10 (Gamificação)

---

**Status**: 📝 Planejado  
**Prioridade**: 🟢 Alta  
**Complexidade**: 🟡 Média  
**Valor de Negócio**: 🟢 Alto
