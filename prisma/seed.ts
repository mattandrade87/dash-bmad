import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Receitas (Income)
  { name: "Salário", color: "#00B894", icon: "💼", type: "INCOME" as const },
  { name: "Freelance", color: "#00B894", icon: "💻", type: "INCOME" as const },
  {
    name: "Investimentos",
    color: "#00B894",
    icon: "📈",
    type: "INCOME" as const,
  },
  {
    name: "Outras Receitas",
    color: "#00B894",
    icon: "💰",
    type: "INCOME" as const,
  },

  // Despesas (Expenses)
  {
    name: "Alimentação",
    color: "#FF6B6B",
    icon: "🍔",
    type: "EXPENSE" as const,
  },
  {
    name: "Transporte",
    color: "#FF6B6B",
    icon: "🚗",
    type: "EXPENSE" as const,
  },
  { name: "Moradia", color: "#FF6B6B", icon: "🏠", type: "EXPENSE" as const },
  { name: "Saúde", color: "#FF6B6B", icon: "⚕️", type: "EXPENSE" as const },
  { name: "Educação", color: "#FF6B6B", icon: "📚", type: "EXPENSE" as const },
  { name: "Lazer", color: "#FF6B6B", icon: "🎮", type: "EXPENSE" as const },
  { name: "Compras", color: "#FF6B6B", icon: "🛍️", type: "EXPENSE" as const },
  { name: "Contas", color: "#FF6B6B", icon: "📄", type: "EXPENSE" as const },
  {
    name: "Outras Despesas",
    color: "#FF6B6B",
    icon: "💸",
    type: "EXPENSE" as const,
  },
];

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== "production") {
    console.log("🗑️  Limpando dados existentes...");
    await prisma.alert.deleteMany({});
    await prisma.goal.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
  }

  // Criar usuário de teste
  console.log("👤 Criando usuário de teste...");
  const testUser = await prisma.user.create({
    data: {
      email: "teste@example.com",
      password: "$2a$10$8Z4KqjZU5lqKxJ5kzQKQo.Xk7P7vU5R0gQx5W5jZ7jZxYzWvW0fZm", // senha: teste123
      name: "Usuário Teste",
    },
  });

  // Criar categorias padrão para o usuário de teste
  console.log("📂 Criando categorias padrão...");
  for (const category of defaultCategories) {
    await prisma.category.create({
      data: {
        ...category,
        userId: testUser.id,
        isDefault: true,
      },
    });
  }

  // Criar algumas transações de exemplo
  console.log("💳 Criando transações de exemplo...");
  const categories = await prisma.category.findMany({
    where: { userId: testUser.id },
  });

  const salarioCategory = categories.find((c) => c.name === "Salário");
  const alimentacaoCategory = categories.find((c) => c.name === "Alimentação");
  const transporteCategory = categories.find((c) => c.name === "Transporte");

  if (salarioCategory && alimentacaoCategory && transporteCategory) {
    await prisma.transaction.createMany({
      data: [
        {
          description: "Salário Mensal",
          amountCents: 500000, // R$ 5.000,00
          type: "INCOME",
          date: new Date("2025-10-01"),
          categoryId: salarioCategory.id,
          userId: testUser.id,
        },
        {
          description: "Supermercado",
          amountCents: 35000, // R$ 350,00
          type: "EXPENSE",
          date: new Date("2025-10-05"),
          categoryId: alimentacaoCategory.id,
          userId: testUser.id,
        },
        {
          description: "Gasolina",
          amountCents: 20000, // R$ 200,00
          type: "EXPENSE",
          date: new Date("2025-10-10"),
          categoryId: transporteCategory.id,
          userId: testUser.id,
        },
        {
          description: "Restaurante",
          amountCents: 8500, // R$ 85,00
          type: "EXPENSE",
          date: new Date("2025-10-15"),
          categoryId: alimentacaoCategory.id,
          userId: testUser.id,
        },
      ],
    });
  }

  // Criar uma meta de exemplo
  console.log("🎯 Criando meta de exemplo...");
  await prisma.goal.create({
    data: {
      name: "Reserva de Emergência",
      description: "Meta para construir reserva de emergência",
      targetAmount: 1000000, // R$ 10.000,00
      currentAmount: 250000, // R$ 2.500,00
      category: "SAVINGS",
      userId: testUser.id,
      deadline: new Date("2025-12-31"),
    },
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log(`📧 Email de teste: ${testUser.email}`);
  console.log(`🔑 Senha de teste: teste123`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
