'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type AddActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: string;
  onSubmit: (data: {
    dayId: string;
    type: 'flight' | 'transport' | 'lodging' | 'activity';
    title: string;
    startTime?: string;
    duration?: number;
    lat?: number;
    lng?: number;
    notes?: string;
  }) => Promise<void>;
};

export function AddActivityDialog({ open, onOpenChange, dayId, onSubmit }: AddActivityDialogProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title') ?? '').trim();
    if (!title) {
      return;
    }

    const date = String(form.get('date') ?? '');
    const time = String(form.get('time') ?? '');
    const startTime = date && time ? new Date(`${date}T${time}`).toISOString() : undefined;
    const duration = form.get('duration') ? Number(form.get('duration')) : undefined;
    const lat = form.get('lat') ? Number(form.get('lat')) : undefined;
    const lng = form.get('lng') ? Number(form.get('lng')) : undefined;

    await onSubmit({
      dayId,
      type: String(form.get('type') ?? 'activity') as
        | 'flight'
        | 'transport'
        | 'lodging'
        | 'activity',
      title,
      startTime,
      duration,
      lat,
      lng,
      notes: String(form.get('notes') ?? '') || undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add activity">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-label-sm text-on-surface-variant">Title</label>
          <Input name="title" required placeholder="Activity name" className="mt-1" />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Type</label>
          <select
            name="type"
            className="mt-1 w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-body-md"
            defaultValue="activity"
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
            <Input name="date" type="date" className="mt-1" />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Start time</label>
            <Input name="time" type="time" className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Duration (minutes)</label>
          <Input name="duration" type="number" min={1} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-label-sm text-on-surface-variant">Latitude (optional)</label>
            <Input name="lat" type="number" step="any" className="mt-1" />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant">Longitude (optional)</label>
            <Input name="lng" type="number" step="any" className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-lg border border-outline-variant bg-background px-3 py-2 text-body-md"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">Add activity</Button>
        </div>
      </form>
    </Dialog>
  );
}
