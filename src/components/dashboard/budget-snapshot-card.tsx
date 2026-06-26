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
}: BudgetSnapshotCardProps) {
  const percent =
    budgetLimit && budgetLimit > 0
      ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100))
      : null;

  const formatCurrency = (value: number) =>
    value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <section className="flex h-48 flex-col justify-between rounded-3xl border border-outline-variant bg-surface-container-low p-6 shadow-sm">
      <div>
        <div className="mb-1 flex items-center justify-between gap-4">
          <h3 className="text-label-md uppercase tracking-wider text-on-surface-variant">
            Group budget
          </h3>
          <Link href={`/trips/${tripId}/budget`} className="text-label-md text-primary">
            Details
          </Link>
        </div>
        <p className="text-headline-lg text-on-background">
          {formatCurrency(totalSpent)}
          {budgetLimit != null && (
            <span className="text-body-md text-on-surface-variant"> / {formatCurrency(budgetLimit)}</span>
          )}
        </p>
      </div>

      {percent != null ? (
        <div>
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-surface-variant">
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <p className="text-right text-label-sm text-on-surface-variant">{percent}% allocated</p>
        </div>
      ) : (
        <p className="text-body-sm text-on-surface-variant">No budget limit set</p>
      )}
    </section>
  );
}
