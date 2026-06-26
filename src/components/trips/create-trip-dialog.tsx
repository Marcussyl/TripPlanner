'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type CreateTripDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onError: (message: string) => void;
};

export function CreateTripDialog({ open, onOpenChange, onError }: CreateTripDialogProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budgetLimit: '',
  });

  const resetForm = () => {
    setForm({
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      budgetLimit: '',
    });
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    onError('');

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          destination: form.destination,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
          budgetLimit: form.budgetLimit ? Number(form.budgetLimit) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create trip');
      }

      const data = await res.json();
      onOpenChange(false);
      resetForm();
      router.push(`/trips/${data.trip.id}/dashboard`);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Create a trip">
      <p className="mb-6 text-body-md text-on-surface-variant">
        Set the basics for your shared workspace.
      </p>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
        <div className="space-y-2">
          <label className="text-label-md" htmlFor="name">
            Trip name
          </label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Summer in Tokyo"
          />
        </div>
        <div className="space-y-2">
          <label className="text-label-md" htmlFor="destination">
            Destination
          </label>
          <Input
            id="destination"
            required
            value={form.destination}
            onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
            placeholder="Tokyo, Japan"
          />
        </div>
        <div className="space-y-2">
          <label className="text-label-md" htmlFor="startDate">
            Start date
          </label>
          <Input
            id="startDate"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-label-md" htmlFor="endDate">
            End date
          </label>
          <Input
            id="endDate"
            type="date"
            required
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-label-md" htmlFor="budgetLimit">
            Budget limit (optional)
          </label>
          <Input
            id="budgetLimit"
            type="number"
            min="0"
            step="0.01"
            value={form.budgetLimit}
            onChange={(e) => setForm((f) => ({ ...f, budgetLimit: e.target.value }))}
            placeholder="5000"
          />
        </div>
        <div className="flex gap-3 md:col-span-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create trip'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
