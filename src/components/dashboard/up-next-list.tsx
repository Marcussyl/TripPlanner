'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, string> = {
  flight: 'flight_land',
  transport: 'directions_transit',
  lodging: 'hotel',
  activity: 'local_activity',
};

type UpNextListProps = {
  tripId: string;
  activities: Array<{
    id: string;
    title: string;
    startTime: string | null;
    type: string;
    notes?: string | null;
    day?: { dayNumber: number; label: string | null };
  }>;
  embedded?: boolean;
};

function formatTime(iso: string | null) {
  if (!iso) {
    return null;
  }
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function UpNextList({ tripId, activities, embedded = false }: UpNextListProps) {
  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-headline-md text-on-background">Up next</h3>
        {!embedded && (
          <Link href={`/trips/${tripId}/itinerary`} className="text-label-md text-primary">
            See all
          </Link>
        )}
      </div>

      {activities.length === 0 ? (
        <p className="mt-4 text-body-md text-on-surface-variant">No upcoming activities.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {activities.map((activity) => {
            const icon = TYPE_ICONS[activity.type] ?? 'event';
            const time = formatTime(activity.startTime);

            return (
              <li key={activity.id}>
                <Link
                  href={`/trips/${tripId}/itinerary`}
                  className="group flex gap-4 rounded-xl border border-transparent p-4 transition-colors hover:border-outline-variant hover:bg-surface-container-low"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div className="min-w-0 flex-grow">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h4 className="text-title-md text-on-background group-hover:text-primary">
                        {activity.title}
                      </h4>
                      {time && (
                        <span className="shrink-0 text-label-sm text-on-surface-variant">{time}</span>
                      )}
                    </div>
                    {activity.notes && (
                      <p className="text-body-sm text-on-surface-variant">{activity.notes}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-bold tracking-wide text-on-surface-variant uppercase">
                        {activity.type}
                      </span>
                      {activity.day && (
                        <span className="text-body-sm text-on-surface-variant">
                          Day {activity.day.dayNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <section
      className={cn(
        'rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-level-2',
      )}
    >
      {content}
    </section>
  );
}
