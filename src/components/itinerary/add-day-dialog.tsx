'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type AddDayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextDayNumber: number;
  defaultDate?: string;
  onSubmit: (data: { dayNumber: number; date: string; label?: string }) => Promise<void>;
};

function toDateInputValue(iso: string | undefined) {
  if (!iso) {
    return '';
  }
  return iso.slice(0, 10);
}

function shiftDate(iso: string, dayOffset: number) {
  const date = new Date(iso);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().slice(0, 10);
}

export function AddDayDialog({
  open,
  onOpenChange,
  nextDayNumber,
  defaultDate,
  onSubmit,
}: AddDayDialogProps) {
  const [dayNumber, setDayNumber] = useState(nextDayNumber);
  const [date, setDate] = useState(defaultDate ?? '');
  const [label, setLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setDayNumber(nextDayNumber);
    setDate(defaultDate ?? '');
    setLabel('');
  }, [open, nextDayNumber, defaultDate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        dayNumber,
        date: new Date(`${date}T12:00:00`).toISOString(),
        label: label.trim() || undefined,
      });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add day">
      <p className="mb-4 text-body-md text-on-surface-variant">
        Add a day to your itinerary timeline.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-label-sm text-on-surface-variant" htmlFor="dayNumber">
            Day number
          </label>
          <Input
            id="dayNumber"
            name="dayNumber"
            type="number"
            min={1}
            required
            value={dayNumber}
            onChange={(e) => setDayNumber(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant" htmlFor="date">
            Date
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant" htmlFor="label">
            Label (optional)
          </label>
          <Input
            id="label"
            name="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Arrival day"
            className="mt-1"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add day'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export function getDefaultDayDate(tripStartDate: string | undefined, dayNumber: number) {
  if (!tripStartDate) {
    return '';
  }
  return shiftDate(toDateInputValue(tripStartDate), dayNumber - 1);
}
