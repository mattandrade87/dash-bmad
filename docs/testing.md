# Testing - Testes Automatizados

## 📋 Visão Geral

Este projeto usa **Vitest** para testes unitários e **Playwright** para testes E2E (end-to-end).

## 🧪 Testes Unitários (Vitest)

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm test -- --watch

# Executar com UI interativa
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

### Estrutura

```
src/
├── lib/
│   └── __tests__/
│       └── utils.test.ts
├── stores/
│   └── __tests__/
│       └── transaction-store.test.ts
└── components/
    └── __tests__/
        └── button.test.tsx
```

### Exemplo de Teste

```typescript
import { describe, it, expect } from "vitest";
import { formatCurrency } from "../utils";

describe("formatCurrency", () => {
  it("deve formatar centavos para BRL", () => {
    expect(formatCurrency(100)).toBe("R$ 1,00");
  });
});
```

### Mocks Disponíveis

- `next/navigation` - useRouter, usePathname, useSearchParams
- `next-auth/react` - useSession, signIn, signOut

## 🎭 Testes E2E (Playwright)

### Executar Testes

```bash
# Instalar navegadores (primeira vez)
npm run playwright:install

# Executar todos os testes E2E
npm run test:e2e

# Executar com UI interativa
npm run test:e2e:ui

# Executar em modo debug
npm run test:e2e:debug

# Executar apenas no Chromium
npx playwright test --project=chromium

# Executar arquivo específico
npx playwright test e2e/homepage.spec.ts
```

### Estrutura

```
e2e/
├── homepage.spec.ts
├── auth.spec.ts
├── transactions.spec.ts
└── dashboard.spec.ts
```

### Exemplo de Teste E2E

```typescript
import { test, expect } from "@playwright/test";

test("deve fazer login", async ({ page }) => {
  await page.goto("/login");

  await page.fill('[name="email"]', "teste@example.com");
  await page.fill('[name="password"]', "teste123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
});
```

## 📊 Cobertura de Código

O projeto está configurado para gerar relatórios de cobertura:

```bash
npm run test:coverage
```

O relatório HTML estará disponível em `coverage/index.html`.

### Metas de Cobertura

- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

## 🔧 Configuração

### vitest.config.ts

Configuração do Vitest com:

- Ambiente jsdom para testes React
- Globals habilitado
- Aliases de path (@/)
- Cobertura com v8

### playwright.config.ts

Configuração do Playwright com:

- 5 projetos (Chrome, Firefox, Safari, Mobile)
- Screenshots e vídeos em falhas
- Servidor de desenvolvimento automático
- Timeout de 30s por teste

### vitest.setup.ts

Setup global para testes:

- @testing-library/jest-dom
- Cleanup automático
- Mocks do Next.js e NextAuth

## 🎯 Boas Práticas

### Testes Unitários

✅ **DO:**

- Testar uma função/componente por vez
- Usar describe para agrupar testes relacionados
- Nomear testes claramente (deve fazer X)
- Mockar dependências externas
- Testar casos de erro

❌ **DON'T:**

- Testar implementação interna
- Fazer testes que dependem de outros
- Mockar tudo (teste integração quando possível)
- Ignorar edge cases

### Testes E2E

✅ **DO:**

- Testar fluxos completos do usuário
- Usar seletores semânticos (getByRole, getByLabel)
- Esperar por elementos antes de interagir
- Limpar dados de teste após execução
- Testar em múltiplos navegadores

❌ **DON'T:**

- Testar lógica de negócio (use testes unitários)
- Usar seletores frágeis (CSS classes)
- Fazer testes muito longos
- Depender de dados fixos em produção

## 📝 Comandos Úteis

```bash
# Vitest
npm test                    # Executar testes unitários
npm test -- --watch        # Modo watch
npm run test:ui            # UI interativa
npm run test:coverage      # Cobertura

# Playwright
npm run test:e2e           # Executar E2E
npm run test:e2e:ui        # UI interativa
npm run test:e2e:debug     # Modo debug
npx playwright codegen     # Gravar testes

# CI/CD
npm test -- --run --coverage  # Testes + cobertura (CI)
npm run test:e2e -- --project=chromium  # E2E apenas Chrome (CI)
```

## 🚀 Integração Contínua

Os testes são executados automaticamente no CI:

```yaml
# .github/workflows/test.yml
- run: npm test -- --run --coverage
- run: npm run test:e2e -- --project=chromium
```

## 📚 Documentação

- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM](https://github.com/testing-library/jest-dom)

## 🐛 Troubleshooting

### Testes falhando localmente

1. Limpar cache: `rm -rf node_modules/.vitest`
2. Reinstalar deps: `npm install`
3. Verificar versões: `npm ls vitest`

### Playwright não encontra navegadores

```bash
npx playwright install --with-deps
```

### Timeout em testes E2E

Aumentar timeout no `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 segundos
```
