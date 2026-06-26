'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { TimelineActivityCard } from '@/components/itinerary/timeline-activity-card';
import { AddActivityDialog } from '@/components/itinerary/add-activity-dialog';
import { AddDayDialog, getDefaultDayDate } from '@/components/itinerary/add-day-dialog';
import { ItineraryMapPanel } from '@/components/itinerary/itinerary-map-panel';
import { detectConflicts, getConflictPartners } from '@/lib/itinerary/conflicts';
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
  tripStartDate?: string;
};

function formatDaySubtitle(date: string, label: string | null) {
  const parsed = new Date(date);
  const weekday = parsed.toLocaleDateString(undefined, { weekday: 'long' });
  const monthDay = parsed.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
  return label ? `${weekday}, ${monthDay} • ${label}` : `${weekday}, ${monthDay}`;
}

export function ItineraryPlanner({ tripId, canEdit, tripStartDate }: ItineraryPlannerProps) {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Day['activities'][number] | null>(null);

  const loadDays = useCallback(async () => {
    const response = await fetch(`/api/trips/${tripId}/days`);
    if (!response.ok) {
      setLoading(false);
      return [];
    }
    const data = await response.json();
    setDays(data.days);
    setLoading(false);
    return data.days as Day[];
  }, [tripId]);

  useEffect(() => {
    void loadDays().then((loadedDays) => {
      setSelectedDayId((current) => current ?? loadedDays[0]?.id ?? null);
    });
  }, [loadDays]);

  useTripPrivateChannel(tripId, {
    onEvent: (event) => {
      if (event.startsWith('activity.')) {
        void loadDays();
      }
    },
  });

  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const dayActivities = selectedDay?.activities ?? [];

  const allActivities = useMemo(
    () => days.flatMap((day) => day.activities),
    [days],
  );

  const conflicts = useMemo(() => detectConflicts(dayActivities), [dayActivities]);
  const conflictPartners = useMemo(
    () => getConflictPartners(dayActivities),
    [dayActivities],
  );

  const nextDayNumber = days.length > 0 ? Math.max(...days.map((day) => day.dayNumber)) + 1 : 1;
  const defaultDayDate = getDefaultDayDate(tripStartDate, nextDayNumber);

  const handleAddDay = async (data: { dayNumber: number; date: string; label?: string }) => {
    const response = await fetch(`/api/trips/${tripId}/days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    const { day } = await response.json();
    await loadDays();
    setSelectedDayId(day.id);
  };

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

  const handleUpdateActivity = async (data: Parameters<
    React.ComponentProps<typeof AddActivityDialog>['onSubmit']
  >[0]) => {
    if (!editingActivity) {
      return;
    }

    await fetch(`/api/trips/${tripId}/activities/${editingActivity.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: data.type,
        title: data.title,
        startTime: data.startTime ?? null,
        duration: data.duration ?? null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        notes: data.notes ?? null,
      }),
    });
    await loadDays();
    setEditingActivity(null);
  };

  if (loading) {
    return <LoadingState label="Loading itinerary…" />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-outline-variant/40 bg-surface-container-lowest px-6 py-4 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
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
          {canEdit && days.length > 0 && (
            <button
              type="button"
              onClick={() => setAddDayOpen(true)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-outline-variant px-4 py-2 text-label-md text-on-surface-variant hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add day
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section className="flex min-h-[480px] w-full flex-col border-r border-outline-variant bg-surface-container-lowest md:w-5/12 lg:w-1/3 xl:w-[36%]">
          {selectedDay ? (
            <>
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/95 px-6 py-5 backdrop-blur">
                <div>
                  <h2 className="text-headline-md text-on-background">Day {selectedDay.dayNumber}</h2>
                  <p className="text-label-sm text-tertiary">
                    {formatDaySubtitle(selectedDay.date, selectedDay.label)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant text-on-surface transition-colors hover:bg-outline-variant/40"
                    aria-label="Calendar view"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  </button>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-variant text-on-surface transition-colors hover:bg-outline-variant/40"
                    aria-label="Filter activities"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 pb-10">
                {dayActivities.length === 0 ? (
                  <p className="px-2 py-8 text-center text-body-md text-on-surface-variant">
                    No activities yet.
                  </p>
                ) : (
                  dayActivities.map((activity, index) => (
                    <TimelineActivityCard
                      key={activity.id}
                      activity={activity}
                      hasConflict={conflicts.has(activity.id)}
                      conflictPartnerTitle={conflictPartners.get(activity.id)}
                      isHighlighted={activity.type === 'lodging' && !conflicts.has(activity.id)}
                      canEdit={canEdit}
                      onEdit={() => setEditingActivity(activity)}
                      onDelete={() => void handleDelete(activity.id)}
                    />
                  ))
                )}

                {canEdit && (
                  <div className="pl-[76px] pt-2">
                    <button
                      type="button"
                      onClick={() => setAddActivityOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline-variant py-3 text-label-md text-tertiary transition-colors hover:bg-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Add activity
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-primary">calendar_month</span>
              <h3 className="text-headline-md text-on-background">No days planned yet</h3>
              <p className="mt-2 max-w-sm text-body-md text-on-surface-variant">
                Start by adding your first day, then add flights, stays, and activities.
              </p>
              {canEdit && (
                <Button className="mt-6" onClick={() => setAddDayOpen(true)}>
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Add first day
                </Button>
              )}
            </div>
          )}
        </section>

        <ItineraryMapPanel activities={allActivities} />
      </div>

      <AddDayDialog
        open={addDayOpen}
        onOpenChange={setAddDayOpen}
        nextDayNumber={nextDayNumber}
        defaultDate={defaultDayDate}
        onSubmit={handleAddDay}
      />

      {selectedDay && (
        <AddActivityDialog
          open={addActivityOpen}
          onOpenChange={setAddActivityOpen}
          dayId={selectedDay.id}
          onSubmit={handleAddActivity}
        />
      )}

      {selectedDay && editingActivity && (
        <AddActivityDialog
          open={Boolean(editingActivity)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingActivity(null);
            }
          }}
          dayId={selectedDay.id}
          activity={editingActivity}
          onSubmit={handleUpdateActivity}
        />
      )}
    </div>
  );
}
