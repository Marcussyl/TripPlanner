'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTripChannel } from '@/hooks/use-trip-channel';

type OnlineNowPillProps = {
  tripId: string;
};

function getInitials(name: string | undefined) {
  if (!name) {
    return '?';
  }
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function OnlineNowPill({ tripId }: OnlineNowPillProps) {
  const { onlineCount, members, isConnected } = useTripChannel(tripId);
  const visible = members.slice(0, 3);
  const overflow = Math.max(0, members.length - 3);

  return (
    <div className="relative inline-flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 shadow-sm">
      <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
        Online now
      </span>

      <div className="flex -space-x-3">
        {visible.map((member, index) => (
          <div key={member.id} className="relative" style={{ zIndex: 30 - index }}>
            <Avatar className="h-10 w-10 border-2 border-surface">
              <AvatarImage src={member.info.avatarUrl} alt={member.info.name ?? 'Member'} />
              <AvatarFallback className="text-label-sm">
                {getInitials(member.info.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 z-40 h-3 w-3 rounded-full border-2 border-surface bg-[#4ade80]" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-primary-container text-label-md text-on-primary-container shadow-level-2">
            +{overflow}
          </div>
        )}
      </div>

      {isConnected && onlineCount > 0 && (
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}
