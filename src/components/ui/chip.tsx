import { cn } from '@/lib/utils';

type ChipProps = {
  children: React.ReactNode;
  className?: string;
};

export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-surface-container px-3 py-1 text-label-sm font-semibold text-on-surface',
        className,
      )}
    >
      {children}
    </span>
  );
}
