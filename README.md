# 💰 Dashboard de Finanças Pessoais

Uma aplicação web moderna e intuitiva para gerenciamento de finanças pessoais, construída com Next.js 16, TypeScript e Tailwind CSS.

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- PostgreSQL (recomendado: Supabase)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/mattandrade87/dash-bmad.git
cd dash-bmad

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar migrações do banco
npm run prisma:migrate

# (Opcional) Popular com dados de exemplo
npm run prisma:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📚 Documentação

- **[PRD](./docs/prd.md)** - Product Requirements Document
- **[Arquitetura](./docs/architecture.md)** - Arquitetura Técnica Completa
- **[User Stories](./docs/stories/README.md)** - Épicos e Stories
- **[Deployment](./docs/deployment.md)** - Guia de Deploy
- **[Testing](./docs/testing.md)** - Testes Automatizados
- **[NextAuth Setup](./docs/nextauth-setup.md)** - Configuração de Autenticação

## 🛠️ Stack Tecnológica

**Frontend:**

- ⚡ Next.js 16 (App Router + Turbopack)
- 📘 TypeScript 5.3+
- 🎨 Tailwind CSS v4
- 🧩 shadcn/ui (Neutral theme)
- 🐻 Zustand (State Management)

**Backend:**

- 🔌 Next.js API Routes
- 🗄️ Prisma ORM 6.18+
- 🐘 PostgreSQL
- 🔐 NextAuth.js v5 (Auth.js)
- ⚡ Vercel KV (Redis cache)

**Testing:**

- ✅ Vitest + React Testing Library
- 🎭 Playwright (E2E)

**Deploy:**

- 🚀 Vercel
- 🗄️ Supabase / Railway / Neon

## 🎯 Funcionalidades

- ✅ Autenticação segura com NextAuth.js
- ✅ Gestão de transações (receitas/despesas)
- ✅ Dashboard com métricas em tempo real
- ✅ Categorias customizadas com ícones
- ✅ Metas financeiras com progresso
- ✅ Alertas e notificações
- ✅ Filtros avançados e busca
- ✅ Cache inteligente com Redis
- ✅ Tema light/dark/system
- 🚧 Exportação de dados (CSV/PDF) - Em breve
- 🚧 Gráficos interativos - Em breve

## 🧪 Scripts

```bash
# Desenvolvimento
npm run dev                    # Servidor Next.js
npm run prisma:studio          # Prisma Studio (DB UI)

# Build
npm run build                  # Build produção
npm start                      # Start produção

# Database
npm run prisma:generate        # Gerar Prisma Client
npm run prisma:migrate         # Criar/aplicar migração
npm run prisma:migrate:deploy  # Aplicar em produção
npm run prisma:seed            # Popular com dados

# Testes
npm test                       # Testes unitários
npm run test:ui                # Testes com UI
npm run test:coverage          # Cobertura
npm run test:e2e               # Testes E2E
npm run test:e2e:ui            # E2E com UI

# Qualidade
npm run lint                   # ESLint
```

## 🚀 Deploy

### Deploy Rápido no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mattandrade87/dash-bmad)

### Deploy Manual

1. Criar banco PostgreSQL (Supabase/Railway/Neon)
2. Configurar variáveis de ambiente no Vercel
3. Conectar repositório GitHub
4. Deploy automático!

Consulte o [Guia de Deploy](./docs/deployment.md) completo.

## 📊 Status do Projeto

**Versão:** 0.1.0 (Epic 1 Completo ✅)  
**Status:** 🚧 Em Desenvolvimento Ativo

### Epic 1: Setup e Infraestrutura ✅ (100%)

- ✅ 1.1: Next.js Project Setup
- ✅ 1.2: Tailwind CSS + shadcn/ui
- ✅ 1.3: Prisma + PostgreSQL
- ✅ 1.4: NextAuth.js v5
- ✅ 1.5: Zustand State Management
- ✅ 1.6: Vercel KV (Redis)
- ✅ 1.7: Testing (Vitest + Playwright)
- ✅ 1.8: Vercel Deployment

### Próximos Épicos

- 🔄 Epic 2: Autenticação (0/9 stories)
- ⏳ Epic 3: Transações CRUD (0/10 stories)
- ⏳ Epic 4: Dashboard (0/8 stories)
- ⏳ Epic 5: Categorias (0/6 stories)
- ⏳ Epic 6: Metas (0/7 stories)
- ⏳ Epic 7: Alertas (0/5 stories)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autor

**Mateus Andrade**

- GitHub: [@mattandrade87](https://github.com/mattandrade87)

---

Desenvolvido com ❤️ usando BMAD (Build, Measure, Architect, Deliver)
