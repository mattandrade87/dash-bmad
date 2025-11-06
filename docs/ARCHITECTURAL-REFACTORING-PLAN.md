# 🏗️ PLANO DE REFATORAÇÃO ARQUITETURAL

**Projeto:** Dashboard de Finanças Pessoais (dash-bmad)  
**Data:** 06/11/2025  
**Autor:** QA/Architect Agent (Winston)  
**Status:** 📝 Proposta  
**Versão:** 1.0

---

## 📊 ANÁLISE EXECUTIVA DO ESTADO ATUAL

### Métricas do Projeto

| Métrica                 | Valor    | Status          |
| ----------------------- | -------- | --------------- |
| **Arquivos TypeScript** | ~120+    | 🟡 Médio        |
| **Diretórios**          | ~50+     | 🟡 Médio        |
| **Componentes**         | ~60+     | 🟢 Bom          |
| **Hooks Customizados**  | 7        | 🟢 Bom          |
| **API Routes**          | ~20+     | 🟢 Bom          |
| **Stores (Zustand)**    | 4        | 🟡 Subutilizado |
| **Complexidade**        | Moderada | 🟢 Gerenciável  |

### Stack Tecnológica

```yaml
Frontend:
  - Next.js 16.0.1 (App Router)
  - React 19.2.0
  - TypeScript 5.x
  - Tailwind CSS 4.x
  - React Hook Form + Zod
  - TanStack Query (React Query)
  - Zustand (state management)

Backend:
  - Next.js API Routes
  - Prisma 6.18.0 (ORM)
  - PostgreSQL
  - NextAuth 5.0 (beta)
  - Vercel KV (cache)

Tools:
  - Vitest (unit tests)
  - Playwright (E2E)
  - ESLint
  - React Compiler (experimental)
```

---

## 🔍 CAUSAS RAIZ DOS BUGS IDENTIFICADOS

### 1. **React Compiler Experimental Habilitado Globalmente**

**Problema Encontrado:**

```typescript
// next.config.ts
reactCompiler: true; // ❌ Habilitado globalmente
```

**Impacto:**

- 3 componentes com incompatibilidade (`watch()` do React Hook Form)
- Warnings constantes de compilação
- Desenvolvimento mais lento
- Comportamento imprevisível

**Causa Raiz:**

- React Compiler ainda é **experimental** (não production-ready)
- Não é compatível com todas as bibliotecas
- Foi habilitado sem análise de compatibilidade
- Sem estratégia de adoção gradual

**Consequências:**

- Time perdeu tempo debugando warnings
- Solução paliativa com `"use no memo"` em cada arquivo
- Manutenção adicional

---

### 2. **Inconsistência na Estrutura de Rotas**

**Problema Encontrado:**

```
src/app/(dashboard)/
  ├── dashboard/
  │   ├── goals/        ← Dentro de dashboard/
  │   ├── stats/        ← Movido recentemente
  │   ├── alerts/
  │   ├── categories/
  │   └── settings/
  ├── transactions/     ← Fora de dashboard/
  └── layout.tsx
```

**Impacto:**

- Confusão sobre onde criar novas rotas
- Bug de rota `/stats` vs `/dashboard/stats`
- Inconsistência arquitetural
- Dificulta onboarding de novos devs

**Causa Raiz:**

- Falta de **convenção de estrutura de pastas**
- Route groups do Next.js mal utilizados
- Criação ad-hoc de rotas sem planejamento
- Sem documentação de padrões

**Consequências:**

- Necessário mover arquivos (stats)
- Possíveis bugs similares no futuro
- Manutenção mais difícil

---

### 3. **Duplicação de Lógica de Formatação**

**Problema Encontrado:**

```typescript
// Duas implementações IDÊNTICAS:
src / lib / format.ts; // ❌ Duplicado
src / lib / utils.ts - // ❌ Duplicado
  // Ambos exportam:
  formatCurrency() -
  formatDate() -
  formatDateTime();
```

**Impacto:**

- Bugs podem ser corrigidos em um mas não no outro
- Imports inconsistentes
- Confusão sobre qual usar
- Tamanho do bundle aumentado

**Causa Raiz:**

- Refatoração incompleta
- Falta de **barrel exports** organizados
- Sem análise de código duplicado
- Code review não detectou

---

### 4. **Stores (Zustand) Subutilizadas**

**Problema Encontrado:**

