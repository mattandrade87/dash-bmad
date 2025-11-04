import { describe, it, expect, beforeEach } from 'vitest';
import { useTransactionStore } from '../transaction-store';

describe('TransactionStore', () => {
  beforeEach(() => {
    // Resetar store antes de cada teste
    const { setTransactions, clearFilters } = useTransactionStore.getState();
    setTransactions([]);
    clearFilters();
  });

  it('deve adicionar transação', () => {
    const { addTransaction } = useTransactionStore.getState();

    const newTransaction = {
      id: '1',
      description: 'Teste',
      amountCents: 10000,
      type: 'INCOME' as const,
      date: '2025-11-04',
      categoryId: 'cat1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);

    expect(useTransactionStore.getState().transactions).toHaveLength(1);
    expect(useTransactionStore.getState().transactions[0]).toEqual(newTransaction);
  });

  it('deve atualizar transação', () => {
    const { addTransaction, updateTransaction } = useTransactionStore.getState();

    const transaction = {
      id: '1',
      description: 'Original',
      amountCents: 10000,
      type: 'INCOME' as const,
      date: '2025-11-04',
      categoryId: 'cat1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(transaction);
    updateTransaction('1', { description: 'Atualizado' });

    const updated = useTransactionStore.getState().transactions[0];
    expect(updated.description).toBe('Atualizado');
  });

  it('deve deletar transação', () => {
    const { addTransaction, deleteTransaction } = useTransactionStore.getState();

    const transaction = {
      id: '1',
      description: 'Teste',
      amountCents: 10000,
      type: 'INCOME' as const,
      date: '2025-11-04',
      categoryId: 'cat1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(transaction);
    expect(useTransactionStore.getState().transactions).toHaveLength(1);

    deleteTransaction('1');
    expect(useTransactionStore.getState().transactions).toHaveLength(0);
  });

  it('deve calcular total de receitas', () => {
    const { setTransactions, getTotalIncome } = useTransactionStore.getState();

    setTransactions([
      {
        id: '1',
        description: 'Receita 1',
        amountCents: 10000,
        type: 'INCOME',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        description: 'Receita 2',
        amountCents: 20000,
        type: 'INCOME',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        description: 'Despesa',
        amountCents: 5000,
        type: 'EXPENSE',
        date: '2025-11-04',
        categoryId: 'cat2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(getTotalIncome()).toBe(30000);
  });

  it('deve calcular total de despesas', () => {
    const { setTransactions, getTotalExpense } = useTransactionStore.getState();

    setTransactions([
      {
        id: '1',
        description: 'Despesa 1',
        amountCents: 10000,
        type: 'EXPENSE',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        description: 'Despesa 2',
        amountCents: 15000,
        type: 'EXPENSE',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(getTotalExpense()).toBe(25000);
  });

  it('deve calcular saldo', () => {
    const { setTransactions, getBalance } = useTransactionStore.getState();

    setTransactions([
      {
        id: '1',
        description: 'Receita',
        amountCents: 50000,
        type: 'INCOME',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        description: 'Despesa',
        amountCents: 30000,
        type: 'EXPENSE',
        date: '2025-11-04',
        categoryId: 'cat2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(getBalance()).toBe(20000); // 50000 - 30000
  });

  it('deve filtrar transações por tipo', () => {
    const { setTransactions, setFilters, getFilteredTransactions } = useTransactionStore.getState();

    setTransactions([
      {
        id: '1',
        description: 'Receita',
        amountCents: 10000,
        type: 'INCOME',
        date: '2025-11-04',
        categoryId: 'cat1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        description: 'Despesa',
        amountCents: 5000,
        type: 'EXPENSE',
        date: '2025-11-04',
        categoryId: 'cat2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    setFilters({ type: 'INCOME' });
    const filtered = getFilteredTransactions();

    expect(filtered).toHaveLength(1);
    expect(filtered[0].type).toBe('INCOME');
  });
});
