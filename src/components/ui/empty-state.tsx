import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant bg-surface-container-low px-8 py-16 text-center">
      <span className="material-symbols-outlined mb-4 text-5xl text-primary">explore</span>
      <h2 className="text-headline-md text-on-background">{title}</h2>
      <p className="mt-2 max-w-md text-body-md text-on-surface-variant">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
