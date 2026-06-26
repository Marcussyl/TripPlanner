'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTripChannel } from '@/hooks/use-trip-channel';

type Member = {
  id: string;
  name: string | null;
  image: string | null;
  avatarUrl: string | null;
};

type PresenceAvatarStackProps = {
  tripId: string;
  members: Member[];
  max?: number;
};

function getInitials(name: string | null | undefined) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function PresenceAvatarStack({ tripId, members, max = 4 }: PresenceAvatarStackProps) {
  const { onlineUserIds } = useTripChannel(tripId);
  const visible = members.slice(0, max);

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member) => {
        const isOnline = onlineUserIds.has(member.id);
        const avatarSrc = member.avatarUrl ?? member.image ?? undefined;

        return (
          <div key={member.id} className="relative">
            <Avatar className="h-9 w-9 border-2 border-white ring-2 ring-surface-container-high">
              <AvatarImage src={avatarSrc} alt={member.name ?? 'Member'} />
              <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-primary" />
            )}
          </div>
        );
      })}
      {members.length > max && (
        <span className="ml-3 text-label-sm text-on-surface-variant">+{members.length - max}</span>
      )}
    </div>
  );
}
