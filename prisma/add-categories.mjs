/**
 * Script para adicionar categorias padrão para o usuário atual
 *
 * FIX: ES Modules compatibility
 * Renomeado de .js para .mjs para suportar import/export syntax
 *
 * Uso: node prisma/add-categories.mjs
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const defaultCategories = [
  // Receitas (Income)
  { name: "Salário", color: "#00B894", icon: "💼", type: "INCOME" },
  { name: "Freelance", color: "#00B894", icon: "💻", type: "INCOME" },
  { name: "Investimentos", color: "#00B894", icon: "📈", type: "INCOME" },
  { name: "Outras Receitas", color: "#00B894", icon: "💰", type: "INCOME" },

  // Despesas (Expenses)
  { name: "Alimentação", color: "#FF6B6B", icon: "🍔", type: "EXPENSE" },
  { name: "Transporte", color: "#FF6B6B", icon: "🚗", type: "EXPENSE" },
  { name: "Moradia", color: "#FF6B6B", icon: "🏠", type: "EXPENSE" },
  { name: "Saúde", color: "#FF6B6B", icon: "⚕️", type: "EXPENSE" },
  { name: "Educação", color: "#FF6B6B", icon: "📚", type: "EXPENSE" },
  { name: "Lazer", color: "#FF6B6B", icon: "🎮", type: "EXPENSE" },
  { name: "Compras", color: "#FF6B6B", icon: "🛍️", type: "EXPENSE" },
  { name: "Contas", color: "#FF6B6B", icon: "📄", type: "EXPENSE" },
  { name: "Outras Despesas", color: "#FF6B6B", icon: "💸", type: "EXPENSE" },
];

async function addCategories() {
  try {
    console.log("🔍 Buscando todos os usuários...");

    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log("❌ Nenhum usuário encontrado no banco de dados!");
      console.log(
        "💡 Dica: Faça login no sistema primeiro para criar um usuário."
      );
      return;
    }

    console.log(`✅ Encontrados ${users.length} usuário(s)\n`);

    for (const user of users) {
      console.log(
        `📂 Adicionando categorias para: ${user.email || user.name || user.id}`
      );

      // Verificar categorias existentes
      const existingCategories = await prisma.category.findMany({
        where: { userId: user.id },
      });

      console.log(`   Categorias existentes: ${existingCategories.length}`);

      let created = 0;
      let skipped = 0;

      for (const category of defaultCategories) {
        // Verificar se categoria já existe
        const exists = existingCategories.some(
          (c) => c.name === category.name && c.type === category.type
        );

        if (!exists) {
          await prisma.category.create({
            data: {
              ...category,
              userId: user.id,
              isDefault: true,
            },
          });
          created++;
        } else {
          skipped++;
        }
      }

      console.log(`   ✅ Criadas: ${created} | ⏭️  Ignoradas: ${skipped}\n`);
    }

    console.log("🎉 Processo concluído com sucesso!");

    // Mostrar resumo final
    const totalCategories = await prisma.category.count();
    console.log(`\n📊 Total de categorias no banco: ${totalCategories}`);
  } catch (error) {
    console.error("❌ Erro ao adicionar categorias:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addCategories();
