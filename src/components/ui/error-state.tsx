import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-error-container bg-error-container/30 px-6 py-8 text-center">
      <span className="material-symbols-outlined mb-3 text-4xl text-error">error</span>
      <h2 className="text-headline-md text-on-error-container">{title}</h2>
      <p className="mt-2 text-body-md text-on-error-container">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