```typescript
// Stores definidas mas não usadas:
src/stores/
  ├── auth-store.ts          // ⚠️ Pouco usado
  ├── transaction-store.ts   // ⚠️ Não usado
  ├── goal-store.ts          // ⚠️ Não usado
  └── ui-store.ts            // ✅ Usado

// Ao invés disso, tudo usa React Query
```

**Impacto:**

- Estado duplicado (React Query + Zustand)
- Confusão sobre onde colocar estado
- Stores ocupam espaço sem propósito claro
- Overhead de manutenção

**Causa Raiz:**

- **Decisão arquitetural não clara**: usar TanStack Query OU Zustand, não ambos
- Stores criadas no início mas depois adotou-se React Query
- Sem migração completa
- Código morto não removido

**Consequências:**

- Desenvolvedores não sabem quando usar cada um
- Possível re-fetch desnecessário
- Complexidade aumentada

---

### 5. **Configuração de Validação Inconsistente**

**Problema Encontrado:**

```typescript
// src/lib/validations/category.ts
icon: z.string().min(1, "obrigatório").optional(); // ❌ Contraditório
```

**Impacto:**

- Bugs de validação
- Erros de tipo TypeScript
- Comportamento imprevisível

**Causa Raiz:**

- **Falta de guidelines** para schemas Zod
- Validações criadas sem revisão
- Sem testes de validação
- Copy-paste de schemas sem adaptação

---

### 6. **Organização de lib/ Confusa**

**Problema Encontrado:**

```
src/lib/
  ├── auth.ts               // ❌ Auth config
  ├── auth-helpers.ts       // ❌ Auth helpers
  ├── format.ts             // ❌ Formatters
  ├── utils.ts              // ❌ Formatters + utils
  ├── cache.ts              // ✅ OK
  ├── metrics.ts            // ✅ OK
  ├── prisma.ts             // ✅ OK
  ├── repositories/         // ✅ OK
  ├── utils/                // ❌ Mais utils?
  │   ├── csv.ts
  │   └── recurring.ts
  └── validations/          // ✅ OK
```

**Impacto:**

- Difícil encontrar código
- Imports longos e confusos
- Duplicação não detectada
- Onboarding lento

**Causa Raiz:**

- **Falta de organização modular**
- Crescimento orgânico sem planejamento
- Sem barrel exports (`index.ts`)
- Nomes genéricos (`utils`, `helpers`)

---

### 7. **Scripts Prisma com Problemas de Módulos**

**Problema Encontrado:**

```javascript
// prisma/add-categories.js
import { PrismaClient } from "@prisma/client"; // ❌ ES Modules em .js
```

**Impacto:**

- Script não funciona dependendo do ambiente
- Erro de sintaxe em alguns Node.js
- Necessário renomear para `.mjs`

**Causa Raiz:**

- **package.json sem `"type": "module"`**
- Scripts criados sem testar em ambiente limpo
- Falta de padronização (alguns usam `.ts`, outros `.js`)

---

### 8. **Falta de Barreira de Entrada para Produção**

**Problema Encontrado:**

```typescript
// Logs de debug chegam em produção:
console.log("📝 Dados recebidos:", { email, password }); // ❌ PROD!
console.log("✅ Validação OK");
console.log("🔍 Email já existe?");
```

**Impacto:**

- Logs sensíveis em produção
- Performance degradada
- Possível vazamento de dados

**Causa Raiz:**

- **Sem processo de code review rigoroso**
- Sem linters para detectar `console.log`
- Sem CI/CD com validação
- Debug logs não condicionais a `NODE_ENV`

---

### 9. **Dependências com Versões Beta/Experimental**

**Problema Encontrado:**

```json
{
  "next-auth": "^5.0.0-beta.30", // ❌ Beta
  "babel-plugin-react-compiler": "1.0.0", // ❌ Experimental (React Compiler)
  "zod": "^4.1.12" // ⚠️ Zod v4? (atual é v3)
}
```

**Impacto:**

- Bugs inesperados
- API pode mudar
- Breaking changes sem aviso
- Suporte limitado

**Causa Raiz:**

- **Adoção prematura de tecnologias não estáveis**
- Sem análise de risco
- Sem estratégia de rollback

---

### 10. **Falta de Separação Frontend/Backend**

**Problema Encontrado:**

