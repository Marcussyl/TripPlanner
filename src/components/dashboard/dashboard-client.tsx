'use client';

import { useCallback, useEffect, useState } from 'react';
import { InviteExplorer } from '@/components/trip/invite-explorer';
import { TopAppBar } from '@/components/trip/top-app-bar';
import { LoadingState } from '@/components/ui/loading-state';
import { TripHeroCard } from '@/components/dashboard/trip-hero-card';
import { OnlineNowPill } from '@/components/dashboard/online-now-pill';
import { UpNextList } from '@/components/dashboard/up-next-list';
import { QuickIdeasPanel } from '@/components/dashboard/quick-ideas-panel';
import { BudgetSnapshotCard } from '@/components/dashboard/budget-snapshot-card';
import { useTripPrivateChannel } from '@/hooks/use-trip-private-channel';

type DashboardClientProps = {
  tripId: string;
  isOwner: boolean;
  initialTrip: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage?: string | null;
  };
};

export function DashboardClient({ tripId, isOwner, initialTrip }: DashboardClientProps) {
  const [trip] = useState(initialTrip);
  const [activities, setActivities] = useState<
    Array<{
      id: string;
      title: string;
      startTime: string | null;
      type: string;
      day?: { dayNumber: number; label: string | null };
    }>
  >([]);
  const [pins, setPins] = useState<
    Array<{
      id: string;
      type: string;
      content: string;
      createdBy: { name: string | null };
    }>
  >([]);
  const [summary, setSummary] = useState<{
    totalSpent: number;
    budgetLimit: number | null;
    byCategory: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [activitiesRes, pinsRes, summaryRes] = await Promise.all([
      fetch(`/api/trips/${tripId}/activities?upcoming=true&limit=5`),
      fetch(`/api/trips/${tripId}/pins?category=idea`),
      fetch(`/api/trips/${tripId}/budget/summary`),
    ]);
    if (activitiesRes.ok) {
      setActivities((await activitiesRes.json()).activities);
    }
    if (pinsRes.ok) {
      setPins((await pinsRes.json()).pins);
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
      if (
        event.startsWith('activity.') ||
        event.startsWith('expense.') ||
        event.startsWith('pin.')
      ) {
        void load();
      }
    },
  });

  if (loading) {
    return <LoadingState label="Loading dashboard…" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar
        title="Dashboard"
        subtitle="Trip overview and what is happening next"
        actions={<OnlineNowPill tripId={tripId} />}
      />
      <div className="grid grid-cols-12 gap-6 p-8">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <TripHeroCard trip={trip} tripId={tripId} />
          <UpNextList tripId={tripId} activities={activities} />
          {isOwner && <InviteExplorer tripId={tripId} isOwner />}
        </div>
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <BudgetSnapshotCard
            tripId={tripId}
            totalSpent={summary?.totalSpent ?? 0}
            budgetLimit={summary?.budgetLimit ?? null}
            byCategory={summary?.byCategory ?? {}}
          />
          <QuickIdeasPanel tripId={tripId} pins={pins} />
        </div>
      </div>
    </div>
  );
}
