'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getTripCoverImage } from '@/lib/trip-cover';

type TripMember = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    avatarUrl: string | null;
  };
};

type TripCardProps = {
  trip: {
    id: string;
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    coverImage?: string | null;
    members: TripMember[];
    _count: { members: number };
  };
  index: number;
};

function getInitials(name: string | null | undefined) {
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

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate).toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  const end = new Date(endDate).toLocaleDateString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  return `${start} – ${end}`;
}

export function TripCard({ trip, index }: TripCardProps) {
  const coverSrc = getTripCoverImage(trip.destination, trip.coverImage, index);
  const memberCount = trip._count.members;
  const visibleMembers = trip.members.slice(0, 4);

  return (
    <article className="group overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-level-2 transition-shadow hover:shadow-level-3">
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={coverSrc}
          alt={trip.destination}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/30 to-transparent" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-label-sm text-white backdrop-blur-sm">
          <span className="material-symbols-outlined text-[14px]">group</span>
          {memberCount} member{memberCount === 1 ? '' : 's'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-headline-md text-on-background">{trip.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">location_on</span>
          {trip.destination}
        </p>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-outline-variant/50 pt-4">
          <div className="flex -space-x-2">
            {visibleMembers.map((member) => {
              const avatarSrc = member.user.avatarUrl ?? member.user.image ?? undefined;
              return (
                <Avatar
                  key={member.user.id}
                  className="h-8 w-8 border-2 border-surface-container-lowest"
                >
                  <AvatarImage src={avatarSrc} alt={member.user.name ?? 'Member'} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(member.user.name)}
                  </AvatarFallback>
                </Avatar>
              );
            })}
            {memberCount > visibleMembers.length && (
              <span className="ml-3 self-center text-label-sm text-on-surface-variant">
                +{memberCount - visibleMembers.length}
              </span>
            )}
          </div>

          <Link
            href={`/trips/${trip.id}/dashboard`}
            className="inline-flex items-center gap-1 text-label-md text-primary transition-colors hover:text-surface-tint"
          >
            Open workspace
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