```
src/
  ├── app/              ← Frontend + API misturados
  │   ├── (dashboard)/  ← Frontend
  │   └── api/          ← Backend
  ├── components/       ← Frontend
  ├── hooks/            ← Frontend
  └── lib/              ← Backend + Shared
```

**Impacto:**

- Difícil identificar o que é frontend vs backend
- Imports cruzados
- Bundle size aumentado (se não for otimizado)
- Testes mais complexos

**Causa Raiz:**

- **Next.js App Router mistura tudo por padrão**
- Sem estratégia de separação
- Sem barrel exports para isolar

---

## 🎯 PLANO DE REFATORAÇÃO (PRIORIZADO)

---

## 🔴 FASE 1: CORREÇÕES CRÍTICAS (Sprint 1 - 3 dias)

### 1.1 ✅ Desabilitar React Compiler (CONCLUÍDO PARCIALMENTE)

**Status:** Parcialmente implementado com `"use no memo"`

**Proposta de Melhoria:**

```typescript
// next.config.ts - RECOMENDADO
const nextConfig: NextConfig = {
  // Desabilitar completamente até React 19 estável
  reactCompiler: false,

  // Ou habilitar apenas em componentes específicos
  experimental: {
    reactCompiler: {
      compilationMode: "annotation", // Apenas componentes com diretiva
    },
  },
};
```

**Arquivos para modificar:**

- ✅ `next.config.ts` - Desabilitar globalmente
- ✅ Remover `"use no memo"` de 3 arquivos (não mais necessário)

**Impacto:** Elimina warnings, melhora DX

---

### 1.2 🔧 Padronizar Estrutura de Rotas

**Proposta:**

```
OPÇÃO A (Recomendada): Tudo em /dashboard/*
src/app/(dashboard)/dashboard/
  ├── page.tsx            → /dashboard
  ├── transactions/       → /dashboard/transactions
  ├── stats/              → /dashboard/stats
  ├── goals/              → /dashboard/goals
  ├── categories/         → /dashboard/categories
  ├── alerts/             → /dashboard/alerts
  └── settings/           → /dashboard/settings

OPÇÃO B: Rotas planas com group
src/app/(dashboard)/
  ├── dashboard/          → /dashboard (home)
  ├── transactions/       → /transactions
  ├── stats/              → /stats
  ├── goals/              → /goals
  └── ...
```

**Decisão:** OPÇÃO A (mais claro, evita conflitos)

**Ações:**

1. Mover `src/app/(dashboard)/transactions/` → `src/app/(dashboard)/dashboard/transactions/`
2. Atualizar `sidebar.tsx` (links)
3. Atualizar middleware de auth (se necessário)
4. Documentar padrão em `architecture.md`

**Arquivos impactados:**

- `src/app/(dashboard)/transactions/` - Mover
- `src/components/layout/sidebar.tsx` - Atualizar links

---

### 1.3 🗑️ Remover Duplicação de Formatters

**Proposta:**

```typescript
// ANTES (duplicado):
src/lib/format.ts        ← Remover
src/lib/utils.ts         ← Manter apenas cn()

// DEPOIS (consolidado):
src/lib/formatters/
  └── index.ts
      ├── formatCurrency()
      ├── formatDate()
      ├── formatDateTime()
      └── ... outros
```

**Implementação:**

```typescript
// src/lib/formatters/index.ts
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

// src/lib/utils.ts (apenas cn)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Ações:**

1. Criar `src/lib/formatters/index.ts`
2. Copiar implementações de `utils.ts`
3. Deletar `src/lib/format.ts`
4. Atualizar imports em todos arquivos:
   - `from "@/lib/utils"` → `from "@/lib/formatters"`
5. Executar: `npm run build` para verificar

---

### 1.4 📦 Organizar lib/ com Barrel Exports

**Proposta:**

```
src/lib/
  ├── index.ts                  ← Barrel export principal
  ├── auth/
  │   ├── index.ts
  │   ├── config.ts             ← auth.ts renomeado
  │   └── helpers.ts
  ├── cache/
  │   ├── index.ts
  │   └── cache.ts
  ├── database/
  │   ├── index.ts
  │   ├── prisma.ts
  │   └── repositories/
  │       ├── index.ts
  │       ├── transaction-repository.ts
  │       └── ...
  ├── formatters/
  │   └── index.ts
  ├── metrics/
  │   └── index.ts
  ├── utils/
  │   ├── index.ts
  │   ├── csv.ts
  │   ├── recurring.ts
  │   └── ...
  └── validations/
      ├── index.ts
      ├── auth.ts
      ├── transaction.ts
      └── ...
