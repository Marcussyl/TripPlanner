'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { InviteExplorer } from '@/components/trip/invite-explorer';
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
  isOwner: boolean;
};

export function TripSidebar({ tripId, tripName, memberCount, isOwner }: TripSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low shadow-sm">
      <div className="px-4 pt-10 pb-6">
        <span className="text-headline-md font-black text-primary">TripSync</span>
      </div>

      <div className="mb-6 flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-variant">
          <span className="material-symbols-outlined text-primary">flight_takeoff</span>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-label-md text-on-surface">{tripName}</h1>
          <p className="text-label-sm text-on-surface-variant">
            {memberCount} explorer{memberCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const href = `/trips/${tripId}/${item.href}`;
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-label-md transition-all duration-200',
                isActive
                  ? 'bg-primary-container font-bold text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant',
              )}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                data-weight={isActive ? 'fill' : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant px-4 pt-6 pb-4">
        <InviteExplorer tripId={tripId} isOwner={isOwner} variant="sidebar" />
        <SignOutButton />
        <Link
          href="/trips"
          className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-variant"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          All trips
        </Link>
      </div>
    </aside>
  );
}
