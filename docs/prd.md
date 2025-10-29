# PRD — Dashboard de Finanças Pessoais

## 1. Visão Geral
O Dashboard de Finanças Pessoais é uma aplicação web que permite aos usuários gerenciar suas despesas, receitas, orçamento e metas financeiras de forma intuitiva e segura. O sistema será responsivo e acessível, funcionando em desktop e mobile.

**Objetivos principais:**
- Centralizar todas as informações financeiras do usuário em um único painel.  
- Fornecer gráficos e métricas em tempo real.  
- Permitir categorização de despesas e receitas.  
- Possibilitar o controle de metas financeiras e alertas de limite.  
- Garantir segurança e privacidade dos dados.

---

## 2. Personas / Usuários
1. **Usuário Individual**  
   - Objetivo: Controlar suas finanças pessoais e visualizar gastos.  
   - Necessidade: Dashboard simples e rápido, sem complexidade financeira avançada.

2. **Usuário Avançado / Analista Pessoal**  
   - Objetivo: Monitorar detalhadamente receitas e despesas, criar relatórios.  
   - Necessidade: Mais filtros, exportação de dados e gráficos customizáveis.

---

## 3. Funcionalidades Principais
| Funcionalidade | Descrição | Prioridade |
|----------------|-----------|------------|
| Cadastro/Login de usuário | Autenticação segura com email/senha e/ou OAuth | Alta |
| Painel de resumo | Visualização de saldo, receitas, despesas e metas | Alta |
| Adição de transações | Registrar receita ou despesa com categoria, data e valor | Alta |
| Gráficos e métricas | Gráficos de pizza, linha e barra mostrando evolução financeira | Média |
| Metas financeiras | Configurar limites de gastos e alertas | Média |
| Exportação de dados | Exportar relatórios em CSV ou PDF | Baixa |
| Configurações de conta | Alterar senha, editar perfil | Baixa |

---

## 4. Requisitos Funcionais
1. Usuários podem criar, editar e excluir transações.  
2. O sistema calcula automaticamente o saldo disponível e exibe métricas em tempo real.  
3. Dados devem ser armazenados de forma segura no banco de dados (ex: PostgreSQL ou MySQL).  
4. O dashboard deve ser responsivo e compatível com dispositivos móveis.  
5. O usuário pode filtrar transações por data, categoria e tipo (receita/despesa).  

---

## 5. Requisitos Não Funcionais
- Segurança: Criptografia de senhas (bcrypt), comunicação via HTTPS.  
- Performance: Dashboard deve carregar em menos de 3 segundos para até 500 transações.  
- Escalabilidade: Estrutura preparada para adicionar novos módulos no futuro.  
- Tecnologia sugerida: Next.js + TypeScript + Tailwind CSS no frontend, Node.js + Express no backend, PostgreSQL como banco de dados.  

---

## 6. Critérios de Aceitação
- Todas as funcionalidades principais estão implementadas e testadas.  
- O dashboard mostra informações corretas e atualizadas.  
- Interface responsiva em desktop e mobile.  
- Testes unitários e de integração implementados.  
- Dados do usuário são armazenados de forma segura.  

---

## 7. Roadmap Inicial
1. Setup do projeto (Next.js, Tailwind, TypeScript, Node.js, banco de dados).  
2. Implementação do login e registro de usuário.  
3. Implementação do painel de resumo e adição de transações.  
4. Implementação de gráficos e métricas básicas.  
5. Implementação de metas financeiras e alertas.  
6. Testes unitários e de integração.  
7. Deploy inicial (Vercel ou AWS).  