```

**Barrel Export Principal:**

```typescript
// src/lib/index.ts
export * from "./auth";
export * from "./cache";
export * from "./database";
export * from "./formatters";
export * from "./metrics";
export * from "./utils";
export * from "./validations";

// Permite:
import { formatCurrency, prisma, cache } from "@/lib";
```

**Benefícios:**

- Imports mais limpos
- Fácil refatorar internalments
- Menos quebras em refatorações
- Melhor tree-shaking

---

### 1.5 🧹 Limpar Código Morto

**Itens para remover/arquivar:**

1. **Stores não utilizadas:**

   ```typescript
   // Se não estão sendo usadas, remover ou documentar
   src / stores / transaction - store.ts; // ⚠️ Verificar uso
   src / stores / goal - store.ts; // ⚠️ Verificar uso
   ```

2. **Components examples:**

   ```
   src/components/examples/  // ⚠️ É necessário?
   ```

3. **Testes vazios:**
   ```
   src/lib/__tests__/        // Verificar se há testes reais
   src/stores/__tests__/
   ```

**Estratégia:**

- Não deletar, mover para `archive/` primeiro
- Documentar decisão em CHANGELOG
- Manter por 1 sprint para rollback se necessário

---

## 🟡 FASE 2: MELHORIAS ESTRUTURAIS (Sprint 2 - 5 dias)

### 2.1 📊 Definir Estratégia de State Management

**Problema:** Confusão entre TanStack Query vs Zustand

**Proposta de Convenção:**

```yaml
TanStack Query:
  Usar para:
    - Server state (dados da API)
    - Cache de requisições
    - Queries e mutations
    - Exemplos: transactions, goals, categories

Zustand:
  Usar para:
    - Client state (UI)
    - Estado global não relacionado a API
    - Exemplos: sidebar, theme, modals
    - Formulários multi-step

React State (useState):
  Usar para:
    - Estado local de componente
    - Toggle simples
    - Form state (com React Hook Form)
```

**Ações:**

1. Documentar convenção em `architecture.md`
2. Auditar uso atual
3. Migrar stores incorretas
4. Remover stores redundantes

**Exemplo prático:**

```typescript
// ✅ BOM - Server state com TanStack Query
const { data: transactions } = useTransactions();

// ✅ BOM - UI state com Zustand
const { isOpen, toggle } = useUIStore();

// ❌ RUIM - Misturar ambos para mesma coisa
const transactions = useTransactionStore(); // Zustand
const { data } = useTransactions(); // React Query (duplicado!)
```

---

### 2.2 🔐 Criar Camada de Serviços

**Problema:** Lógica de negócios misturada com componentes

**Proposta:**

```
src/services/
  ├── index.ts
  ├── auth.service.ts
  ├── transaction.service.ts
  ├── category.service.ts
  └── goal.service.ts
```

**Exemplo:**

```typescript
// src/services/transaction.service.ts
import { prisma } from "@/lib/database";
import { CreateTransactionInput } from "@/lib/validations";

export class TransactionService {
  static async create(userId: string, data: CreateTransactionInput) {
    // Lógica de negócios aqui
    return prisma.transaction.create({
      /* ... */
    });
  }

  static async getMonthlyStats(userId: string, month: number) {
    // Lógica complexa de agregação
    return prisma.$queryRaw`...`;
  }
}

// API Route usa service
export async function POST(request: Request) {
  const user = await requireAuth();
  const data = await request.json();

  const transaction = await TransactionService.create(user.id, data);
  return NextResponse.json(transaction);
}
```

**Benefícios:**

- Lógica testável independentemente
- Reutilização entre API routes
- Fácil migrar para microserviços depois

---

### 2.3 🎨 Padronizar Components com Barrel Exports

**Problema:** Imports muito verbosos

**Antes:**

```typescript
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionModal } from "@/components/transactions/transaction-modal";
```

**Depois:**

```typescript
import {
  TransactionForm,
  TransactionList,
  TransactionModal,
} from "@/components/transactions";
```

**Implementação:**

```typescript
// src/components/transactions/index.ts
export { TransactionForm } from "./transaction-form";
export { TransactionList } from "./transaction-list";
export { TransactionModal } from "./transaction-modal";
export { TransactionItem } from "./transaction-item";
export { TransactionFilters } from "./transaction-filters";
// ... etc
```

**Aplicar em:**

- `components/auth/`
- `components/categories/`
- `components/dashboard/`
- `components/goals/`
- `components/transactions/`
- `components/ui/`

---

### 2.4 📝 Criar Tipos Compartilhados

**Problema:** Tipos definidos inline ou duplicados

**Proposta:**

```
src/types/
  ├── index.ts
  ├── api.types.ts          ← Response types
  ├── models.types.ts       ← Domain models
  ├── form.types.ts         ← Form inputs
  └── ui.types.ts           ← Component props
