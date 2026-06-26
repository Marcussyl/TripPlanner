'use client';

type BalancesPanelProps = {
  balances: Array<{ userId: string; name: string; net: number }>;
  members: Array<{ userId: string; name: string }>;
  canEdit: boolean;
  onSettle: (fromUserId: string, toUserId: string, amount: number) => Promise<void>;
};

export function BalancesPanel({ balances, members, canEdit, onSettle }: BalancesPanelProps) {
  const debtors = balances.filter((balance) => balance.net < -0.01);
  const creditors = balances.filter((balance) => balance.net > 0.01);

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6">
      <h3 className="text-title-md text-on-background">Balances</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">Owes</p>
          <ul className="mt-2 space-y-2">
            {debtors.length === 0 ? (
              <li className="text-body-sm text-on-surface-variant">Nobody owes</li>
            ) : (
              debtors.map((balance) => (
                <li key={balance.userId} className="text-body-md text-on-surface">
                  {balance.name}{' '}
                  <span className="text-error">${Math.abs(balance.net).toFixed(2)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
            Gets back
          </p>
          <ul className="mt-2 space-y-2">
            {creditors.length === 0 ? (
              <li className="text-body-sm text-on-surface-variant">All settled</li>
            ) : (
              creditors.map((balance) => (
                <li key={balance.userId} className="text-body-md text-on-surface">
                  {balance.name}{' '}
                  <span className="text-primary">${balance.net.toFixed(2)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {canEdit && debtors.length > 0 && creditors.length > 0 && (
        <button
          type="button"
          className="mt-4 text-label-md text-primary hover:underline"
          onClick={() => {
            const debtor = debtors[0];
            const creditor = creditors[0];
            const amount = Math.min(Math.abs(debtor.net), creditor.net);
            void onSettle(debtor.userId, creditor.userId, Math.round(amount * 100) / 100);
          }}
        >
          Quick settle ${Math.min(Math.abs(debtors[0].net), creditors[0].net).toFixed(2)}
        </button>
      )}
      {members.length > 0 && (
        <p className="mt-4 text-body-sm text-on-surface-variant">
          {members.length} members · expenses split equally
        </p>
      )}
    </div>
  );
}
