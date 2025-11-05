# Epic 6 - Bug Report & Fixes

**Data:** 05/11/2024
**Status:** Em Análise e Correção

---

## 🐛 Problemas Identificados

### 1. ❌ Botão "Estatísticas" não redireciona corretamente

**Problema:**

- Sidebar aponta para `/dashboard/stats`
- Página existe em `/app/(dashboard)/stats/page.tsx`
- **Rota incorreta**: deveria ser `/stats` ao invés de `/dashboard/stats`

**Diagnóstico:**

- Arquivo está em: `src/app/(dashboard)/stats/page.tsx`
- Sidebar link: `/dashboard/stats`
- Layout `(dashboard)` já adiciona `/dashboard` automaticamente
- **Duplicação de `/dashboard` no path**

**Correção:**

- Alterar sidebar.tsx: `/dashboard/stats` → `/stats`

**Commit:** `fix(nav): corrige rota de estatísticas no sidebar`

---

### 2. ❌ Select "Categoria" bloqueado no popup de nova transação

**Problema:**

- Select de categoria não responde a cliques
- Aparentemente desabilitado mesmo quando deveria estar ativo

**Diagnóstico:**

- `transaction-form.tsx` linha 234: `disabled={isSubmitting || filteredCategories.length === 0}`
- Possível problema: categorias não estão carregando
- Hook `useCategories()` pode estar falhando
- Ou `filteredCategories` retornando array vazio

**Investigação necessária:**

1. Verificar se `useCategories()` está retornando dados
2. Verificar se `filteredCategories` está filtrando corretamente
3. Adicionar logs de debug

**Correção proposta:**

- Adicionar loading state visual
- Melhorar feedback quando não há categorias
- Verificar query de categorias

**Commit:** `fix(transactions): corrige select categoria bloqueado`

---

### 3. ❌ Botão "Criar meta" gera erro

**Problema:**

- Erro ao clicar no botão de criar meta
- Modal não abre ou gera erro JavaScript

**Diagnóstico:**

- `goals/page.tsx` - verificar handler `handleNewGoal`
- `goal-modal.tsx` - verificar props e estado inicial
- Possível problema com GoalCard `onViewDetails` prop

**Investigação:**

- Verificar se `onViewDetails` está sendo passado para GoalCard
- Verificar se interface GoalCardProps está correta
- Console errors específicos

**Correção proposta:**

- Adicionar prop `onViewDetails` no GoalCardProps interface
- Garantir que todos handlers estão implementados

**Commit:** `fix(goals): adiciona prop onViewDetails faltante`

---

### 4. ⚠️ Página "Alertas" não implementada

**Status:** Esperado (Epic 7)

**Diagnóstico:**

- Página existe mas mostra placeholder
- Epic 7 (Alertas e Notificações) não foi iniciado
- Comportamento correto: página deve mostrar "Em breve"

**Ação:**

- Melhorar placeholder com UI mais informativa
- Adicionar ícone e CTA "Voltar ao Dashboard"

**Commit:** `feat(alerts): melhora página placeholder de alertas`

---

### 5. ❌ Erro ao criar nova categoria

**Problema:**

- Formulário de categoria retorna erro ao submeter

**Diagnóstico:**

- API `/api/categories` (POST) implementada corretamente
- Validação Zod: `createCategorySchema`
- Possíveis causas:
  1. Validação Zod falhando
  2. Dados não sendo serializados corretamente
  3. Campo obrigatório faltando

**Investigação:**

1. Verificar `category-modal.tsx` - dados enviados
2. Verificar `createCategorySchema` - campos required
3. Testar API diretamente (Postman/cURL)
4. Verificar console logs

**Correção proposta:**

- Adicionar error logging detalhado
- Validar todos campos obrigatórios no form
- Adicionar toast de erro com mensagem específica

**Commit:** `fix(categories): corrige erro ao criar categoria`

---

## 📋 Checklist de Correções

- [ ] **Problema 1:** Corrigir rota Estatísticas
- [ ] **Problema 2:** Desbloquear select Categoria
- [ ] **Problema 3:** Corrigir botão Criar Meta
- [ ] **Problema 4:** Melhorar placeholder Alertas
- [ ] **Problema 5:** Debugar erro criar Categoria
- [ ] Atualizar `architecture.md` com rotas corretas
- [ ] Adicionar logs de debug em pontos críticos
- [ ] Testar fluxo completo CRUD (Categorias, Metas, Transações)
- [ ] Verificar consistência de rotas em todos componentes
- [ ] Executar testes de regressão

---

## 🔍 Próximos Passos

1. **Fase 1: Diagnóstico Completo**

   - Rodar aplicação e reproduzir cada bug
   - Capturar console errors
   - Verificar network requests

2. **Fase 2: Correções Pontuais**

   - Corrigir bugs um por um
   - Commit individual para cada fix
   - Testar após cada correção

3. **Fase 3: Validação**

   - Testar fluxo completo end-to-end
   - Verificar todas rotas funcionando
   - Garantir CRUD completo para todos recursos

4. **Fase 4: Documentação**
   - Atualizar `architecture.md`
   - Atualizar stories com fixes aplicados
   - Criar story de QA se necessário

---

## 📝 Commits Propostos

```bash
# Problema 1 - Estatísticas
git commit -m "fix(nav): corrige rota de estatísticas no sidebar"

# Problema 2 - Categoria select
git commit -m "fix(transactions): corrige select categoria bloqueado no form"

# Problema 3 - Criar Meta
git commit -m "fix(goals): adiciona prop onViewDetails faltante no GoalCard"

# Problema 4 - Alertas
git commit -m "feat(alerts): melhora página placeholder de alertas"

# Problema 5 - Criar Categoria
git commit -m "fix(categories): adiciona error logging e corrige validação"

# Geral
git commit -m "docs(architecture): atualiza rotas e endpoints documentados"
```

---

## 🎯 Épicos Afetados

- **Epic 3:** Transações (select categoria bloqueado)
- **Epic 5:** Categorias (erro ao criar)
- **Epic 6:** Metas (botão criar meta com erro)
- **Epic 7:** Alertas (não implementado - OK)

---

_Relatório gerado em: 05/11/2024_