```

**Exemplo:**

```typescript
// src/types/models.types.ts
export interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  description: string;
  categoryId: string;
  category?: Category;
  date: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
  icon: string | null;
  userId: string;
  isDefault: boolean;
}

// src/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Benefícios:**

- Single source of truth
- Autocomplete melhor
- Refatoração mais segura

---

### 2.5 🧪 Configurar Linters Rigorosos

**Problema:** Código problemático não detectado

**Proposta - ESLint Rules:**

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      // Proibir console.log
      "no-console": ["warn", { allow: ["error", "warn"] }],

      // Forçar uso de const
      "prefer-const": "error",

      // Proibir any
      "@typescript-eslint/no-explicit-any": "error",

      // Imports organizados
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],

      // React Hook dependencies
      "react-hooks/exhaustive-deps": "error",

      // Hooks sempre no topo
      "react-hooks/rules-of-hooks": "error",
    },
  },
];
```

**Adicionar Plugins:**

```json
{
  "devDependencies": {
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

---

## 🟢 FASE 3: OTIMIZAÇÕES (Sprint 3 - 3 dias)

### 3.1 ⚡ Implementar Code Splitting Efetivo

**Proposta:**

```typescript
// Lazy load modais grandes
const TransactionModal = dynamic(
  () => import("@/components/transactions").then((m) => m.TransactionModal),
  { loading: () => <Skeleton />, ssr: false }
);

const GoalDetailsModal = dynamic(
  () => import("@/components/goals").then((m) => m.GoalDetailsModal),
  { ssr: false }
);

// Lazy load páginas de settings
const ProfilePage = dynamic(() => import("./profile/page"));
const SecurityPage = dynamic(() => import("./security/page"));
```

**Benefícios:**

- Bundle size reduzido
- FCP mais rápido
- Melhor Core Web Vitals

---

### 3.2 🗄️ Implementar Database Indexes

**Problema:** Queries lentas sem índices

**Proposta:**

```prisma
// prisma/schema.prisma
model Transaction {
  id          String   @id @default(cuid())
  userId      String
  categoryId  String
  date        DateTime

  // Adicionar índices compostos
  @@index([userId, date])              // Dashboard queries
  @@index([userId, categoryId])        // Filtros por categoria
  @@index([userId, type, date])        // Stats por tipo
}

model Goal {
  id        String   @id @default(cuid())
  userId    String
  deadline  DateTime?

  @@index([userId, deadline])          // Goals próximas do prazo
  @@index([userId, isCompleted])       // Filtro completed
}
```

**Migration:**

```bash
npx prisma migrate dev --name add_performance_indexes
```

---

### 3.3 📦 Bundle Size Analysis

**Adicionar script:**

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "analyze:server": "BUNDLE_ANALYZE=server next build",
    "analyze:browser": "BUNDLE_ANALYZE=browser next build"
  }
}
```

**Instalar:**

```bash
npm install --save-dev @next/bundle-analyzer
```

**Configurar:**

```typescript
// next.config.ts
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
```

---

### 3.4 🔄 Implementar Revalidação Inteligente

**Proposta:**

```typescript
// src/lib/cache/strategies.ts
export const CacheStrategies = {
  // Dados que mudam pouco
  static: {
    revalidate: 3600, // 1 hora
    tags: ["static"],
  },

  // Dados do usuário
  user: {
    revalidate: 300, // 5 minutos
    tags: ["user"],
  },

  // Dados financeiros
  financial: {
    revalidate: 60, // 1 minuto
    tags: ["transactions", "goals", "categories"],
  },
};

