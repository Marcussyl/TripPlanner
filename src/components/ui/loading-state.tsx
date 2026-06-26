import { cn } from '@/lib/utils';

type LoadingStateProps = {
  label?: string;
  variant?: 'page' | 'inline';
};

export function LoadingState({ label = 'Loading...', variant = 'page' }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-on-surface-variant',
        variant === 'page' && 'flex-1 min-h-0 map-grid-bg',
        variant === 'inline' && 'min-h-[320px] py-16',
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary loading-spinner"
            aria-hidden="true"
          />
          <span
            className="material-symbols-outlined text-[40px] text-primary"
            aria-hidden="true"
          >
            explore
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-body-lg text-on-surface-variant">{label}</p>
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="loading-dot" />
            <span className="loading-dot [animation-delay:160ms]" />
            <span className="loading-dot [animation-delay:320ms]" />
          </div>
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
