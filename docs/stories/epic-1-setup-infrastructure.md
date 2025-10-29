# Epic 1: Setup e Infraestrutura do Projeto

**Prioridade:** Alta  
**Status:** Not Started  
**Estimativa:** 3-5 dias

## Descrição

Configurar toda a infraestrutura do projeto, incluindo repositório, dependências, banco de dados, e ambiente de desenvolvimento.

---

## Story 1.1: Inicializar Projeto Next.js

**Como** desenvolvedor  
**Quero** configurar o projeto Next.js 14 com TypeScript  
**Para que** possa começar a desenvolver a aplicação com a estrutura correta

### Critérios de Aceitação

- [ ] Projeto Next.js 14+ inicializado com App Router
- [ ] TypeScript configurado (v5.3+)
- [ ] ESLint e Prettier configurados
- [ ] Estrutura de pastas criada conforme arquitetura:
  - `src/app/` (App Router)
  - `src/components/`
  - `src/lib/`
  - `src/hooks/`
  - `src/stores/`
  - `src/types/`
- [ ] Git inicializado com .gitignore apropriado
- [ ] README.md com instruções de setup

### Tarefas Técnicas

```bash
# Inicializar projeto
npx create-next-app@latest dash-bmad --typescript --tailwind --app --src-dir

# Instalar dependências base
pnpm add zod date-fns
pnpm add -D @types/node

# Configurar ESLint e Prettier
pnpm add -D eslint-config-prettier prettier
```

### Arquivos de Configuração

- `tsconfig.json` - Strict mode enabled
- `.eslintrc.json` - Next.js + TypeScript rules
- `.prettierrc` - Code formatting rules
- `next.config.js` - Next.js configuration

---

## Story 1.2: Configurar Tailwind CSS e shadcn/ui

**Como** desenvolvedor  
**Quero** configurar Tailwind CSS e shadcn/ui  
**Para que** possa criar interfaces consistentes e acessíveis

### Critérios de Aceitação

- [ ] Tailwind CSS 3.4+ configurado
- [ ] shadcn/ui inicializado
- [ ] Tema customizado configurado (cores, tipografia)
- [ ] Componentes base instalados (Button, Card, Input, Dialog)
- [ ] Dark mode configurado (opcional para v1)
- [ ] Arquivo `globals.css` com estilos base

### Tarefas Técnicas

```bash
# shadcn/ui init
npx shadcn-ui@latest init

# Instalar componentes base
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
```

### Definição de Cores (tema)

```css
:root {
  --primary: #0070f3; /* Azul Vercel */
  --success: #00b894; /* Verde para receitas */
  --danger: #ff6b6b; /* Vermelho para despesas */
  --warning: #fdcb6e; /* Amarelo para alertas */
}
```

---

## Story 1.3: Configurar Prisma e PostgreSQL

**Como** desenvolvedor  
**Quero** configurar Prisma ORM com PostgreSQL (Supabase)  
**Para que** possa gerenciar o banco de dados de forma type-safe

### Critérios de Aceitação

- [ ] Prisma 5.8+ instalado e configurado
- [ ] Conexão com PostgreSQL (Supabase) estabelecida
- [ ] Schema Prisma criado conforme arquitetura:
  - User model
  - Transaction model
  - Category model
  - Goal model
  - Alert model
  - NextAuth models (Account, Session)
- [ ] Primeira migration criada e aplicada
- [ ] Seed script criado com categorias padrão
- [ ] Prisma Client gerado

### Tarefas Técnicas

```bash
# Instalar Prisma
pnpm add prisma @prisma/client
pnpm add -D prisma

# Inicializar Prisma
npx prisma init

# Criar e aplicar migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
```

### Arquivo seed.ts

- Criar categorias padrão de despesas (9 categorias)
- Criar categorias padrão de receitas (4 categorias)

---

## Story 1.4: Configurar NextAuth.js

**Como** desenvolvedor  
**Quero** configurar NextAuth.js para autenticação  
**Para que** usuários possam fazer login de forma segura

### Critérios de Aceitação

- [ ] NextAuth.js 5.0+ instalado
- [ ] Prisma Adapter configurado
- [ ] Credentials Provider configurado (email/senha)
- [ ] Bcrypt configurado para hash de senhas
- [ ] Session strategy configurada (JWT)
- [ ] Callbacks configurados para incluir user.id
- [ ] Páginas customizadas de login/signup definidas
- [ ] Middleware de proteção de rotas configurado