// Usar em API routes
export async function GET(request: Request) {
  const data = await getTransactions();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": `s-maxage=${CacheStrategies.financial.revalidate}, stale-while-revalidate`,
    },
  });
}
```

---

## 🔵 FASE 4: DEVELOPER EXPERIENCE (Contínuo)

### 4.1 📚 Documentação Arquitetural

**Criar:**

```
docs/
  ├── architecture/
  │   ├── OVERVIEW.md          ← Visão geral do sistema
  │   ├── CONVENTIONS.md       ← Convenções de código
  │   ├── FOLDER-STRUCTURE.md  ← Estrutura de pastas
  │   ├── STATE-MANAGEMENT.md  ← Quando usar o quê
  │   ├── API-PATTERNS.md      ← Padrões de API
  │   └── TESTING.md           ← Estratégia de testes
  └── CONTRIBUTING.md          ← Guia de contribuição
```

**CONVENTIONS.md exemplo:**

````markdown
# Convenções de Código

## Nomenclatura

### Componentes

- PascalCase: `TransactionForm.tsx`
- Função: `export function TransactionForm() {}`
- Props interface: `interface TransactionFormProps {}`

### Hooks

- camelCase com prefixo `use`: `useTransactions.ts`
- Export: `export function useTransactions() {}`

### Utils/Services

- camelCase: `formatCurrency()`
- Classes: PascalCase: `class TransactionService {}`

## Estrutura de Arquivos

```typescript
// Ordem de imports
import { useState } from "react"; // React
import { useQuery } from "@tanstack/react-query"; // Externas
import { Button } from "@/components/ui"; // Internas UI
import { useTransactions } from "@/hooks"; // Hooks
import { formatCurrency } from "@/lib"; // Utils
import type { Transaction } from "@/types"; // Types

// Ordem dentro do componente
export function MyComponent() {
  // 1. Hooks do React
  const [state, setState] = useState();

  // 2. Hooks customizados
  const { data } = useTransactions();

  // 3. Handlers
  const handleClick = () => {};

  // 4. Effects
  useEffect(() => {}, []);

  // 5. Early returns
  if (!data) return null;

  // 6. Render
  return <div>...</div>;
}
```
````

````

---

### 4.2 🤖 Configurar CI/CD Pipeline

**Proposta - GitHub Actions:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
````

---

### 4.3 🎓 Onboarding para Novos Desenvolvedores

**Criar `QUICK-START.md`:**

````markdown
# Quick Start Guide

## Setup (5 minutos)

```bash
# 1. Clone e instale
git clone <repo>
cd dash-bmad
npm install

# 2. Configure ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Setup banco
npx prisma migrate dev
npx prisma db seed

# 4. Rode o projeto
npm run dev
```
````

## Estrutura do Projeto

```
src/
├── app/            ← Rotas Next.js (páginas + API)
├── components/     ← Componentes React
├── hooks/          ← Hooks customizados
├── lib/            ← Lógica de backend/utils
├── services/       ← Camada de negócios
├── stores/         ← Estado global (Zustand)
└── types/          ← TypeScript types
```

## Convenções

- [x] Use TanStack Query para server state
- [x] Use Zustand apenas para UI state
- [x] Sempre valide com Zod
- [x] Componentes sempre com barrel exports
- [x] Tests obrigatórios para services

## Fluxo de Trabalho

1. Crie branch: `git checkout -b feature/my-feature`
2. Faça mudanças
3. Rode testes: `npm run test`
4. Commit: `git commit -m "feat: add feature"`
5. Push e abra PR

## Comandos Úteis

```bash
npm run dev          # Roda dev server
npm run build        # Build produção
npm run lint         # Roda ESLint
npm run test         # Roda unit tests
npm run test:e2e     # Roda E2E tests
npm run analyze      # Analisa bundle size
```

```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Sprint 1 (Críticas) - 3 dias
- [ ] 1.1 Desabilitar React Compiler globalmente
- [ ] 1.2 Padronizar estrutura de rotas
- [ ] 1.3 Remover duplicação de formatters
- [ ] 1.4 Organizar lib/ com barrel exports
- [ ] 1.5 Limpar código morto (stores, examples)

### Sprint 2 (Estruturais) - 5 dias
- [ ] 2.1 Documentar estratégia state management
- [ ] 2.2 Criar camada de services
- [ ] 2.3 Adicionar barrel exports em components
- [ ] 2.4 Criar tipos compartilhados
- [ ] 2.5 Configurar ESLint rigoroso

