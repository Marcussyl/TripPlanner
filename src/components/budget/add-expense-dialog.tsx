'use client';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type AddExpenseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    amount: number;
    category: string;
  }) => Promise<void>;
};

export function AddExpenseDialog({ open, onOpenChange, onSubmit }: AddExpenseDialogProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await onSubmit({
      title: String(form.get('title')),
      amount: Number(form.get('amount')),
      category: String(form.get('category')),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Add expense">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-label-sm text-on-surface-variant">Title</label>
          <Input name="title" required className="mt-1" />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Amount</label>
          <Input name="amount" type="number" min={0.01} step="0.01" required className="mt-1" />
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant">Category</label>
          <select
            name="category"
            className="mt-1 w-full rounded-lg border border-outline-variant bg-background px-3 py-2"
            defaultValue="food"
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="lodging">Lodging</option>
            <option value="activities">Activities</option>
            <option value="shopping">Shopping</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">Add expense</Button>
        </div>
      </form>
    </Dialog>
  );
}
