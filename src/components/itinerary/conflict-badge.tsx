'use client';

import { cn } from '@/lib/utils';

type ConflictBadgeProps = {
  className?: string;
};

export function ConflictBadge({ className }: ConflictBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-error-container px-2 py-0.5 text-label-sm text-on-error-container',
        className,
      )}
    >
      <span className="material-symbols-outlined text-[14px]">warning</span>
      Time conflict
    </span>
  );
}
