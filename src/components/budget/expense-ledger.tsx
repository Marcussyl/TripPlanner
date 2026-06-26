'use client';

type ExpenseLedgerProps = {
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    createdAt: string;
    payer: { id: string; name: string | null };
  }>;
};

export function ExpenseLedger({ expenses }: ExpenseLedgerProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant px-6 py-12 text-center text-body-md text-on-surface-variant">
        No expenses yet
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest">
      <table className="w-full text-left text-body-md">
        <thead className="border-b border-outline-variant/60 bg-surface-container-low text-label-sm uppercase text-on-surface-variant">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Paid by</th>
            <th className="px-4 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-b border-outline-variant/30 last:border-0">
              <td className="px-4 py-3 text-on-background">{expense.title}</td>
              <td className="px-4 py-3 capitalize text-on-surface-variant">{expense.category}</td>
              <td className="px-4 py-3 text-on-surface-variant">
                {expense.payer.name ?? 'Member'}
              </td>
              <td className="px-4 py-3 text-right font-medium text-on-background">
                ${expense.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
