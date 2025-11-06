import { cache, CacheKeys, CacheTTL } from "../cache";
import { prisma } from "../database";

/**
 * Tipos de métricas do dashboard
 */
export interface DashboardMetrics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionsCount: number;
  categoriesCount: number;
  goalsCount: number;
  activeGoalsCount: number;
  lastUpdated: string;
}

/**
 * Calcula as métricas do dashboard para um usuário
 */
async function calculateDashboardMetrics(
  userId: string
): Promise<DashboardMetrics> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Buscar transações do mês
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startOfMonth,
      },
    },
  });

  // Calcular totais
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amountCents, 0);

  // Contar recursos
  const [categoriesCount, goalsCount, activeGoalsCount] = await Promise.all([
    prisma.category.count({ where: { userId } }),
    prisma.goal.count({ where: { userId } }),
    prisma.goal.count({
      where: {
        userId,
        isCompleted: false,
      },
    }),
  ]);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionsCount: transactions.length,
    categoriesCount,
    goalsCount,
    activeGoalsCount,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Obtém métricas do dashboard (com cache)
 */
export async function getDashboardMetrics(
  userId: string
): Promise<DashboardMetrics> {
  const cacheKey = CacheKeys.dashboardMetrics(userId);

  // Tentar obter do cache
  const cached = await cache.get<DashboardMetrics>(cacheKey);
  if (cached) {
    return cached;
  }

  // Calcular métricas
  const metrics = await calculateDashboardMetrics(userId);

  // Armazenar no cache
  await cache.set(cacheKey, metrics, CacheTTL.DASHBOARD);

  return metrics;
}

/**
 * Obtém categorias (com cache)
 */
export async function getCachedCategories(userId: string) {
  const cacheKey = CacheKeys.categories(userId);

  // Tentar obter do cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Buscar do banco
  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  // Armazenar no cache
  await cache.set(cacheKey, categories, CacheTTL.CATEGORIES);

  return categories;
}

/**
 * Obtém metas (com cache)
 */
export async function getCachedGoals(userId: string) {
  const cacheKey = CacheKeys.goals(userId);

  // Tentar obter do cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Buscar do banco
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Armazenar no cache
  await cache.set(cacheKey, goals, CacheTTL.GOALS);

  return goals;
}

/**
 * Obtém alertas não lidos (com cache)
 */
export async function getCachedUnreadAlerts(userId: string) {
  const cacheKey = CacheKeys.unreadAlerts(userId);

  // Tentar obter do cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Buscar do banco
  const alerts = await prisma.alert.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Armazenar no cache
  await cache.set(cacheKey, alerts, CacheTTL.ALERTS);

  return alerts;
}
