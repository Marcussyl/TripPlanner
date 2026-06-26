'use client';

import { useMemo } from 'react';
import { normalizeMapPosition, totalRouteDistanceKm } from '@/lib/itinerary/geo';

const TYPE_ICONS: Record<string, string> = {
  flight: 'flight_land',
  transport: 'train',
  lodging: 'hotel',
  activity: 'local_activity',
};

const TYPE_PIN_STYLES: Record<string, string> = {
  flight: 'bg-secondary text-on-secondary',
  transport: 'bg-error text-on-error',
  lodging: 'bg-primary text-on-primary',
  activity: 'bg-tertiary text-on-tertiary',
};

type ItineraryMapPanelProps = {
  activities: Array<{
    id: string;
    title: string;
    type: string;
    lat: number | null;
    lng: number | null;
  }>;
};

export function ItineraryMapPanel({ activities }: ItineraryMapPanelProps) {
  const withCoords = activities.filter(
    (activity) => activity.lat != null && activity.lng != null,
  ) as Array<{ id: string; title: string; type: string; lat: number; lng: number }>;

  const bounds = useMemo(() => {
    if (withCoords.length === 0) {
      return null;
    }
    const lats = withCoords.map((point) => point.lat);
    const lngs = withCoords.map((point) => point.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [withCoords]);

  const distanceKm = useMemo(
    () => totalRouteDistanceKm(withCoords.map((point) => ({ lat: point.lat, lng: point.lng }))),
    [withCoords],
  );

  const routePath = useMemo(() => {
    if (!bounds || withCoords.length < 2) {
      return null;
    }
    const points = withCoords.map((activity) =>
      normalizeMapPosition(activity.lat, activity.lng, bounds),
    );
    const [first, ...rest] = points;
    const segments = rest.map((point) => `L ${point.x} ${point.y}`).join(' ');
    return `M ${first.x} ${first.y} ${segments}`;
  }, [bounds, withCoords]);

  return (
    <div className="relative hidden min-h-[520px] flex-1 overflow-hidden bg-[#f0eadd] md:block">
      <div className="map-grid-bg absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-secondary-container/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-3">
        <div className="flex flex-col rounded-lg border border-outline-variant/30 bg-surface p-1 shadow-level-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant"
            aria-label="Zoom in"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="mx-auto my-0.5 h-px w-6 bg-outline-variant/50" />
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded text-on-surface-variant transition-colors hover:bg-surface-variant"
            aria-label="Zoom out"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface text-on-surface-variant shadow-level-2 transition-colors hover:bg-surface-variant"
          aria-label="Recenter map"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        {routePath && (
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d={routePath}
              fill="none"
              stroke="#ab3600"
              strokeWidth="2"
              strokeDasharray="6,4"
              className="opacity-50"
            />
          </svg>
        )}

        {withCoords.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <div>
              <span className="material-symbols-outlined mb-3 text-4xl text-primary">map</span>
              <p className="text-title-md text-on-background">Map preview</p>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Add coordinates to activities to plot them on the map.
              </p>
            </div>
          </div>
        ) : (
          bounds &&
          withCoords.map((activity, index) => {
            const { x, y } = normalizeMapPosition(activity.lat, activity.lng, bounds);
            const pinStyle = TYPE_PIN_STYLES[activity.type] ?? TYPE_PIN_STYLES.activity;
            const isActive = activity.type === 'lodging';

            return (
              <div
                key={activity.id}
                className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {isActive && (
                  <div className="relative mb-1 whitespace-nowrap rounded-lg border-2 border-primary bg-surface px-3 py-1.5 text-[12px] font-bold text-primary shadow-level-3">
                    {activity.title}
                  </div>
                )}
                <div
                  className={`mx-auto flex items-center justify-center rounded-full border-2 border-surface shadow-md ${pinStyle} ${
                    isActive ? 'h-10 w-10' : 'h-8 w-8'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {TYPE_ICONS[activity.type] ?? 'place'}
                  </span>
                </div>
                {!isActive && index === 0 && (
                  <div className="mt-1 whitespace-nowrap rounded-lg border border-outline-variant bg-surface px-2 py-1 text-[11px] font-semibold opacity-80">
                    {activity.title}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-6 rounded-full border border-outline-variant/50 bg-surface/90 px-8 py-3 shadow-level-3 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-tertiary">Total distance</span>
          <span className="text-[16px] font-bold text-on-background">
            {distanceKm != null ? `${Math.round(distanceKm)} km` : '—'}
          </span>
        </div>
        <div className="h-6 w-px bg-outline-variant" />
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-tertiary">Stops</span>
          <span className="text-[16px] font-bold text-on-background">{withCoords.length}</span>
        </div>
      </div>
    </div>
  );
}
