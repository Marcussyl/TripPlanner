import type { Expense, ExpenseSplit } from '@prisma/client';

export function serializeExpense<T extends Expense & { splits?: ExpenseSplit[] }>(expense: T) {
  return {
    ...expense,
    amount: Number(expense.amount),
    splits: expense.splits?.map((split) => ({
      ...split,
      amount: Number(split.amount),
    })),
  };
}

export function serializeTripBudget(trip: { budgetLimit: { toString(): string } | null }) {
  return {
    budgetLimit: trip.budgetLimit != null ? Number(trip.budgetLimit) : null,
  };
}
