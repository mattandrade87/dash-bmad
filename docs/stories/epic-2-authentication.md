# Epic 2: Autenticação e Gerenciamento de Usuários

**Prioridade:** Alta  
**Status:** Not Started  
**Estimativa:** 5-7 dias  
**Depende de:** Epic 1 (Setup e Infraestrutura)

## Descrição

Implementar todo o sistema de autenticação, incluindo cadastro, login, logout, e gerenciamento de perfil de usuário.

---

## Story 2.1: Criar Página de Cadastro (Signup)

**Como** novo usuário  
**Quero** criar uma conta na aplicação  
**Para que** possa começar a gerenciar minhas finanças

### Critérios de Aceitação

- [ ] Página `/signup` criada e estilizada
- [ ] Formulário com campos:
  - Nome completo (obrigatório)
  - Email (obrigatório, validação de formato)
  - Senha (obrigatório, mínimo 8 caracteres)
  - Confirmação de senha (deve ser igual)
- [ ] Validação client-side com Zod + React Hook Form
- [ ] Feedback visual para erros de validação
- [ ] Loading state durante submissão
- [ ] Mensagens de erro claras (email já existe, etc.)
- [ ] Link para página de login
- [ ] Responsivo (mobile e desktop)

### Tarefas Técnicas

```bash
# Estrutura de arquivos
src/app/(auth)/signup/page.tsx
src/components/auth/signup-form.tsx
src/lib/validations/auth.ts
```

### Validação Zod

```typescript
const signupSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
```

### Fluxo

1. Usuário preenche formulário
2. Validação client-side
3. POST para `/api/auth/signup`
4. Hash da senha com bcrypt
5. Criar usuário no banco
6. Criar categorias padrão para o usuário
7. Redirecionar para `/login` com mensagem de sucesso

---

## Story 2.2: Criar API de Cadastro

**Como** sistema  
**Quero** uma API para criar novos usuários  
**Para que** possa processar cadastros de forma segura

### Critérios de Aceitação

- [ ] Endpoint `POST /api/auth/signup` criado
- [ ] Validação server-side com Zod
- [ ] Verificar se email já existe
- [ ] Hash de senha com bcrypt (salt rounds: 10)
- [ ] Criar usuário no banco de dados
- [ ] Criar categorias padrão para o usuário (transaction)
- [ ] Retornar 201 com dados do usuário (sem senha)
- [ ] Retornar 400 para dados inválidos
- [ ] Retornar 409 se email já existe
- [ ] Logs apropriados (sem expor dados sensíveis)

### Tarefas Técnicas

```typescript
// src/app/api/auth/signup/route.ts
export async function POST(request: NextRequest) {
  // 1. Parse e validar body
  // 2. Verificar email único
  // 3. Hash password
  // 4. Usar transaction do Prisma
  // 5. Criar user + categorias padrão
  // 6. Retornar resposta
}
```

### Transaction Prisma

```typescript
await prisma.$transaction(async (tx) => {
  // Criar usuário
  const user = await tx.user.create({...});

  // Criar categorias padrão
  await tx.category.createMany({...});

  return user;
});
```

---

## Story 2.3: Criar Página de Login

**Como** usuário registrado  
**Quero** fazer login na aplicação  
**Para que** possa acessar minha área privada

### Critérios de Aceitação

- [ ] Página `/login` criada e estilizada
- [ ] Formulário com campos:
  - Email (obrigatório)
  - Senha (obrigatório)
  - "Lembrar-me" (opcional, futuro)
- [ ] Validação client-side
- [ ] Loading state durante autenticação
- [ ] Mensagens de erro claras (credenciais inválidas)
- [ ] Link para página de cadastro
- [ ] Link "Esqueci minha senha" (futuro)
- [ ] Redirecionamento para `/dashboard` após sucesso
- [ ] Responsivo (mobile e desktop)

### Tarefas Técnicas

```bash
# Estrutura de arquivos
src/app/(auth)/login/page.tsx
src/components/auth/login-form.tsx
```

### Integração NextAuth

```typescript
import { signIn } from 'next-auth/react';

const handleSubmit = async (data) => {
  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    // Mostrar erro
  } else {
    router.push('/dashboard');
  }
};
```

---

## Story 2.4: Criar Middleware de Proteção de Rotas

**Como** sistema  
**Quero** proteger rotas privadas  
**Para que** apenas usuários autenticados possam acessá-las

### Critérios de Aceitação

- [ ] Middleware configurado em `middleware.ts`
- [ ] Rotas protegidas:
  - `/dashboard`
  - `/transactions`
  - `/goals`
  - `/settings`
  - `/api/*` (exceto `/api/auth/*`)
- [ ] Redirecionamento para `/login` se não autenticado
- [ ] Query param `callbackUrl` preservado
- [ ] Rotas públicas não afetadas (`/`, `/login`, `/signup`)
- [ ] Performance otimizada (verificação rápida de sessão)

