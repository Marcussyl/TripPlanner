'use client';

import { cn } from '@/lib/utils';

const TYPE_ICONS: Record<string, string> = {
  flight: 'flight_land',
  transport: 'directions_transit',
  lodging: 'hotel',
  activity: 'local_activity',
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  flight: 'bg-secondary-container text-on-secondary-container',
  transport: 'bg-surface-variant text-on-surface-variant',
  lodging: 'bg-secondary-container text-on-secondary-container',
  activity: 'bg-surface-container text-on-surface-variant',
};

type TimelineActivityCardProps = {
  activity: {
    id: string;
    type: string;
    title: string;
    startTime: string | null;
    duration: number | null;
    notes: string | null;
    lat: number | null;
    lng: number | null;
  };
  hasConflict?: boolean;
  conflictPartnerTitle?: string | null;
  isHighlighted?: boolean;
  canEdit?: boolean;
  onDelete?: () => void;
};

function formatTimeParts(iso: string | null) {
  if (!iso) {
    return { time: 'TBD', period: '' };
  }
  const date = new Date(iso);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const [value, period = ''] = time.split(' ');
  return { time: value, period };
}

export function TimelineActivityCard({
  activity,
  hasConflict,
  conflictPartnerTitle,
  isHighlighted,
  canEdit,
  onDelete,
}: TimelineActivityCardProps) {
  const { time, period } = formatTimeParts(activity.startTime);
  const badgeStyle = TYPE_BADGE_STYLES[activity.type] ?? TYPE_BADGE_STYLES.activity;

  return (
    <div className="itinerary-timeline-item relative mb-4">
      <div className="relative z-10 flex gap-3">
        <div className="flex w-16 shrink-0 flex-col items-center pt-1">
          <span className="text-label-sm font-bold text-secondary">{time}</span>
          {period && <span className="text-[10px] text-tertiary">{period}</span>}
          <div
            className={cn(
              'relative z-10 mt-2 rounded-full border-2 border-surface',
              hasConflict
                ? 'h-4 w-4 bg-error'
                : isHighlighted
                  ? 'h-5 w-5 border-4 border-primary bg-surface shadow-sm'
                  : 'h-4 w-4 bg-primary-container',
            )}
          >
            {isHighlighted && <div className="absolute inset-1 rounded-full bg-primary" />}
            {hasConflict && (
              <span className="absolute -inset-1 rounded-full border border-error opacity-50" />
            )}
          </div>
        </div>

        <article
          className={cn(
            'group relative flex-1 rounded-xl border p-4 shadow-level-2 transition-colors',
            hasConflict
              ? 'border-error/40 bg-error-container/20'
              : isHighlighted
                ? 'border-outline-variant border-l-4 border-l-primary bg-surface shadow-level-3'
                : 'border-outline-variant/30 bg-surface hover:border-outline-variant',
          )}
        >
          {hasConflict && (
            <div className="absolute -top-3 -right-2 z-20 flex items-center gap-1 rounded-lg bg-error px-2 py-1 text-[10px] font-semibold text-on-error shadow-md">
              <span className="material-symbols-outlined text-[12px]">warning</span>
              Time conflict
            </div>
          )}

          <div className="mb-2 flex items-start justify-between gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                badgeStyle,
              )}
            >
              {activity.type}
            </span>
            {canEdit && (
              <button
                type="button"
                className="text-tertiary opacity-0 transition-opacity group-hover:opacity-100 hover:text-on-surface"
                onClick={onDelete}
                aria-label="Delete activity"
              >
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            )}
          </div>

          <h4 className="text-label-md text-on-background">{activity.title}</h4>
          {activity.notes && (
            <p className="mt-1 text-[13px] text-on-surface-variant">{activity.notes}</p>
          )}

          {activity.duration && (
            <div className="mt-3 flex items-center gap-1 text-[11px] text-tertiary">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>{activity.duration >= 60 ? `${Math.round(activity.duration / 60)}h` : `${activity.duration} min`} duration</span>
            </div>
          )}

          {hasConflict && conflictPartnerTitle && (
            <div className="mt-3 rounded border border-outline-variant/50 bg-surface-container-low p-2">
              <p className="flex items-center gap-1 text-[11px] font-medium text-error">
                <span className="material-symbols-outlined text-[14px]">error</span>
                Overlaps with &quot;{conflictPartnerTitle}&quot;
              </p>
            </div>
          )}

          {activity.type === 'lodging' && activity.lat != null && activity.lng != null && (
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-[12px] font-medium text-on-primary transition-colors hover:bg-surface-tint"
              >
                <span className="material-symbols-outlined text-[14px]">directions</span>
                Directions
              </a>
              <button
                type="button"
                className="rounded border border-outline px-3 py-1.5 text-[12px] font-medium text-on-surface-variant transition-colors hover:bg-surface-variant"
              >
                Details
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

export function TimelineActivityCardIcon({ type }: { type: string }) {
  return TYPE_ICONS[type] ?? 'event';
}