### Tarefas Técnicas

```bash
# Instalar NextAuth e dependências
pnpm add next-auth @next-auth/prisma-adapter
pnpm add bcryptjs
pnpm add -D @types/bcryptjs
```

### Arquivos a Criar

- `src/lib/auth.ts` - NextAuth configuration
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `middleware.ts` - Route protection

---

## Story 1.5: Configurar Zustand para State Management

**Como** desenvolvedor  
**Quero** configurar Zustand para gerenciamento de estado  
**Para que** possa gerenciar estado global de forma simples

### Critérios de Aceitação

- [ ] Zustand 4.4+ instalado
- [ ] Auth store criado (user, isAuthenticated)
- [ ] Transaction store criado (transactions, filters)
- [ ] UI store criado (theme, sidebar state)
- [ ] Persist middleware configurado para auth store
- [ ] TypeScript types definidos para todos os stores

### Tarefas Técnicas

```bash
# Instalar Zustand
pnpm add zustand
```

### Stores a Criar

- `src/stores/auth-store.ts`
- `src/stores/transaction-store.ts`
- `src/stores/ui-store.ts`

---

## Story 1.6: Configurar Vercel KV (Redis) para Caching

**Como** desenvolvedor  
**Quero** configurar Vercel KV para caching  
**Para que** possa cachear métricas do dashboard e melhorar performance

### Critérios de Aceitação

- [ ] Vercel KV configurado no projeto Vercel
- [ ] @vercel/kv SDK instalado
- [ ] Funções helper de cache criadas (get, set, invalidate)
- [ ] TTL configurado para diferentes tipos de cache:
  - Dashboard summary: 5 minutos
  - Time series: 10 minutos
  - Session storage: conforme NextAuth
- [ ] Variáveis de ambiente configuradas

### Tarefas Técnicas

```bash
# Instalar Vercel KV
pnpm add @vercel/kv
```

### Variáveis de Ambiente

```env
KV_URL="..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."
```

---

## Story 1.7: Configurar Testing Framework

**Como** desenvolvedor  
**Quero** configurar Vitest e Playwright  
**Para que** possa escrever testes unitários e E2E

### Critérios de Aceitação

- [ ] Vitest 1.2+ configurado para unit tests
- [ ] React Testing Library configurado
- [ ] Playwright 1.41+ configurado para E2E tests
- [ ] Scripts de teste adicionados ao package.json
- [ ] Exemplo de teste unitário funcionando
- [ ] Exemplo de teste E2E funcionando
- [ ] Coverage configurado

### Tarefas Técnicas

```bash
# Instalar Vitest
pnpm add -D vitest @vitejs/plugin-react
pnpm add -D @testing-library/react @testing-library/jest-dom

# Instalar Playwright
pnpm create playwright
```

### Scripts package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Story 1.8: Deploy Inicial na Vercel

**Como** desenvolvedor  
**Quero** fazer o deploy inicial na Vercel  
**Para que** possa ter um ambiente de staging funcionando

### Critérios de Aceitação

- [ ] Projeto conectado à Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy automático configurado (main branch)
- [ ] Preview deployments configurados
- [ ] Domínio customizado configurado (opcional)
- [ ] Vercel Analytics habilitado
- [ ] Build e deploy bem-sucedidos

### Variáveis de Ambiente na Vercel

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `KV_URL`, `KV_REST_API_URL`, etc.

### Verificações

- [ ] Homepage carrega corretamente
- [ ] Banco de dados acessível
- [ ] NextAuth funcionando
- [ ] Cache funcionando

---

## Definição de Pronto (DoD) para o Epic

- [ ] Todas as stories completadas
- [ ] Projeto roda localmente sem erros
- [ ] Projeto deployado na Vercel
- [ ] Banco de dados configurado e acessível
- [ ] Autenticação funcionando
- [ ] Testes passando
- [ ] Documentação do setup no README.md
- [ ] Variáveis de ambiente documentadas (.env.example)

---

## Dependências Externas

- Conta Vercel (gratuita)
- Conta Supabase (gratuita) ou database PostgreSQL
- Domínio (opcional)

## Riscos

- Problemas de conectividade com Supabase
- Limites de free tier da Vercel
- Configuração incorreta de variáveis de ambiente

## Notas Técnicas

- Seguir estritamente a arquitetura definida em `docs/architecture.md`
- Usar pnpm como package manager
- Manter TypeScript strict mode habilitado
- Todos os commits devem passar pelo CI
