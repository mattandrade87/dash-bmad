# NextAuth.js - Autenticação

## 📋 Visão Geral

Este projeto usa **NextAuth.js v5 (Auth.js)** para autenticação de usuários.

## 🔐 Configuração

### Variáveis de Ambiente

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Para gerar uma chave secreta segura:

```bash
openssl rand -base64 32
```

## 🚀 Recursos Implementados

### ✅ Providers

- **Credentials Provider** - Login com email e senha
- Senhas criptografadas com bcryptjs (10 rounds)

### ✅ Modelos do Prisma

- **User** - Informações do usuário
- **Account** - Contas OAuth (preparado para futuro)
- **Session** - Sessões de usuário
- **VerificationToken** - Tokens de verificação

### ✅ Estratégia de Sessão

- **JWT** - Sessões baseadas em tokens
- Duração: 30 dias
- Token inclui: id, email, name

### ✅ Middleware

- Proteção automática de rotas
- Redirecionamento para `/login` se não autenticado
- Redirecionamento para `/dashboard` se já autenticado

## 📁 Estrutura de Arquivos

```
src/
├── lib/
│   ├── auth.ts              # Configuração do NextAuth
│   └── auth-helpers.ts      # Funções auxiliares
├── app/
│   └── api/
│       └── auth/
│           ├── [...nextauth]/
│           │   └── route.ts # Route handler do NextAuth
│           └── register/
│               └── route.ts # API de registro
├── middleware.ts            # Proteção de rotas
└── types/
    └── next-auth.d.ts       # Tipos TypeScript
```

## 🔧 Uso

### Server Components

```typescript
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello {session.user.name}!</div>;
}
```

### Server Actions

```typescript
"use server";
import { auth } from "@/lib/auth";

export async function myAction() {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Fazer algo com session.user.id
}
```

### Client Components

```typescript
"use client";
import { useSession } from "next-auth/react";

export default function ClientComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello {session.user.name}!</div>;
}
```

## 🔑 Registro de Usuários

### POST /api/auth/register

Cria um novo usuário e categorias padrão.

**Body:**

```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "name": "Nome do Usuário"
  }
}
```

## 🔐 Login

### POST /api/auth/signin/credentials

Use o signIn do NextAuth:

```typescript
import { signIn } from "next-auth/react";

const result = await signIn("credentials", {
  email: "usuario@example.com",
  password: "senha123",
  redirect: false,
});

if (result?.error) {
  console.error(result.error);
}
```

## 🚪 Logout

```typescript
import { signOut } from "next-auth/react";

await signOut({ callbackUrl: "/login" });
```

## 🛡️ Rotas Protegidas

O middleware protege automaticamente todas as rotas exceto:

- `/` (homepage)
- `/login`
- `/signup`
- `/api/auth/*`
- Arquivos estáticos

Para adicionar mais rotas públicas, edite `src/middleware.ts`.

## 🎯 Próximos Passos

- [ ] Adicionar OAuth providers (Google, GitHub)
- [ ] Implementar verificação de email
- [ ] Adicionar recuperação de senha
- [ ] Implementar rate limiting
- [ ] Adicionar 2FA (autenticação de dois fatores)

## 📚 Documentação

- [NextAuth.js v5 Docs](https://authjs.dev/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
