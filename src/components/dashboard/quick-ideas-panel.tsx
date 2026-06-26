'use client';

import Link from 'next/link';
import { NotePinCard } from '@/components/group-hub/note-pin-card';
import { LinkPinCard } from '@/components/group-hub/link-pin-card';

type QuickIdeasPanelProps = {
  tripId: string;
  pins: Array<{
    id: string;
    type: string;
    content: string;
    createdBy: { name: string | null };
  }>;
};

export function QuickIdeasPanel({ tripId, pins }: QuickIdeasPanelProps) {
  return (
    <section className="relative flex-grow overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-level-2">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">lightbulb</span>
          <h3 className="text-headline-md text-on-background">Quick ideas</h3>
        </div>
        <Link
          href={`/trips/${tripId}/group-hub`}
          className="rounded-full p-1 text-secondary transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>

      {pins.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">No ideas pinned yet.</p>
      ) : (
        <div className="space-y-3">
          {pins.slice(0, 3).map((pin) =>
            pin.type === 'link' ? (
              <LinkPinCard key={pin.id} content={pin.content} authorName={pin.createdBy.name} />
            ) : (
              <NotePinCard key={pin.id} content={pin.content} authorName={pin.createdBy.name} />
            ),
          )}
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #1c1b1b 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </section>
  );
}
