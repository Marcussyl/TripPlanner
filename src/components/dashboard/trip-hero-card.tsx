'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UpNextList } from '@/components/dashboard/up-next-list';

const DEFAULT_COVER_IMAGE =
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80';

type TripHeroCardProps = {
  trip: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage?: string | null;
  };
  tripId: string;
  activities: Array<{
    id: string;
    title: string;
    startTime: string | null;
    type: string;
    notes?: string | null;
    day?: { dayNumber: number; label: string | null };
  }>;
};

export function TripHeroCard({ trip, tripId, activities }: TripHeroCardProps) {
  const start = new Date(trip.startDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  const end = new Date(trip.endDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const coverSrc = trip.coverImage ?? DEFAULT_COVER_IMAGE;

  return (
    <section className="relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest shadow-level-2">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-1 bg-primary" />

      <div className="relative h-64 w-full">
        <Image
          src={coverSrc}
          alt={trip.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent" />
        <div className="absolute bottom-6 left-6 z-20 text-surface-container-lowest">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-label-sm backdrop-blur-md">
              {trip.destination}
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/90 px-3 py-1 text-label-sm text-on-primary">
              {start} – {end}
            </span>
          </div>
          <h2 className="text-headline-lg text-surface-container-lowest">{trip.name}</h2>
        </div>
      </div>

      <div className="flex flex-grow flex-col justify-between p-6 lg:p-8">
        <UpNextList tripId={tripId} activities={activities} embedded />

        <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-6">
          <Link
            href={`/trips/${tripId}/itinerary`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-label-md text-on-primary shadow-sm transition-colors hover:bg-surface-tint"
          >
            Open full itinerary
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
