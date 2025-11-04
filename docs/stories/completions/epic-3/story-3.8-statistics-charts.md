# Story 3.8: Estatísticas e Gráficos

**Status:** ✅ CONCLUÍDA  
**Data:** 04/11/2025  
**Desenvolvedor:** BMAD DEV Agent (James)

---

## 📋 Resumo

Implementação de página de estatísticas com gráficos interativos para visualização de dados financeiros, incluindo evolução mensal, top categorias, cards de resumo e indicadores de variação.

---

## ✨ Funcionalidades Implementadas

### 1. API de Estatísticas (`api/transactions/stats/route.ts`)

**Endpoint:** `GET /api/transactions/stats?months=6`

**Funcionalidades:**

- ✅ Cálculo de totais (receitas, despesas, saldo)
- ✅ Evolução mensal (últimos N meses)
- ✅ Top 5 categorias por despesas
- ✅ Variação percentual (mês atual vs anterior)
- ✅ Agregação de dados por mês
- ✅ Filtro por período personalizável

**Retorno:**

```typescript
{
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  },
  monthlyEvolution: Array<{
    month: string; // "2025-11"
    income: number;
    expense: number;
    balance: number;
  }>,
  topCategories: Array<{
    name: string;
    total: number;
    color: string;
  }>,
  variation: {
    income: number; // Percentual
    expense: number; // Percentual
  },
  period: {
    startDate: string;
    endDate: string;
    months: number;
  }
}
```

### 2. Hook Customizado (`hooks/use-transaction-stats.ts`)

**Funcionalidades:**

- ✅ React Query integration
- ✅ Cache de 5 minutos
- ✅ Parâmetro `months` configurável
- ✅ Tratamento de erros
- ✅ Loading states

**Uso:**

```typescript
const { data, isLoading, error } = useTransactionStats({ months: 6 });
```

### 3. Cards de Resumo (`components/stats/stats-cards.tsx`)

**4 Cards:**

1. **Receitas** (verde)

   - Total de receitas
   - Variação vs mês anterior (↑/↓)
   - Ícone: TrendingUp

2. **Despesas** (vermelho)

   - Total de despesas
   - Variação vs mês anterior (↑/↓)
   - Ícone: TrendingDown

3. **Saldo** (dinâmico)

   - Saldo (receitas - despesas)
   - Cor verde (positivo) ou vermelho (negativo)
   - Ícone: DollarSign

4. **Transações** (neutro)
   - Total de transações no período
   - Ícone: Activity

**Features:**

- Formatação monetária (R$)
- Indicadores de tendência (↑ +10% / ↓ -5%)
- Cores semânticas
- Responsivo (grid 4 colunas → 1 coluna mobile)

### 4. Gráfico de Evolução Mensal (`components/stats/monthly-chart.tsx`)

**Tipo:** Line Chart (Recharts)

**3 Linhas:**

- 🟢 **Receitas** (verde)
- 🔴 **Despesas** (vermelho)
- 🔵 **Saldo** (azul)

**Features:**

- ✅ Eixo X: Meses (formato "Nov/25")
- ✅ Eixo Y: Valores em R$
- ✅ Grid tracejado
- ✅ Tooltip customizado (formatação monetária)
- ✅ Legenda interativa
- ✅ Pontos marcadores (dots)
- ✅ Responsivo (ResponsiveContainer)
- ✅ Tema adaptável (dark/light)

**Altura:** 350px

### 5. Gráfico de Top Categorias (`components/stats/categories-chart.tsx`)

**Tipo:** Horizontal Bar Chart (Recharts)

**Features:**

- ✅ Top 5 categorias por despesas
- ✅ Barras com cores das categorias
- ✅ Valores formatados (R$)
- ✅ Eixo Y: Nomes das categorias
- ✅ Eixo X: Valores monetários
- ✅ Tooltip customizado
- ✅ Cantos arredondados (radius)
- ✅ Empty state ("Nenhuma despesa registrada")

**Altura:** 300px

### 6. Página de Estatísticas (`app/(dashboard)/stats/page.tsx`)

**Layout:**

- 🔝 Header com título + seletor de período
- 📊 4 Cards de resumo (grid)
- 📈 Gráfico de evolução mensal (full width)
- 📊 Gráfico de top categorias (full width)

**Seletor de Período:**

