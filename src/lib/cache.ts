import { kv } from "@vercel/kv";

/**
 * Cliente Vercel KV (Redis) para cache
 *
 * Em produção, usa Vercel KV
 * Em desenvolvimento, funciona com fallback em memória
 */

// Cache em memória para desenvolvimento local
const memoryCache = new Map<string, { value: unknown; expires: number }>();

// Limpar cache expirado a cada 1 minuto
if (process.env.NODE_ENV === "development") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of memoryCache.entries()) {
      if (data.expires < now) {
        memoryCache.delete(key);
      }
    }
  }, 60000);
}

/**
 * Verifica se o KV está configurado
 */
function isKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Cache service com fallback para memória em desenvolvimento
 */
export const cache = {
  /**
   * Obtém um valor do cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (isKVConfigured()) {
        return await kv.get<T>(key);
      }

      // Fallback: memória
      const cached = memoryCache.get(key);
      if (!cached) return null;

      if (cached.expires < Date.now()) {
        memoryCache.delete(key);
        return null;
      }

      return cached.value as T;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  },

  /**
   * Define um valor no cache com expiração
   * @param key - Chave do cache
   * @param value - Valor a ser armazenado
   * @param expirationSeconds - TTL em segundos (padrão: 5 minutos)
   */
  async set<T>(
    key: string,
    value: T,
    expirationSeconds: number = 300
  ): Promise<void> {
    try {
      if (isKVConfigured()) {
        await kv.set(key, value, { ex: expirationSeconds });
        return;
      }

      // Fallback: memória
      memoryCache.set(key, {
        value,
        expires: Date.now() + expirationSeconds * 1000,
      });
    } catch (error) {
      console.error("Cache set error:", error);
    }
  },

  /**
   * Remove um valor do cache
   */
  async delete(key: string): Promise<void> {
    try {
      if (isKVConfigured()) {
        await kv.del(key);
        return;
      }

      // Fallback: memória
      memoryCache.delete(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  },

  /**
   * Remove múltiplas chaves do cache
   */
  async deleteMany(keys: string[]): Promise<void> {
    try {
      if (isKVConfigured()) {
        if (keys.length > 0) {
          await kv.del(...keys);
        }
        return;
      }

      // Fallback: memória
      keys.forEach((key) => memoryCache.delete(key));
    } catch (error) {
      console.error("Cache deleteMany error:", error);
    }
  },

  /**
   * Remove todas as chaves que correspondem a um padrão
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      if (isKVConfigured()) {
        const keys = await kv.keys(pattern);
        if (keys.length > 0) {
          await kv.del(...keys);
        }
        return;
      }

      // Fallback: memória
      const regex = new RegExp(pattern.replace("*", ".*"));
      const keysToDelete = Array.from(memoryCache.keys()).filter((key) =>
        regex.test(key)
      );
      keysToDelete.forEach((key) => memoryCache.delete(key));
    } catch (error) {
      console.error("Cache deletePattern error:", error);
    }
  },

  /**
   * Incrementa um contador
   */
  async increment(key: string): Promise<number> {
    try {
      if (isKVConfigured()) {
        return await kv.incr(key);
      }

      // Fallback: memória
      const cached = memoryCache.get(key);
      const currentValue = cached ? Number(cached.value) || 0 : 0;
      const newValue = currentValue + 1;
      memoryCache.set(key, {
        value: newValue,
        expires: Date.now() + 3600000, // 1 hora
      });
      return newValue;
    } catch (error) {
      console.error("Cache increment error:", error);
      return 0;
    }
  },

  /**
   * Verifica se uma chave existe
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (isKVConfigured()) {
        return (await kv.exists(key)) === 1;
      }

      // Fallback: memória
      const cached = memoryCache.get(key);
      if (!cached) return false;

      if (cached.expires < Date.now()) {
        memoryCache.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Cache exists error:", error);
      return false;
    }
  },
};

/**
 * Chaves de cache para diferentes tipos de dados
 */
export const CacheKeys = {
  /**
   * Métricas do dashboard de um usuário
   */
  dashboardMetrics: (userId: string) => `dashboard:metrics:${userId}`,

  /**
   * Transações de um usuário (com filtros)
   */
  transactions: (userId: string, filters?: string) =>
    filters ? `transactions:${userId}:${filters}` : `transactions:${userId}`,

  /**
   * Categorias de um usuário
   */
  categories: (userId: string) => `categories:${userId}`,

  /**
   * Metas de um usuário
   */
  goals: (userId: string) => `goals:${userId}`,

  /**
   * Alertas não lidos de um usuário
   */
  unreadAlerts: (userId: string) => `alerts:unread:${userId}`,
};

/**
 * TTL (Time To Live) padrão para diferentes tipos de cache
 */
export const CacheTTL = {
  /** 5 minutos - Para métricas do dashboard */
  DASHBOARD: 300,

  /** 2 minutos - Para listas de transações */
  TRANSACTIONS: 120,

  /** 10 minutos - Para categorias (mudam raramente) */
  CATEGORIES: 600,

  /** 5 minutos - Para metas */
  GOALS: 300,

  /** 1 minuto - Para alertas não lidos */
  ALERTS: 60,
};
