'use client';

import Link from 'next/link';

type TripHeroCardProps = {
  trip: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage?: string | null;
  };
  tripId: string;
};

export function TripHeroCard({ trip, tripId }: TripHeroCardProps) {
  const start = new Date(trip.startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const end = new Date(trip.endDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-container to-surface-container-high p-8">
      <p className="text-label-sm uppercase tracking-widest text-on-primary-container">Your trip</p>
      <h2 className="mt-2 text-display-sm text-on-background">{trip.name}</h2>
      <p className="mt-2 text-body-lg text-on-surface-variant">
        {trip.destination} · {start} – {end}
      </p>
      <Link
        href={`/trips/${tripId}/itinerary`}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary"
      >
        View itinerary
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </section>
  );
}
