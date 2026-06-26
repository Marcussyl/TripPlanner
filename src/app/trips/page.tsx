'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { TripsTopNav } from '@/components/trips/trips-top-nav';
import { TripCard } from '@/components/trips/trip-card';
import { CollaborateBanner } from '@/components/trips/collaborate-banner';
import { CreateTripDialog } from '@/components/trips/create-trip-dialog';

type TripMember = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    avatarUrl: string | null;
  };
};

type TripSummary = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string | null;
  members: TripMember[];
  _count: { members: number };
};

export default function TripsPage() {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trips');
      if (!res.ok) throw new Error('Failed to load trips');
      const data = await res.json();
      setTrips(data.trips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const uniqueMemberCount = useMemo(() => {
    const ids = new Set<string>();
    for (const trip of trips) {
      for (const member of trip.members) {
        ids.add(member.user.id);
      }
    }
    return ids.size;
  }, [trips]);

  return (
    <div className="min-h-screen bg-background">
      <TripsTopNav />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label-sm uppercase tracking-widest text-primary">TripSync</p>
            <h1 className="mt-2 text-display-lg text-on-background">Your trips</h1>
            <p className="mt-3 max-w-xl text-body-lg text-on-surface-variant">
              Create a workspace and invite your travel crew.
            </p>
          </div>
          <Button size="lg" onClick={() => setShowCreateDialog(true)} className="shrink-0">
            <span className="material-symbols-outlined text-[20px]">add</span>
            New trip
          </Button>
        </div>

        {error && <div className="mb-8"><ErrorState message={error} onRetry={loadTrips} /></div>}

        {loading ? (
          <LoadingState label="Loading your trips..." variant="inline" />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No trips yet"
            description="Start your first collaborative adventure. Create a trip and invite friends to plan together."
            actionLabel="Create your first trip"
            onAction={() => setShowCreateDialog(true)}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </div>

            <div className="mt-12">
              <CollaborateBanner
                uniqueMemberCount={uniqueMemberCount}
                onInviteClick={() => setShowCreateDialog(true)}
              />
            </div>
          </>
        )}
      </main>

      <CreateTripDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onError={setError}
      />
    </div>
  );
}
