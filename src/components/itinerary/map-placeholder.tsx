'use client';

type MapPlaceholderProps = {
  activities: Array<{
    id: string;
    title: string;
    lat: number | null;
    lng: number | null;
  }>;
};

export function MapPlaceholder({ activities }: MapPlaceholderProps) {
  const withCoords = activities.filter((activity) => activity.lat != null && activity.lng != null);

  return (
    <div className="flex h-full min-h-[320px] flex-col rounded-3xl border border-dashed border-outline-variant bg-surface-container-low p-6">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-primary">map</span>
        <p className="text-title-md text-on-background">Map coming soon</p>
      </div>
      <p className="mt-2 text-body-sm text-on-surface-variant">
        Mapbox integration is planned for a later phase. Coordinates from activities will appear
        here.
      </p>
      {withCoords.length > 0 ? (
        <ul className="mt-6 space-y-2 overflow-auto">
          {withCoords.map((activity) => (
            <li
              key={activity.id}
              className="rounded-xl bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface"
            >
              <span className="font-medium">{activity.title}</span>
              <span className="text-on-surface-variant">
                {' '}
                — {activity.lat?.toFixed(4)}, {activity.lng?.toFixed(4)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-body-sm text-on-surface-variant">No coordinates yet.</p>
      )}
    </div>
  );
}
