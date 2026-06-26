'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { TopAppBar } from '@/components/trip/top-app-bar';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { ActivityCard } from '@/components/itinerary/activity-card';
import { AddActivityDialog } from '@/components/itinerary/add-activity-dialog';
import { MapPlaceholder } from '@/components/itinerary/map-placeholder';
import { detectConflicts } from '@/lib/itinerary/conflicts';
import { useTripPrivateChannel } from '@/hooks/use-trip-private-channel';

type Day = {
  id: string;
  dayNumber: number;
  date: string;
  label: string | null;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    startTime: string | null;
    duration: number | null;
    notes: string | null;
    lat: number | null;
    lng: number | null;
  }>;
};

type ItineraryPlannerProps = {
  tripId: string;
  canEdit: boolean;
};

export function ItineraryPlanner({ tripId, canEdit }: ItineraryPlannerProps) {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const loadDays = useCallback(async () => {
    const response = await fetch(`/api/trips/${tripId}/days`);
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setDays(data.days);
    if (!selectedDayId && data.days.length > 0) {
      setSelectedDayId(data.days[0].id);
    }
    setLoading(false);
  }, [tripId, selectedDayId]);

  useEffect(() => {
    void loadDays();
  }, [loadDays]);

  useTripPrivateChannel(tripId, {
    onEvent: (event) => {
      if (event.startsWith('activity.')) {
        void loadDays();
      }
    },
  });

  const allActivities = useMemo(
    () => days.flatMap((day) => day.activities),
    [days],
  );

  const conflicts = useMemo(() => detectConflicts(allActivities), [allActivities]);

  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];

  const handleAddActivity = async (data: Parameters<
    React.ComponentProps<typeof AddActivityDialog>['onSubmit']
  >[0]) => {
    await fetch(`/api/trips/${tripId}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    await loadDays();
  };

  const handleDelete = async (activityId: string) => {
    await fetch(`/api/trips/${tripId}/activities/${activityId}`, { method: 'DELETE' });
    await loadDays();
  };

  if (loading) {
    return <LoadingState label="Loading itinerary…" />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar
        title="Itinerary"
        subtitle="Day-by-day timeline with conflict detection"
        actions={
          canEdit && selectedDay ? (
            <Button onClick={() => setAddOpen(true)}>Add activity</Button>
          ) : undefined
        }
      />
      <div className="grid flex-1 grid-cols-1 gap-6 p-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDayId(day.id)}
                className={
                  selectedDay?.id === day.id
                    ? 'rounded-full bg-primary px-4 py-2 text-label-md text-on-primary'
                    : 'rounded-full border border-outline-variant px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container'
                }
              >
                Day {day.dayNumber}
                {day.label ? ` · ${day.label}` : ''}
              </button>
            ))}
          </div>

          {selectedDay ? (
            <div className="space-y-3">
              <h3 className="text-headline-md text-on-background">
                Day {selectedDay.dayNumber}
                {selectedDay.label ? ` — ${selectedDay.label}` : ''}
              </h3>
              {selectedDay.activities.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">No activities yet.</p>
              ) : (
                selectedDay.activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    hasConflict={conflicts.has(activity.id)}
                    canEdit={canEdit}
                    onDelete={() => void handleDelete(activity.id)}
                  />
                ))
              )}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setAddOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-outline-variant py-6 text-label-md text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add activity
                </button>
              )}
            </div>
          ) : (
            <p className="text-body-md text-on-surface-variant">No days planned yet.</p>
          )}
        </div>
        <div className="lg:col-span-2">
          <MapPlaceholder activities={allActivities} />
        </div>
      </div>

      {selectedDay && (
        <AddActivityDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          dayId={selectedDay.id}
          onSubmit={handleAddActivity}
        />
      )}
    </div>
  );
}