- Últimos 3 meses
- Últimos 6 meses (padrão)
- Último ano
- Últimos 2 anos

**States:**

- Loading (spinner centralizado)
- Error (mensagem amigável)
- Empty (gráficos com mensagem)
- Success (gráficos renderizados)

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
┌──────────────┐
│ Stats Page   │ (Client Component)
└──────┬───────┘
       │ useTransactionStats({ months: 6 })
       ▼
┌──────────────┐
│ React Query  │ (Hook)
└──────┬───────┘
       │ fetch('/api/transactions/stats?months=6')
       ▼
┌──────────────┐
│ API Route    │ (Server)
└──────┬───────┘
       │ Prisma queries
       ▼
┌──────────────┐
│ PostgreSQL   │ (Database)
└──────────────┘
       │ transactions data
       ▼
┌──────────────┐
│ Data         │ (Aggregation)
│ Processing   │
└──────┬───────┘
       │ summary, evolution, categories
       ▼
┌──────────────┐
│ Recharts     │ (Visualization)
└──────────────┘
```

### Cálculos na API

**1. Totais:**

```typescript
totalIncome = transactions
  .filter((t) => t.type === "INCOME")
  .reduce((sum, t) => sum + t.amountCents, 0);
```

**2. Evolução Mensal:**

```typescript
// Agrupar por mês (yyyy-MM)
transactions.forEach((t) => {
  const month = format(t.date, "yyyy-MM");
  monthlyData[month].income += t.amountCents;
});
```

**3. Top Categorias:**

```typescript
// Agrupar por categoria, ordenar, pegar top 5
Object.values(categoryExpenses)
  .sort((a, b) => b.total - a.total)
  .slice(0, 5);
```

**4. Variação:**

```typescript
variation = ((atual - anterior) / anterior) * 100;
```

---

## 🎨 Detalhes Visuais

### Cores

**Receitas:**

- Primary: `hsl(142, 76%, 36%)` (verde)
- Uso: Linha do gráfico, card de receitas

**Despesas:**

- Primary: `hsl(0, 84%, 60%)` (vermelho)
- Uso: Linha do gráfico, card de despesas

**Saldo:**

- Primary: `hsl(221, 83%, 53%)` (azul)
- Uso: Linha do gráfico
- Dinâmico: Verde (positivo) / Vermelho (negativo) no card

### Responsividade

**Desktop (≥1024px):**

- Cards: Grid 4 colunas
- Gráficos: 2 colunas (evolução span 2)

**Tablet (768-1023px):**

- Cards: Grid 2 colunas
- Gráficos: 1 coluna

**Mobile (<768px):**

- Cards: Grid 1 coluna (stack)
- Gráficos: 1 coluna
- Gráficos redimensionam automaticamente

---

## 📁 Arquivos Criados/Modificados

### ✅ Arquivos Criados (6)

1. **`src/app/api/transactions/stats/route.ts`** (~165 linhas)

   - API endpoint para estatísticas
   - Agregações e cálculos

2. **`src/hooks/use-transaction-stats.ts`** (~70 linhas)

   - Hook React Query
   - Tipagens TypeScript

3. **`src/components/stats/stats-cards.tsx`** (~125 linhas)

   - 4 Cards de resumo
   - Indicadores de variação

4. **`src/components/stats/monthly-chart.tsx`** (~125 linhas)

   - Line chart de evolução
   - Tooltip customizado

5. **`src/components/stats/categories-chart.tsx`** (~95 linhas)

   - Bar chart horizontal
   - Top 5 categorias

6. **`src/app/(dashboard)/stats/page.tsx`** (~105 linhas)
   - Página principal
   - Seletor de período
   - Layout responsivo

### ✅ Arquivos Modificados (1)

7. **`src/components/layout/sidebar.tsx`**
   - Adicionado link "Estatísticas" com ícone BarChart3
   - Posicionado entre "Transações" e "Metas"

---

## 🧪 Casos de Teste

### Teste Manual

1. **Acessar página:**

   - ✅ Navegar para `/dashboard/stats`
   - ✅ Ver loading spinner
   - ✅ Cards e gráficos renderizam

2. **Mudar período:**

   - ✅ Selecionar "Últimos 3 meses"
   - ✅ Gráficos atualizam
   - ✅ Cards recalculam

3. **Interação com gráficos:**

   - ✅ Hover em pontos do line chart → tooltip
   - ✅ Hover em barras → tooltip
   - ✅ Legenda clicável (ocultar/mostrar linhas)

4. **Empty states:**

   - ✅ Sem transações → "Nenhuma despesa registrada"
   - ✅ Sem categorias → gráfico vazio

5. **Responsividade:**
   - ✅ Mobile: Cards em coluna única
   - ✅ Tablet: 2 colunas
   - ✅ Desktop: 4 colunas

### Validações

- ✅ Valores formatados corretamente (R$ 1.234,56)
- ✅ Datas em português (Nov/25)
- ✅ Variação com sinal correto (+ / -)
- ✅ Cores semânticas (verde = bom, vermelho = ruim)
- ✅ Saldo negativo em vermelho

---

## 🚀 Como Usar

### Para Usuários

1. **Acessar estatísticas:**

   - Clicar em "Estatísticas" no menu lateral
   - Ou navegar para `/dashboard/stats`

2. **Escolher período:**

   - Usar seletor no canto superior direito
   - Opções: 3, 6, 12 ou 24 meses

3. **Analisar dados:**

   - **Cards**: Visão rápida de totais
   - **Evolução**: Tendências ao longo do tempo
   - **Top categorias**: Onde mais se gasta

4. **Exportar dados:**
   - (Futuro) Botão para exportar gráficos como imagem

### Para Desenvolvedores

```typescript
// Usar hook em qualquer componente
import { useTransactionStats } from "@/hooks/use-transaction-stats";

