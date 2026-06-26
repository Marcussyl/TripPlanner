'use client';

import { useTripChannel } from '@/hooks/use-trip-channel';

type OnlineNowPillProps = {
  tripId: string;
};

export function OnlineNowPill({ tripId }: OnlineNowPillProps) {
  const { onlineCount, isConnected } = useTripChannel(tripId);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2">
      <span
        className={`h-2 w-2 rounded-full ${isConnected ? 'bg-primary' : 'bg-outline-variant'}`}
      />
      <span className="text-label-md text-on-surface">
        {onlineCount} online now
      </span>
    </div>
  );
}
