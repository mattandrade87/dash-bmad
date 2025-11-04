import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { TransactionFilters } from '@/lib/validations/transaction';

/**
 * Repository para operações de transações
 */
export class TransactionRepository {
  /**
   * Lista transações do usuário com filtros e paginação
   */
  static async findMany(userId: string, filters: TransactionFilters) {
    const { type, categoryId, startDate, endDate, search, limit, offset, orderBy, order } = filters;

    // Build where clause
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && { date: { lte: endDate } }),
      // Combine date range if both provided
      ...(startDate && endDate && {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }),
      // Search in description (case-insensitive)
      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    // Execute query with count
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              icon: true,
              type: true,
            },
          },
        },
        orderBy: {
          [orderBy]: order,
        },
        take: limit,
        skip: offset,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Busca transação por ID
   */
  static async findById(id: string, userId: string) {
    return await prisma.transaction.findFirst({
      where: {
        id,
        userId, // Security: only owner can access
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });
  }

  /**
   * Cria nova transação
   */
  static async create(data: {
    userId: string;
    type: 'INCOME' | 'EXPENSE';
    amountCents: number;
    description: string;
    categoryId: string;
    date: Date;
  }) {
    return await prisma.transaction.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });
  }

  /**
   * Atualiza transação existente
   */
  static async update(
    id: string,
    userId: string,
    data: {
      type?: 'INCOME' | 'EXPENSE';
      amountCents?: number;
      description?: string;
      categoryId?: string;
      date?: Date;
    }
  ) {
    // First verify ownership
    const existing = await this.findById(id, userId);
    if (!existing) {
      return null;
    }

    return await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true,
            type: true,
          },
        },
      },
    });
  }

  /**
   * Deleta transação
   */
  static async delete(id: string, userId: string) {
    // First verify ownership
    const existing = await this.findById(id, userId);
    if (!existing) {
      return null;
    }

    return await prisma.transaction.delete({
      where: { id },
    });
  }

  /**
   * Verifica se categoria pertence ao usuário
   */
  static async verifyCategoryOwnership(categoryId: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    return !!category;
  }
}
