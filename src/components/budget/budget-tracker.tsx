'use client';

import { useCallback, useEffect, useState } from 'react';
import { TopAppBar } from '@/components/trip/top-app-bar';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { AddExpenseDialog } from '@/components/budget/add-expense-dialog';
import { ExpenseLedger } from '@/components/budget/expense-ledger';
import { BalancesPanel } from '@/components/budget/balances-panel';
import { CategoryDonutChart } from '@/components/budget/category-donut-chart';
import { ExpenseToast } from '@/components/budget/expense-toast';
import { useTripPrivateChannel } from '@/hooks/use-trip-private-channel';

type BudgetTrackerProps = {
  tripId: string;
  canEdit: boolean;
};

export function BudgetTracker({ tripId, canEdit }: BudgetTrackerProps) {
  const [expenses, setExpenses] = useState<
    Array<{
      id: string;
      title: string;
      amount: number;
      category: string;
      createdAt: string;
      payer: { id: string; name: string | null };
    }>
  >([]);
  const [summary, setSummary] = useState<{
    totalSpent: number;
    budgetLimit: number | null;
    byCategory: Record<string, number>;
    balances: Array<{ userId: string; name: string; net: number }>;
    memberCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    const [expensesRes, summaryRes] = await Promise.all([
      fetch(`/api/trips/${tripId}/expenses`),
      fetch(`/api/trips/${tripId}/budget/summary`),
    ]);
    if (expensesRes.ok) {
      const data = await expensesRes.json();
      setExpenses(data.expenses);
    }
    if (summaryRes.ok) {
      setSummary(await summaryRes.json());
    }
    setLoading(false);
  }, [tripId]);

  useEffect(() => {
    void load();
  }, [load]);

  useTripPrivateChannel(tripId, {
    onEvent: (event) => {
      if (event.startsWith('expense.')) {
        void load();
      }
    },
  });

  const handleAdd = async (data: { title: string; amount: number; category: string }) => {
    await fetch(`/api/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleSettle = async (fromUserId: string, toUserId: string, amount: number) => {
    await fetch(`/api/trips/${tripId}/budget/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId, amount }),
    });
    await load();
  };

  if (loading) {
    return <LoadingState label="Loading budget…" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <ExpenseToast tripId={tripId} />
      <TopAppBar
        title="Budget"
        subtitle={
          summary
            ? `Total spent $${summary.totalSpent.toFixed(2)}${
                summary.budgetLimit ? ` of $${summary.budgetLimit}` : ''
              }`
            : 'Track shared expenses'
        }
        actions={
          canEdit ? <Button onClick={() => setAddOpen(true)}>Add expense</Button> : undefined
        }
      />
      <div className="space-y-6 p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryDonutChart
            byCategory={summary?.byCategory ?? {}}
            totalSpent={summary?.totalSpent ?? 0}
          />
          <BalancesPanel
            balances={summary?.balances ?? []}
            members={(summary?.balances ?? []).map((balance) => ({
              userId: balance.userId,
              name: balance.name,
            }))}
            canEdit={canEdit}
            onSettle={handleSettle}
          />
        </div>
        <ExpenseLedger expenses={expenses} />
      </div>
      <AddExpenseDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} />
    </div>
  );
}
