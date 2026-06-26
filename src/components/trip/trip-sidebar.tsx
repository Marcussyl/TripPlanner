'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PresenceAvatarStack } from '@/components/trip/presence-avatar-stack';
import { SignOutButton } from '@/components/auth/sign-out-button';

const NAV_ITEMS = [
  { href: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: 'itinerary', label: 'Itinerary', icon: 'map' },
  { href: 'budget', label: 'Budget', icon: 'payments' },
  { href: 'group-hub', label: 'Group Hub', icon: 'forum' },
] as const;

type TripSidebarProps = {
  tripId: string;
  tripName: string;
  memberCount: number;
  members: Array<{
    id: string;
    name: string | null;
    image: string | null;
    avatarUrl: string | null;
  }>;
};

export function TripSidebar({ tripId, tripName, memberCount, members }: TripSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-outline-variant/50 bg-surface-container-low">
      <div className="border-b border-outline-variant/50 px-5 py-6">
        <p className="text-label-sm uppercase tracking-widest text-on-surface-variant">TripSync</p>
        <h1 className="mt-2 text-headline-md text-on-background">{tripName}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {memberCount} explorer{memberCount === 1 ? '' : 's'}
        </p>
        <div className="mt-4">
          <PresenceAvatarStack members={members} tripId={tripId} />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const href = `/trips/${tripId}/${item.href}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-label-md transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface',
              )}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-outline-variant/50 p-4 space-y-2">
        <SignOutButton />
        <Link
          href="/trips"
          className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          All trips
        </Link>
      </div>
    </aside>
  );
}
