# Prisma - Configuração do Banco de Dados

## 📋 Visão Geral

Este projeto usa **Prisma ORM** para gerenciar o banco de dados PostgreSQL.

## 🗄️ Schema

O schema está localizado em `prisma/schema.prisma` e inclui os seguintes modelos:

- **User** - Usuários do sistema
- **Category** - Categorias de transações (receitas/despesas)
- **Transaction** - Transações financeiras
- **Goal** - Metas financeiras
- **Alert** - Alertas e notificações

## 🚀 Comandos Disponíveis

### Desenvolvimento Local

```bash
# Iniciar servidor Prisma Postgres local
npx prisma dev

# Gerar Prisma Client
npm run prisma:generate

# Criar e aplicar migração
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed

# Abrir Prisma Studio (interface visual)
npm run prisma:studio
```

### Produção

```bash
# Aplicar migrações em produção
npx prisma migrate deploy

# Gerar Prisma Client
npx prisma generate
```

## 🔐 Usuário de Teste

Após executar o seed, você pode usar:

- **Email:** teste@example.com
- **Senha:** teste123

## 📊 Dados de Exemplo

O seed cria automaticamente:

- 1 usuário de teste
- 13 categorias padrão (4 de receita, 9 de despesa)
- 4 transações de exemplo
- 1 meta financeira de exemplo

## 🗂️ Categorias Padrão

### Receitas

- 💼 Salário
- 💻 Freelance
- 📈 Investimentos
- 💰 Outras Receitas

### Despesas

- 🍔 Alimentação
- 🚗 Transporte
- 🏠 Moradia
- ⚕️ Saúde
- 📚 Educação
- 🎮 Lazer
- 🛍️ Compras
- 📄 Contas
- 💸 Outras Despesas

## 🔄 Migrações

As migrações são armazenadas em `prisma/migrations/` e aplicadas automaticamente durante o desenvolvimento.

Para criar uma nova migração após alterar o schema:

```bash
npx prisma migrate dev --name nome_da_migracao
```

## 🌐 Prisma Studio

Para visualizar e editar dados no navegador:

```bash
npm run prisma:studio
```

Isso abrirá uma interface web em `http://localhost:5555`.

## 📝 Tipos TypeScript

O Prisma gera automaticamente tipos TypeScript para todos os modelos. Para usar:

```typescript
import { prisma } from "@/lib/prisma";

// Exemplo: buscar todas as transações
const transactions = await prisma.transaction.findMany({
  include: {
    category: true,
    user: true,
  },
});
```

## ⚠️ Importante

- O arquivo `.env` não está versionado no Git por segurança
- Em produção, use um banco PostgreSQL hospedado (Supabase, Railway, etc.)
- Nunca commite senhas ou chaves de API no código
