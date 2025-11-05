# Epic 4: Dashboard e Visualizações

**Prioridade:** Alta  
**Status:** In Progress  
**Estimativa:** 5-7 dias  
**Depende de:** Epic 3 (Transações)

## Descrição

Implementar o dashboard principal com métricas financeiras, gráficos e visualizações em tempo real. Este epic transforma os placeholders da página inicial em um painel completo e funcional.

**Nota:** Parte deste Epic já foi implementada no Story 3.8 (página `/stats` com gráficos). Este Epic foca na página principal `/dashboard`.

---

## Story 4.1: API de Métricas do Dashboard

**Como** sistema  
**Quero** API para agregar dados financeiros  
**Para que** o dashboard exiba métricas em tempo real

### Critérios de Aceitação

- [ ] **GET /api/dashboard/summary** - Resumo financeiro
  - Total de receitas (mês atual)
  - Total de despesas (mês atual)
  - Saldo (receitas - despesas do mês)
  - Variação % vs mês anterior
  - Total de transações (mês atual)
  - Metas atingidas (futuro - Epic 6)
- [ ] **GET /api/dashboard/recent-transactions** - Últimas transações
  - Limit: 5-10 transações
  - Include category
  - Ordenadas por data (desc)
- [ ] **GET /api/dashboard/top-categories** - Top categorias por tipo
  - Top 5 categorias de despesas
  - Top 3 categorias de receitas
  - Com totais e percentuais
- [ ] Cache com Vercel KV (5 minutos)
- [ ] Invalidação automática ao criar/editar/deletar transação

### Tarefas Técnicas

```bash
src/app/api/dashboard/summary/route.ts
src/app/api/dashboard/recent-transactions/route.ts
src/app/api/dashboard/top-categories/route.ts
```

### Response Types

```typescript
interface DashboardSummary {
  currentMonth: {
    income: number;
    expense: number;
    balance: number;
    transactionCount: number;
  };
  previousMonth: {
    income: number;
    expense: number;
    balance: number;
  };
  variation: {
    income: number; // %
    expense: number; // %
    balance: number; // %
  };
  goals?: {
    total: number;
    achieved: number;
  };
}

interface RecentTransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  description: string;
  amountCents: number;
  date: Date;
  category: {
    name: string;
    color: string;
    icon: string;
  };
}

interface TopCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
  transactionCount: number;
}
```

---

## Story 4.2: Cards de Resumo Financeiro

**Como** usuário  
**Quero** ver cards com métricas principais  
**Para que** tenha uma visão rápida da minha situação financeira

### Critérios de Aceitação

- [ ] 4 cards principais:
  - **Receitas do mês** (verde, ícone TrendingUp)
    - Valor total
    - Variação % vs mês anterior
    - Indicador ↑/↓
  - **Despesas do mês** (vermelho, ícone TrendingDown)
    - Valor total
    - Variação % vs mês anterior
    - Indicador ↑/↓
  - **Saldo do mês** (azul/verde/vermelho dinâmico, ícone DollarSign)
    - Receitas - Despesas
    - Variação % vs mês anterior
    - Cor baseada em positivo/negativo
  - **Transações** (roxo, ícone Activity)
    - Contagem total do mês
    - Variação % vs mês anterior
- [ ] Loading skeleton durante carregamento
- [ ] Tooltip com mais detalhes ao hover
- [ ] Valores formatados em R$ (BRL)
- [ ] Cores do shadcn/ui (green-600, red-600, blue-600, purple-600)

### Componente

```bash
src/components/dashboard/summary-cards.tsx
```

---

## Story 4.3: Lista de Transações Recentes

**Como** usuário  
**Quero** ver minhas últimas transações no dashboard  
**Para que** possa acompanhar atividades recentes rapidamente

### Critérios de Aceitação

- [ ] Card "Transações Recentes" no dashboard
- [ ] Exibir últimas 5-10 transações
- [ ] Cada item mostra:
  - Ícone e cor da categoria
  - Descrição
  - Data (formato relativo: "Hoje", "Ontem", "3 dias atrás")
  - Valor (verde para receitas, vermelho para despesas)
