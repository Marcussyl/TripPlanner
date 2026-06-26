'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NAV_LINKS = [
  { href: '/trips', label: 'Explore' },
  { href: '#', label: 'Community' },
  { href: '#', label: 'Support' },
] as const;

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

export function TripsTopNav() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
        <Link href="/trips" className="text-headline-md font-black text-primary">
          TripSync
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </button>
          <Avatar className="h-9 w-9 border-2 border-outline-variant/50">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'Profile'} />
            <AvatarFallback className="text-label-sm">{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
