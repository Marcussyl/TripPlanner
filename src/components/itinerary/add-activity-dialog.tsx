'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type ActivityType = 'flight' | 'transport' | 'lodging' | 'activity';

type ActivityFormValues = {
  dayId: string;
  type: ActivityType;
  title: string;
  startTime?: string;
  duration?: number;
  lat?: number;
  lng?: number;
  notes?: string;
};

type ActivityRecord = {
  id: string;
  type: string;
  title: string;
  startTime: string | null;
  duration: number | null;
  notes: string | null;
  lat: number | null;
  lng: number | null;
};

type AddActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: string;
  activity?: ActivityRecord | null;
  onSubmit: (data: ActivityFormValues) => Promise<void>;
};

function toDateInputValue(iso: string | null) {
  if (!iso) {
    return '';
  }
  return iso.slice(0, 10);
}

function toTimeInputValue(iso: string | null) {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function AddActivityDialog({
  open,
  onOpenChange,
  dayId,
  activity,
  onSubmit,
}: AddActivityDialogProps) {
  const isEditing = Boolean(activity);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('activity');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (activity) {
      setTitle(activity.title);
      setType((activity.type as ActivityType) || 'activity');
      setDate(toDateInputValue(activity.startTime));
      setTime(toTimeInputValue(activity.startTime));
      setDuration(activity.duration != null ? String(activity.duration) : '');
      setLat(activity.lat != null ? String(activity.lat) : '');
      setLng(activity.lng != null ? String(activity.lng) : '');
      setNotes(activity.notes ?? '');
      return;
    }

    setTitle('');
    setType('activity');
    setDate('');
    setTime('');
    setDuration('');
    setLat('');
    setLng('');
    setNotes('');
  }, [open, activity]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    const startTime = date && time ? new Date(`${date}T${time}`).toISOString() : undefined;

    setSubmitting(true);
    try {
      await onSubmit({
        dayId,
        type,
        title: trimmedTitle,
        startTime,
        duration: duration ? Number(duration) : undefined,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit activity' : 'Add activity'}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-label-sm text-on-surface-variant">Title</label>
          <Input
            name="title"
            required
            placeholder="Activity name"
            className="mt-1"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Type</label>
          <select
            name="type"
            className="mt-1 w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-body-md"
            value={type}
            onChange={(event) => setType(event.target.value as ActivityType)}
          >
            <option value="activity">Activity</option>
            <option value="flight">Flight</option>
            <option value="transport">Transport</option>
            <option value="lodging">Lodging</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm text-on-surface-variant">Date</label>
            <Input
              name="date"
              type="date"
              className="mt-1"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Start time</label>
            <Input
              name="time"
              type="time"
              className="mt-1"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Duration (minutes)</label>
          <Input
            name="duration"
            type="number"
            min={1}
            className="mt-1"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm text-on-surface-variant">Latitude (optional)</label>
            <Input
              name="lat"
              type="number"
              step="any"
              className="mt-1"
              value={lat}
              onChange={(event) => setLat(event.target.value)}
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Longitude (optional)</label>
            <Input
              name="lng"
              type="number"
              step="any"
              className="mt-1"
              value={lng}
              onChange={(event) => setLng(event.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-body-md"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {isEditing ? 'Save changes' : 'Add activity'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export type { ActivityFormValues, ActivityRecord };
