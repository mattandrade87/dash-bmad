import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  // Hash da senha
  const hashedPassword = await hashPassword(data.password);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });

  // Criar categorias padrão para o novo usuário
  const defaultCategories = [
    // Receitas
    { name: "Salário", color: "#00B894", icon: "💼", type: "INCOME" as const },
    {
      name: "Freelance",
      color: "#00B894",
      icon: "💻",
      type: "INCOME" as const,
    },
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

    // Despesas
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
    {
      name: "Educação",
      color: "#FF6B6B",
      icon: "📚",
      type: "EXPENSE" as const,
    },
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

  await prisma.category.createMany({
    data: defaultCategories.map((category) => ({
      ...category,
      userId: user.id,
      isDefault: true,
    })),
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      createdAt: true,
    },
  });
}
