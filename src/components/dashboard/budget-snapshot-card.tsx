'use client';

import Link from 'next/link';

type BudgetSnapshotCardProps = {
  tripId: string;
  totalSpent: number;
  budgetLimit: number | null;
  byCategory: Record<string, number>;
};

export function BudgetSnapshotCard({
  tripId,
  totalSpent,
  budgetLimit,
  byCategory,
}: BudgetSnapshotCardProps) {
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const percent =
    budgetLimit && budgetLimit > 0
      ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100))
      : null;

  return (
    <section className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-headline-md text-on-background">Budget</h3>
        <Link href={`/trips/${tripId}/budget`} className="text-label-md text-primary">
          Details
        </Link>
      </div>
      <p className="mt-4 text-display-sm text-on-background">${totalSpent.toFixed(2)}</p>
      <p className="text-body-sm text-on-surface-variant">
        {budgetLimit ? `of $${budgetLimit} budget` : 'total spent'}
      </p>
      {percent != null && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      )}
      {topCategory && (
        <p className="mt-4 text-body-sm capitalize text-on-surface-variant">
          Top category: {topCategory[0]} (${topCategory[1].toFixed(2)})
        </p>
      )}
    </section>
  );
}
