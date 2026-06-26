'use client';

import { useEffect, useState } from 'react';

type ExpenseToastProps = {
  tripId: string;
};

export function ExpenseToast({ tripId }: ExpenseToastProps) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) {
      return;
    }

    let mounted = true;

    void import('pusher-js').then(({ default: Pusher }) => {
      const pusher = new Pusher(key, { cluster, authEndpoint: '/api/realtime/auth' });
      const channel = pusher.subscribe(`private-trip-${tripId}`);
      channel.bind('expense.created', (data: { expense?: { title?: string } }) => {
        if (mounted) {
          setToast(`New expense: ${data.expense?.title ?? 'Expense added'}`);
          window.setTimeout(() => setToast(null), 4000);
        }
      });
      return () => {
        mounted = false;
        pusher.disconnect();
      };
    });

    return () => {
      mounted = false;
    };
  }, [tripId]);

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-inverse-surface px-4 py-3 text-body-md text-inverse-on-surface shadow-lg">
      <span className="material-symbols-outlined text-primary">payments</span>
      {toast}
    </div>
  );
}