### Tarefas Técnicas

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/goals/:path*',
    '/settings/:path*',
    '/api/:path*',
  ],
};
```

### Tratamento de Rotas API

- Rotas `/api/auth/*` devem ser públicas
- Outras rotas API devem verificar session server-side

---

## Story 2.5: Criar Layout Protegido (Dashboard Shell)

**Como** usuário autenticado  
**Quero** uma navegação consistente  
**Para que** possa acessar facilmente todas as funcionalidades

### Critérios de Aceitação

- [ ] Layout `(dashboard)/layout.tsx` criado
- [ ] Header com:
  - Logo/Nome da aplicação
  - Nome do usuário
  - Avatar (iniciais do nome)
  - Menu dropdown (Perfil, Sair)
- [ ] Sidebar com navegação:
  - Dashboard (ícone + texto)
  - Transações
  - Metas
  - Configurações
- [ ] Highlight do item ativo
- [ ] Sidebar responsiva (collapsa em mobile)
- [ ] Verificação de autenticação no server
- [ ] Redirecionamento se não autenticado

### Componentes

```bash
src/app/(dashboard)/layout.tsx
src/components/layout/header.tsx
src/components/layout/sidebar.tsx
src/components/layout/nav-menu.tsx
src/components/layout/user-menu.tsx
```

### Estrutura Layout

```typescript
export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header user={session.user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

## Story 2.6: Implementar Logout

**Como** usuário autenticado  
**Quero** fazer logout da aplicação  
**Para que** possa encerrar minha sessão de forma segura

### Critérios de Aceitação

- [ ] Botão "Sair" no menu do usuário
- [ ] Confirmação antes de fazer logout (opcional)
- [ ] Chamar `signOut()` do NextAuth
- [ ] Limpar stores Zustand (auth, transactions)
- [ ] Redirecionar para página de login
- [ ] Sessão removida do banco de dados
- [ ] Cookie de sessão removido

### Tarefas Técnicas

```typescript
// src/components/layout/user-menu.tsx
import { signOut } from 'next-auth/react';
import { useAuthStore } from '@/stores/auth-store';

const handleLogout = async () => {
  // Limpar stores
  useAuthStore.getState().logout();

  // SignOut NextAuth
  await signOut({ callbackUrl: '/login' });
};
```

---

## Story 2.7: Criar Página de Perfil/Configurações

**Como** usuário autenticado  
**Quero** visualizar e editar meu perfil  
**Para que** possa manter meus dados atualizados

### Critérios de Aceitação

- [ ] Página `/settings` criada
- [ ] Seções:
  - **Perfil:** Nome, Email (read-only por enquanto)
  - **Segurança:** Alterar senha (futuro)
  - **Preferências:** Tema, moeda (futuro)
- [ ] Formulário de edição de nome
- [ ] Validação client-side
- [ ] Loading state durante atualização
- [ ] Mensagem de sucesso/erro
- [ ] Botão "Salvar alterações"

### Tarefas Técnicas

```bash
src/app/(dashboard)/settings/page.tsx
src/components/settings/profile-form.tsx
src/app/api/user/profile/route.ts
```

### API Endpoint

```typescript
// PATCH /api/user/profile
{
  "name": "Novo Nome"
}
```

---

## Story 2.8: Implementar Página de Onboarding

**Como** novo usuário  
**Quero** ver uma página de boas-vindas após o primeiro login  
**Para que** entenda como usar a aplicação

### Critérios de Aceitação

- [ ] Modal/página de onboarding após primeiro login
- [ ] Explicação das funcionalidades principais:
  - Como adicionar transações
  - Como criar metas
  - Como visualizar o dashboard
- [ ] Wizard com 3-4 steps
- [ ] Botão "Pular" e "Próximo"
- [ ] Salvar preferência (não mostrar novamente)
- [ ] Opcional: Tour guiado interativo

### Tarefas Técnicas

```bash
src/components/onboarding/welcome-modal.tsx
src/components/onboarding/onboarding-steps.tsx
```

### Estado Onboarding

- Adicionar campo `onboardingCompleted` no User model (futuro)
- Ou usar localStorage temporariamente

---

## Story 2.9: Testes E2E de Autenticação

**Como** desenvolvedor  
**Quero** testes E2E para fluxo de autenticação  
**Para que** garanta que autenticação funciona corretamente

### Critérios de Aceitação

- [ ] Teste E2E: Cadastro completo
- [ ] Teste E2E: Login com sucesso
- [ ] Teste E2E: Login com credenciais inválidas
- [ ] Teste E2E: Acesso a rota protegida sem autenticação
- [ ] Teste E2E: Logout
- [ ] Teste E2E: Sessão persistente após refresh
- [ ] Todos os testes passando no CI

### Tarefas Técnicas

```typescript
// tests/e2e/auth.spec.ts
test('should register new user', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.fill('[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/login');
});
```

---

## Definição de Pronto (DoD) para o Epic

- [ ] Todas as stories completadas
- [ ] Usuário pode se cadastrar
- [ ] Usuário pode fazer login
- [ ] Usuário pode fazer logout
- [ ] Rotas protegidas funcionando
- [ ] Layout do dashboard implementado
- [ ] Perfil básico funcionando
- [ ] Testes E2E passando
- [ ] Sem vulnerabilidades de segurança conhecidas
- [ ] Code review completo

---

## Segurança

### Checklist de Segurança

- [ ] Senhas com hash bcrypt (salt rounds >= 10)
- [ ] Validação server-side em todos os endpoints
- [ ] Rate limiting em endpoints de auth (futuro)
- [ ] HTTPS em produção
- [ ] Cookies httpOnly e secure
- [ ] CSRF protection (NextAuth cuida disso)
- [ ] SQL injection prevention (Prisma cuida disso)
- [ ] XSS prevention (React cuida disso)

### Variáveis de Ambiente

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

## Dependências

- Epic 1 completo
- NextAuth.js configurado
- Prisma configurado
- shadcn/ui components

## Riscos

- Problemas de CORS em produção
- Session timeout indesejado
- Problemas de cookie em subdomínios

## Métricas de Sucesso

- Tempo de cadastro < 30 segundos
- Tempo de login < 3 segundos
- Taxa de erro de autenticação < 1%
- 100% dos testes E2E passando