- [ ] Link "Ver todas" para `/dashboard/transactions`
- [ ] Empty state quando não há transações
- [ ] Loading skeleton

### Componente

```bash
src/components/dashboard/recent-transactions.tsx
```

---

## Story 4.4: Gráfico de Top Categorias no Dashboard

**Como** usuário  
**Quero** ver um gráfico das minhas principais categorias de gastos  
**Para que** saiba onde estou gastando mais

### Critérios de Aceitação

- [ ] Card "Principais Categorias" no dashboard
- [ ] Gráfico de barras horizontal (similar ao `/stats`)
- [ ] Top 5 categorias de despesas
- [ ] Cada barra com cor da categoria
- [ ] Valores e percentuais
- [ ] Link "Ver relatório completo" para `/dashboard/stats`
- [ ] Empty state quando não há dados
- [ ] Loading skeleton

### Componente

```bash
src/components/dashboard/top-categories-chart.tsx
```

### Reutilização

- Pode reutilizar componente do Story 3.8 (`categories-chart.tsx`)
- Ou criar versão simplificada específica

---

## Story 4.5: Seção "Primeiros Passos" (Onboarding)

**Como** novo usuário  
**Quero** ver um guia de primeiros passos  
**Para que** saiba como começar a usar o sistema

### Critérios de Aceitação

- [ ] Card "Primeiros Passos" visível apenas quando:
  - Usuário tem 0 transações OU
  - Conta criada há menos de 7 dias
- [ ] Checklist interativo:
  - ✓ Conta criada (sempre checked)
  - [ ] Adicionar primeira transação
  - [ ] Explorar categorias
  - [ ] Configurar uma meta (futuro)
- [ ] Cada item é clicável e leva para ação correspondente
- [ ] Pode ser fechado/ocultado (salvar preferência no localStorage)
- [ ] Ícone "?" com tooltip explicativo

### Componente

```bash
src/components/dashboard/onboarding-steps.tsx
```

---

## Story 4.6: Hook para Dados do Dashboard

**Como** desenvolvedor  
**Quero** hook centralizado para dados do dashboard  
**Para que** componentes compartilhem estado e cache

### Critérios de Aceitação

- [ ] Hook `useDashboardData` com React Query
- [ ] Queries separadas:
  - `dashboard-summary`
  - `recent-transactions`
  - `top-categories`
- [ ] staleTime: 5 minutos
- [ ] Refetch on window focus (enabled)
- [ ] Invalidação automática:
  - Ao criar/editar/deletar transação
  - Ao criar/editar/deletar categoria
- [ ] Tipos TypeScript completos

### Arquivo

```bash
src/hooks/use-dashboard-data.ts
```

---

## Story 4.7: Integração Completa da Página Dashboard

**Como** usuário  
**Quero** página dashboard funcional com todos os componentes  
**Para que** tenha visão completa das minhas finanças

### Critérios de Aceitação

- [ ] Página `/dashboard` atualizada com componentes reais
- [ ] Layout responsivo:
  - **Desktop:** 4 cards em linha (grid-cols-4)
  - **Tablet:** 2 cards por linha (md:grid-cols-2)
  - **Mobile:** 1 card por linha
- [ ] Ordem dos elementos:
  1. Header com título e período (ex: "Novembro 2025")
  2. Cards de resumo (4 cards)
  3. Grid 2 colunas:
     - Coluna 1: Transações Recentes
     - Coluna 2: Top Categorias
  4. Onboarding Steps (se aplicável)
- [ ] Loading states coordenados
- [ ] Error boundaries
- [ ] Botão "Atualizar" manual (opcional)

### Layout

```bash
src/app/(dashboard)/dashboard/page.tsx (atualizar)
```

### Estrutura Visual

