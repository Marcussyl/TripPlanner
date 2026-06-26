'use client';

import Link from 'next/link';

type UpNextListProps = {
  tripId: string;
  activities: Array<{
    id: string;
    title: string;
    startTime: string | null;
    type: string;
    day?: { dayNumber: number; label: string | null };
  }>;
};

export function UpNextList({ tripId, activities }: UpNextListProps) {
  return (
    <section className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-headline-md text-on-background">Up next</h3>
        <Link href={`/trips/${tripId}/itinerary`} className="text-label-md text-primary">
          See all
        </Link>
      </div>
      {activities.length === 0 ? (
        <p className="mt-4 text-body-md text-on-surface-variant">No upcoming activities.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3"
            >
              <span className="material-symbols-outlined text-primary">schedule</span>
              <div>
                <p className="text-title-md text-on-background">{activity.title}</p>
                <p className="text-body-sm text-on-surface-variant">
                  {activity.day ? `Day ${activity.day.dayNumber}` : ''}
                  {activity.startTime
                    ? ` · ${new Date(activity.startTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
