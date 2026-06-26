'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { Chip } from '@/components/ui/chip';

type TripSummary = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  _count: { members: number };
};

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budgetLimit: '',
  });

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

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          destination: form.destination,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create trip');
      }

      const data = await res.json();
      router.push(`/trips/${data.trip.id}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface px-margin-mobile py-10 lg:px-margin-desktop">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-label-sm uppercase tracking-widest text-primary">TripSync</p>
            <h1 className="text-headline-lg text-on-background">Your trips</h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Create a workspace and invite your travel crew.
            </p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            <span className="material-symbols-outlined text-[20px]">add</span>
            New trip
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create a trip</CardTitle>
              <CardDescription>Set the basics for your shared workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
                <div className="space-y-2">
                  <label className="text-label-md" htmlFor="name">
                    Trip name
                  </label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Summer in Tokyo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-label-md" htmlFor="destination">
                    Destination
                  </label>
                  <Input
                    id="destination"
                    required
                    value={form.destination}
                    onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                    placeholder="Tokyo, Japan"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-label-md" htmlFor="startDate">
                    Start date
                  </label>
                  <Input
                    id="startDate"
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-label-md" htmlFor="endDate">
                    End date
                  </label>
                  <Input
                    id="endDate"
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-label-md" htmlFor="budgetLimit">
                    Budget limit (optional)
                  </label>
                  <Input
                    id="budgetLimit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.budgetLimit}
                    onChange={(e) => setForm((f) => ({ ...f, budgetLimit: e.target.value }))}
                    placeholder="5000"
                  />
                </div>
                <div className="flex gap-3 md:col-span-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create trip'}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {error && <ErrorState message={error} onRetry={loadTrips} />}

        {loading ? (
          <LoadingState label="Loading your trips..." />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No trips yet"
            description="Start your first collaborative adventure. Create a trip and invite friends to plan together."
            actionLabel="Create your first trip"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}/dashboard`}>
                <Card className="transition-shadow hover:shadow-level-3">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle>{trip.name}</CardTitle>
                      <Chip>{trip._count.members} members</Chip>
                    </div>
                    <CardDescription>{trip.destination}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-md text-on-surface-variant">
                      {new Date(trip.startDate).toLocaleDateString()} –{' '}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
