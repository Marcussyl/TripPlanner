'use client';

import { cn } from '@/lib/utils';
import { ConflictBadge } from '@/components/itinerary/conflict-badge';

const TYPE_ICONS: Record<string, string> = {
  flight: 'flight',
  transport: 'directions_transit',
  lodging: 'hotel',
  activity: 'local_activity',
};

type ActivityCardProps = {
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
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

function formatTime(iso: string | null) {
  if (!iso) {
    return 'TBD';
  }
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ActivityCard({
  activity,
  hasConflict,
  canEdit,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  return (
    <article
      className={cn(
        'rounded-2xl border bg-surface-container-lowest p-4 transition-colors',
        hasConflict ? 'border-error' : 'border-outline-variant/60',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5 text-primary">
            {TYPE_ICONS[activity.type] ?? 'event'}
          </span>
          <div>
            <h4 className="text-title-md text-on-background">{activity.title}</h4>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {formatTime(activity.startTime)}
              {activity.duration ? ` · ${activity.duration} min` : ''}
            </p>
            {activity.notes && (
              <p className="mt-2 text-body-sm text-on-surface-variant">{activity.notes}</p>
            )}
          </div>
        </div>
        {hasConflict && <ConflictBadge />}
      </div>
      {canEdit && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className="text-label-sm text-primary hover:underline"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-label-sm text-error hover:underline"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