### Sprint 3 (Otimizações) - 3 dias
- [ ] 3.1 Implementar code splitting
- [ ] 3.2 Adicionar índices no banco
- [ ] 3.3 Configurar bundle analysis
- [ ] 3.4 Implementar cache strategies

### Sprint 4 (DX) - Contínuo
- [ ] 4.1 Escrever documentação arquitetural
- [ ] 4.2 Configurar CI/CD
- [ ] 4.3 Criar guia de onboarding

---

## 🎯 RESULTADOS ESPERADOS

### Métricas de Sucesso

| Métrica | Antes | Meta | Impacto |
|---------|-------|------|---------|
| **Warnings de compilação** | 5+ | 0 | 🟢 100% |
| **Build time** | ~45s | ~30s | 🟢 33% |
| **Bundle size** | ~500KB | ~350KB | 🟢 30% |
| **Tempo onboarding** | 2 dias | 4 horas | 🟢 75% |
| **Bugs arquiteturais** | 11 | 0 | 🟢 100% |
| **Cobertura de testes** | ~20% | ~60% | 🟢 200% |
| **Duplicação de código** | Alta | Baixa | 🟢 50% |

### Benefícios Qualitativos

✅ **Manutenibilidade:** Estrutura clara e previsível
✅ **Escalabilidade:** Fácil adicionar novas features
✅ **Performance:** Código otimizado e cache efetivo
✅ **DX:** Desenvolvedores mais produtivos
✅ **Qualidade:** Menos bugs em produção
✅ **Onboarding:** Novos devs produtivos rapidamente

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Breaking Changes Durante Refatoração

**Mitigação:**
- Implementar em sprints pequenos
- Testes E2E rodam em cada mudança
- Feature flags para rollback rápido
- Code freeze durante refatoração crítica

### Risco 2: Regressão de Performance

**Mitigação:**
- Lighthouse CI em cada PR
- Bundle size tracking
- Database query profiling
- Load testing antes de deploy

### Risco 3: Resistência da Equipe

**Mitigação:**
- Documentar "porquê" de cada mudança
- Pair programming durante migração
- Office hours para dúvidas
- Celebrar wins pequenos

---

## 📈 ROADMAP DE EXECUÇÃO

```

Semana 1:
├─ Sprint 1.1-1.2 (React Compiler + Rotas)
└─ Sprint 1.3-1.4 (Formatters + Barrel Exports)

Semana 2:
├─ Sprint 1.5 (Código morto)
├─ Sprint 2.1-2.2 (State + Services)
└─ Documentação inicial

Semana 3:
├─ Sprint 2.3-2.5 (Components + Types + Lint)
└─ Sprint 3.1-3.2 (Splitting + DB)

Semana 4:
├─ Sprint 3.3-3.4 (Bundle + Cache)
├─ Sprint 4.1-4.3 (DX + CI/CD)
└─ Review final + Deploy

```

---

## 🔄 PROCESSO DE REVIEW

### Antes de Cada Sprint

1. ✅ Review do plano com tech lead
2. ✅ Estimativa de esforço confirmada
3. ✅ Dependências identificadas
4. ✅ Testes planejados

### Durante o Sprint

1. ✅ Daily sync (15min)
2. ✅ Code review obrigatório (2 approvals)
3. ✅ Tests passando (100%)
4. ✅ Documentação atualizada

### Após Cada Sprint

1. ✅ Retrospectiva (o que funcionou/não funcionou)
2. ✅ Métricas coletadas
3. ✅ Próximo sprint ajustado
4. ✅ Deploy em staging

---

## 📞 CONTATO E SUPORTE

**Documento mantido por:** QA/Architect Agent (Winston)
**Última atualização:** 06/11/2025
**Próxima revisão:** Após Sprint 1

**Para dúvidas:**
- Abra issue no repo com tag `architecture`
- Marque o time em `@team-architecture`

---

## 📚 REFERÊNCIAS

- [Next.js App Router Best Practices](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [TanStack Query vs Zustand](https://tkdodo.eu/blog/react-query-and-forms)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [React Compiler Status](https://react.dev/learn/react-compiler)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**🎉 FIM DO DOCUMENTO**

Este plano é **vivo** e deve ser atualizado conforme o projeto evolui. Feedback é bem-vindo!
```