function MyComponent() {
  const { data, isLoading } = useTransactionStats({ months: 12 });

  return <div>{data?.summary.balance}</div>;
}
```

---

## 📊 Métricas

- **Arquivos criados:** 6
- **Arquivos modificados:** 1
- **Linhas de código:** ~685 linhas
- **Componentes:** 3 (StatsCards, MonthlyChart, CategoriesChart)
- **Hooks:** 1 (useTransactionStats)
- **API Routes:** 1 (GET /api/transactions/stats)
- **Dependências:** recharts

---

## 🔄 Integração com Sistema

### Cache e Performance

- ✅ React Query cache: 5 minutos
- ✅ Refetch automático ao criar/editar/deletar transação
- ✅ Invalidação de cache: `queryClient.invalidateQueries(['transaction-stats'])`

### Segurança

- ✅ Autenticação via NextAuth
- ✅ Apenas transações do usuário logado
- ✅ API route protegida (auth middleware)

### Dados

- ✅ Valores em centavos (int) no DB
- ✅ Conversão para reais (float) apenas na UI
- ✅ Agregações no servidor (performance)
- ✅ Prisma ORM para queries seguras

---

## 🎯 Melhorias Futuras

1. **Comparação de Períodos:**

   - Selecionar 2 períodos para comparar
   - Gráfico de diferença

2. **Mais Gráficos:**

   - Pizza chart (proporção de categorias)
   - Área chart (acumulado)
   - Heatmap (gastos por dia da semana)

3. **Filtros:**

   - Filtrar por tipo (receita/despesa)
   - Filtrar por categoria específica
   - Incluir/excluir categorias

4. **Exportação:**

   - Download de gráficos (PNG/SVG)
   - Relatório PDF
   - Compartilhar via link

5. **Insights Automáticos:**

   - "Você gastou 20% a mais esse mês"
   - "Sua maior despesa foi X"
   - Sugestões de economia

6. **Metas Visuais:**
   - Linha de meta no gráfico
   - Indicador de progresso

---

## ✅ Definição de Pronto

- [x] API de estatísticas funcional
- [x] Hook customizado criado
- [x] 4 Cards de resumo implementados
- [x] Gráfico de evolução mensal criado
- [x] Gráfico de top categorias criado
- [x] Página de estatísticas completa
- [x] Link no sidebar
- [x] Seletor de período funcional
- [x] Loading e error states
- [x] Responsivo (mobile, tablet, desktop)
- [x] Tooltips customizados
- [x] Formatação monetária PT-BR
- [x] Sem erros de compilação
- [x] Documentação criada

---

## 🏁 Conclusão

Story 3.8 implementa sistema completo de visualização de dados financeiros com gráficos interativos usando Recharts. Os usuários agora podem analisar suas finanças de forma visual e intuitiva, identificando padrões e tendências ao longo do tempo.

**Próxima story:** 3.9 - Duplicar Transação
