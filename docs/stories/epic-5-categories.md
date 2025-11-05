# Epic 5: Gerenciamento de Categorias

**Prioridade:** Alta  
**Status:** In Progress  
**Estimativa:** 3-4 dias  
**Depende de:** Epic 3 (Transações)

## Descrição

Implementar sistema completo de gerenciamento de categorias personalizadas, permitindo que usuários criem, editem e organizem suas próprias categorias além das padrão.

**Nota:** Categorias padrão já são criadas automaticamente no cadastro (Story 2.x). Este Epic adiciona CRUD completo para customização.

---

## Story 5.1: API de Categorias (CRUD Completo)

**Como** sistema  
**Quero** APIs para gerenciar categorias  
**Para que** usuários possam personalizar suas categorias

### Critérios de Aceitação

- [ ] **GET /api/categories** - Listar categorias do usuário
  - Filtros: type (INCOME/EXPENSE)
  - Include: count de transações vinculadas
  - Ordenação: name (asc)
- [ ] **POST /api/categories** - Criar nova categoria
  - Validação Zod server-side
  - Verificar duplicação (name único por userId)
  - Cor em formato hex (#RRGGBB)
  - Ícone emoji (opcional)
- [ ] **PATCH /api/categories/[id]** - Atualizar categoria
  - Validação parcial
  - Verificar ownership (userId)
  - Não permitir alterar type se houver transações vinculadas
- [ ] **DELETE /api/categories/[id]** - Deletar categoria
  - Verificar ownership
  - **BLOQUEIO:** Não deletar se houver transações vinculadas
  - Retornar erro 400 com contagem de transações
  - Sugerir reassociar transações antes
- [ ] Invalidar cache do dashboard ao modificar

### Tarefas Técnicas

```bash
src/app/api/categories/route.ts
src/app/api/categories/[id]/route.ts
src/lib/validations/category.ts
```

### Schema de Validação

```typescript
export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor deve estar em formato hex"),
  icon: z.string().emoji().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
```

---

## Story 5.2: Página de Listagem de Categorias

**Como** usuário  
**Quero** ver todas as minhas categorias organizadas  
**Para que** possa gerenciá-las facilmente

### Critérios de Aceitação

- [ ] Página `/dashboard/categories` implementada
- [ ] Duas abas/seções:
  - **Receitas** (verde)
  - **Despesas** (vermelho)
- [ ] Cada categoria mostra:
  - Ícone emoji
  - Nome
  - Cor (badge colorido)
  - Contagem de transações vinculadas
  - Ações (editar, deletar)
- [ ] Grid responsivo de cards
- [ ] Botão "Nova Categoria" no header
- [ ] Loading state (skeleton)
- [ ] Empty state por tipo

### Layout

```
┌─────────────────────────────────────────┐
│  Categorias              [+ Nova]       │
├─────────────────────────────────────────┤
│  [Receitas] [Despesas]                  │
├─────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ 💰   │ │ 💼   │ │ 📈   │             │
│  │Salár│ │Freel.│ │Invest│             │
│  │12 ▼  │ │5 ▼   │ │3 ▼   │             │
│  └──────┘ └──────┘ └──────┘             │
└─────────────────────────────────────────┘
```

---

## Story 5.3: Modal/Formulário de Categoria

**Como** usuário  
**Quero** formulário para criar/editar categorias  
**Para que** possa personalizar minhas categorias

### Critérios de Aceitação

- [ ] Modal reutilizável (criar/editar)
- [ ] Campos:
  - **Nome** (input text, max 50 chars)
  - **Tipo** (radio: Receita/Despesa, disabled no edit)
  - **Cor** (color picker com paleta predefinida)
  - **Ícone** (emoji picker ou input text)
- [ ] Validação client-side (React Hook Form + Zod)
- [ ] Preview da categoria em tempo real
- [ ] Mensagens de erro claras
- [ ] Loading state no submit
- [ ] Toast de sucesso/erro

### Paleta de Cores Predefinida

```typescript
const PRESET_COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EF4444", // red
  "#F59E0B", // amber
  "#EC4899", // pink
  "#14B8A6", // teal
  "#F97316", // orange
  "#06B6D4", // cyan
  "#6B7280", // gray
];
```

### Emojis Sugeridos

```typescript
const PRESET_ICONS = {
  income: ["💰", "💼", "📈", "💵", "🏆", "💎", "🎁", "📊"],
  expense: ["🍔", "🚗", "🏠", "🏥", "📚", "🎮", "🛍️", "📱", "✈️", "💳"],
};
```

---

## Story 5.4: Hook para Categorias

**Como** desenvolvedor  
**Quero** hooks centralizados para categorias  
**Para que** componentes compartilhem estado

### Critérios de Aceitação

- [ ] Hook `useCategories` com React Query
  - Queries separadas por tipo (income/expense)
  - staleTime: 10 minutos
  - Refetch on window focus
- [ ] Hook `useCreateCategory` - mutation
- [ ] Hook `useUpdateCategory` - mutation
- [ ] Hook `useDeleteCategory` - mutation
- [ ] Invalidação automática:
  - Invalidar `categories` após mutations
  - Invalidar `dashboard-summary` e `transactions`
- [ ] Otimistic updates (opcional)

### Arquivo

```bash
src/hooks/use-categories.ts
```

---

## Story 5.5: Validação ao Deletar Categoria com Transações

**Como** usuário  
**Quero** ser alertado antes de deletar categoria com transações  
**Para que** não perca dados importantes

### Critérios de Aceitação

- [ ] Modal de confirmação ao deletar
- [ ] Se categoria tem transações:
  - Mostrar contagem: "Esta categoria tem X transações vinculadas"
  - **BLOQUEAR** exclusão
  - Sugerir: "Reassocie as transações a outra categoria primeiro"
  - Link/botão: "Ver transações" (filtro automático)
- [ ] Se categoria não tem transações:
  - Confirmação simples: "Tem certeza?"
  - Permitir exclusão
- [ ] Toast de sucesso após exclusão

---

## Story 5.6: Seletor de Cor Customizado

**Como** usuário  
**Quero** escolher cores visuais para categorias  
**Para que** diferencie facilmente no dashboard

### Critérios de Aceitação

- [ ] Componente `ColorPicker`
- [ ] Paleta com 10+ cores predefinidas
- [ ] Input manual (hex)
- [ ] Preview em tempo real
- [ ] Validação de formato hex
- [ ] Acessível (aria-labels, keyboard navigation)

### Componente

```bash
src/components/categories/color-picker.tsx
```

---

## Story 5.7: Seletor de Ícone (Emoji Picker)

**Como** usuário  
**Quero** escolher emojis para categorias  
**Para que** as identifique visualmente

### Critérios de Aceitação

- [ ] Componente `IconPicker` (simplificado)
- [ ] Emojis predefinidos por tipo (8-10 por tipo)
- [ ] Input manual (emoji)
- [ ] Validação: apenas emojis permitidos
- [ ] Preview em tempo real
- [ ] Fallback: se vazio, usar ícone padrão

**Alternativa:** Usar biblioteca `emoji-picker-react` (opcional)

### Componente

```bash
src/components/categories/icon-picker.tsx
```

---

## Checklist de Implementação

### Story 5.1 - API

- [ ] `/api/categories/route.ts` - GET (list) e POST (create)
- [ ] `/api/categories/[id]/route.ts` - PATCH (update) e DELETE
- [ ] `category.ts` validations
- [ ] Verificação de ownership em todas rotas
- [ ] Bloqueio de delete com transações vinculadas

### Story 5.2 - Listagem

- [ ] `categories/page.tsx` - página com abas
- [ ] `category-card.tsx` - card individual
- [ ] `category-list.tsx` - lista/grid
- [ ] Skeleton loading
- [ ] Empty state

### Story 5.3 - Formulário

- [ ] `category-modal.tsx` - modal reutilizável
- [ ] `category-form.tsx` - formulário com validação
- [ ] Preview da categoria
- [ ] Integração com mutations

### Story 5.4 - Hook

- [ ] `use-categories.ts` - 4 hooks (list, create, update, delete)
- [ ] Invalidações configuradas
- [ ] Tipos TypeScript completos

### Story 5.5 - Validação Delete

- [ ] Modal de confirmação com verificação
- [ ] Mensagem de bloqueio
- [ ] Link para transações filtradas

### Story 5.6 - Color Picker

- [ ] `color-picker.tsx` - seletor de cor
- [ ] Paleta predefinida
- [ ] Input manual hex
- [ ] Preview

### Story 5.7 - Icon Picker

- [ ] `icon-picker.tsx` - seletor de emoji
- [ ] Emojis predefinidos
- [ ] Input manual
- [ ] Validação emoji

---

## Dependências

- ✅ Epic 2 (Story 2.x) - Categorias padrão criadas no cadastro
- ✅ Epic 3 (Transactions) - API existente usa categoryId
- ❌ Biblioteca `emoji-picker-react` (opcional)
- ❌ Biblioteca `react-colorful` (opcional, ou componente custom)

---

## Métricas de Sucesso

- [ ] Usuário consegue criar nova categoria em < 30 segundos
- [ ] CRUD completo funcional
- [ ] Validações impedem dados inválidos
- [ ] Não é possível deletar categorias em uso
- [ ] Interface intuitiva e responsiva

---

## Notas Técnicas

### Performance

- Cache de 10 minutos (categorias mudam pouco)
- Otimistic updates para melhor UX (opcional)

### Segurança

- Verificar ownership em todas operações
- Validação server-side obrigatória
- Sanitização de emojis no backend

### UX

- Preview em tempo real ao criar/editar
- Mensagens de erro claras e acionáveis
- Bloqueio proativo (não deletar com transações)

### Futuro

- Categorias hierárquicas (subcategorias) - Epic futuro
- Importar/exportar categorias
- Templates de categorias por "perfil" (estudante, freelancer, etc.)

---

## Estimativa

- **Story 5.1:** 2-3 horas (API CRUD)
- **Story 5.2:** 2 horas (Página listagem)
- **Story 5.3:** 2-3 horas (Formulário)
- **Story 5.4:** 1 hora (Hooks)
- **Story 5.5:** 1 hora (Validação delete)
- **Story 5.6:** 1-2 horas (Color picker)
- **Story 5.7:** 1-2 horas (Icon picker)

**Total:** ~10-15 horas (1.5-2 dias)

---

## Status Atual

- **Categorias padrão:** Criadas automaticamente no cadastro ✅
- **CRUD API:** Não implementado ❌
- **Página de gerenciamento:** Placeholder ❌
- **Próximo:** Implementar Stories 5.1 a 5.7
