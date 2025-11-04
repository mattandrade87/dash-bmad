# Deploy to Vercel - Guia Completo

## 🚀 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com) (ou outro PostgreSQL)
- Repositório no GitHub conectado
- Vercel CLI instalado (opcional): `npm i -g vercel`

## 📋 Passo a Passo

### 1. Preparar Banco de Dados (Supabase)

1. Criar projeto no Supabase: https://database.new
2. Copiar a **Connection String** (Transaction mode):
   ```
   Settings > Database > Connection String > Transaction
   ```
3. Guardar a string (exemplo):
   ```
   postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
   ```

### 2. Configurar Projeto no Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acessar: https://vercel.com/new
2. Importar repositório: `mattandrade87/dash-bmad`
3. Configurar:

   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. Adicionar **Environment Variables**:

```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres

# NextAuth.js
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=[gerar com: openssl rand -base64 32]

# Vercel KV (Opcional - configurar depois)
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
```

5. Clicar em **Deploy**

#### Opção B: Via CLI

```bash
# Login no Vercel
vercel login

# Deploy
vercel

# Seguir prompts:
# - Set up and deploy? Yes
# - Which scope? Sua conta
# - Link to existing project? No
# - What's your project's name? dash-bmad
# - In which directory is your code located? ./
# - Auto-detected settings? Yes

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Deploy para produção
vercel --prod
```

### 3. Executar Migrações

Após o primeiro deploy:

```bash
# Configurar DATABASE_URL localmente apontando para Supabase
export DATABASE_URL="postgresql://..."

# Executar migrações
npm run prisma:migrate:deploy

# Ou via Prisma CLI
npx prisma migrate deploy
```

**Alternativa:** Usar Prisma Migrate no pipeline CI/CD

### 4. (Opcional) Configurar Vercel KV

1. Acessar: https://vercel.com/dashboard/stores
2. Criar novo **KV Database**
3. Conectar ao projeto `dash-bmad`
4. As variáveis são adicionadas automaticamente:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 5. Verificar Deploy

Acessar a URL do deploy e verificar:

- ✅ Página inicial carrega
- ✅ Cadastro de usuário funciona
- ✅ Login funciona
- ✅ Dashboard protegido por autenticação

## 🔧 Configurações Avançadas

### Custom Domain

1. Ir em: Project Settings > Domains
2. Adicionar domínio customizado
3. Configurar DNS (A record ou CNAME)

### Build Settings

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### Environment Variables por Ambiente

```bash
# Development
vercel env add DATABASE_URL development

# Preview (branches)
vercel env add DATABASE_URL preview

# Production
vercel env add DATABASE_URL production
```

## 📊 Monitoramento

### Vercel Analytics

1. Ativar em: Project Settings > Analytics
2. Gratuito até 100k page views/mês

### Logs

```bash
# Ver logs em tempo real
vercel logs

# Ver logs de uma URL específica
vercel logs [DEPLOYMENT_URL]
```

## 🐛 Troubleshooting

### Build falhando

**Erro:** `Cannot find module '@prisma/client'`

```bash
# Solução: Adicionar postinstall no package.json
"postinstall": "prisma generate"
```

**Erro:** `DATABASE_URL is not defined`

```bash
# Solução: Adicionar variável de ambiente no Vercel
vercel env add DATABASE_URL
```

### Migrações não aplicadas

```bash
# Executar manualmente
npx prisma migrate deploy

# Ou adicionar no build:
"build": "prisma migrate deploy && prisma generate && next build"
```

### NextAuth não funciona

```bash
# Verificar:
1. NEXTAUTH_URL está correto (https://seu-app.vercel.app)
2. NEXTAUTH_SECRET está configurado
3. Callbacks estão corretos no auth.ts
```

## 🔐 Segurança

### Secrets

Nunca commitar:

- ❌ `.env`
- ❌ Senhas de banco
- ❌ API keys
- ❌ NEXTAUTH_SECRET

Sempre usar variáveis de ambiente no Vercel.

### CORS

Se necessário, configurar em `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
      ],
    },
  ];
}
```

## 📈 Performance

### Edge Functions

Algumas rotas podem usar Edge Runtime:

```typescript
export const runtime = "edge";
```

### ISR (Incremental Static Regeneration)

```typescript
export const revalidate = 60; // revalidar a cada 60s
```

### Caching

Vercel CDN cache automático para:

- Static assets
- Pages estáticas
- API routes com cache headers

## 🔄 CI/CD

### GitHub Actions (Opcional)

```yaml
# .github/workflows/vercel-deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
```

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)

## ✅ Checklist de Deploy

- [ ] Banco de dados criado (Supabase/Railway/Neon)
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Migrações executadas
- [ ] Build passou sem erros
- [ ] Página inicial acessível
- [ ] Autenticação funcionando
- [ ] API routes respondendo
- [ ] (Opcional) Domínio customizado configurado
- [ ] (Opcional) Vercel KV configurado
- [ ] (Opcional) Analytics ativado

## 🎉 Pós-Deploy

Após o deploy bem-sucedido:

1. Testar todas as funcionalidades
2. Configurar monitoramento (Sentry, LogRocket)
3. Configurar backup do banco
4. Documentar URL de produção
5. Compartilhar com stakeholders

**URL de Produção:** https://dash-bmad.vercel.app

---

## 🚨 Comandos Rápidos

```bash
# Deploy preview (branch)
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs

# Listar deploys
vercel ls

# Promover preview para produção
vercel promote [DEPLOYMENT_URL]

# Rollback
vercel rollback

# Remover deployment
vercel rm [DEPLOYMENT_URL]
```