```
┌─────────────────────────────────────────┐
│  Dashboard - Novembro 2025              │
├────────┬────────┬────────┬──────────────┤
│ 💰 R$  │ 💸 R$  │ 📊 R$  │ 📈 50        │
│ 5.000  │ 3.200  │ 1.800  │ transações   │
│ +12%   │ +5%    │ +25%   │ +8%          │
└────────┴────────┴────────┴──────────────┘
┌──────────────────────┬───────────────────┐
│ Transações Recentes  │ Top Categorias    │
│                      │                   │
│ 🍔 Almoço  R$ 45     │ ████████ R$ 1.2k  │
│ 💼 Freelance R$ 500  │ ██████ R$ 800     │
│ 🚗 Uber  R$ 30       │ ████ R$ 500       │
│                      │                   │
│ [Ver todas →]        │ [Ver relatório →] │
└──────────────────────┴───────────────────┘
┌─────────────────────────────────────────┐
│ 🎯 Primeiros Passos                     │
│ ✓ Conta criada                          │
│ ○ Adicionar transação                   │
│ ○ Explorar categorias                   │
└─────────────────────────────────────────┘
```

---

## Dependências

- ✅ Epic 3 (Story 3.1, 3.2) - Transações API
- ✅ Epic 3 (Story 3.8) - Componentes de gráficos (reutilizar)
- ❌ Epic 6 (Story 6.x) - Metas (opcional, card mostra 0/0)

---

## Checklist de Implementação

### Story 4.1 - API

- [ ] `/api/dashboard/summary/route.ts` - agregações com Prisma
- [ ] `/api/dashboard/recent-transactions/route.ts` - últimas 10
- [ ] `/api/dashboard/top-categories/route.ts` - top 5 despesas
- [ ] Cache KV implementado
- [ ] Tipos TypeScript

### Story 4.2 - Summary Cards

- [ ] `summary-cards.tsx` - 4 cards com variação
- [ ] Ícones lucide-react
- [ ] Formatação de moeda
- [ ] Loading skeleton
- [ ] Testes manuais

### Story 4.3 - Recent Transactions

- [ ] `recent-transactions.tsx` - lista com 5-10 items
- [ ] Formatação de data relativa (date-fns)
- [ ] Link para `/dashboard/transactions`
- [ ] Empty state

### Story 4.4 - Top Categories Chart

- [ ] `top-categories-chart.tsx` ou reutilizar existente
- [ ] Gráfico horizontal
- [ ] Link para `/dashboard/stats`

### Story 4.5 - Onboarding Steps

- [ ] `onboarding-steps.tsx` - checklist interativo
- [ ] Lógica de visibilidade (localStorage)
- [ ] Links para ações

### Story 4.6 - Hook

- [ ] `use-dashboard-data.ts` - 3 queries React Query
- [ ] Invalidação em mutations
- [ ] Tipos completos

### Story 4.7 - Integração

- [ ] Atualizar `/dashboard/page.tsx`
- [ ] Layout responsivo
- [ ] Coordenar loading states
- [ ] Error handling

---

## Métricas de Sucesso

- [ ] Tempo de carregamento < 2s
- [ ] Todas as métricas mostram dados reais
- [ ] Cache funciona (não refaz queries desnecessariamente)
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Acessibilidade (aria-labels, keyboard navigation)

---

## Notas Técnicas

### Performance

- Usar `Promise.all()` para buscar dados em paralelo
- Cache agressivo (5min) para reduzir carga no DB
- Pré-calcular agregações quando possível

### Reutilização

- Componentes do Story 3.8 (`stats-cards.tsx`, `categories-chart.tsx`)
- Hooks existentes (`use-transactions.ts`)
- Utilitários de formatação (`lib/format.ts`)

### Futuro

- Story 4.5 pode expandir com mais passos quando Epic 6 (Metas) for implementado
- Adicionar filtro de período no dashboard (trimestre, semestre, ano)
- Exportação PDF do resumo mensal

---

## Status Atual

- **Epic 3.8 implementado:** `/stats` com gráficos completos ✅
- **Dashboard principal:** Ainda com placeholders ❌
- **Próximo:** Implementar Stories 4.1 a 4.7

---

## Estimativa

- **Story 4.1:** 2-3 horas (APIs)
- **Story 4.2:** 1-2 horas (Cards)
- **Story 4.3:** 1 hora (Recent Transactions)
- **Story 4.4:** 30min (Reutilizar componente)
- **Story 4.5:** 1 hora (Onboarding)
- **Story 4.6:** 1 hora (Hook)
- **Story 4.7:** 1-2 horas (Integração)

**Total:** ~8-12 horas (1-2 dias)
