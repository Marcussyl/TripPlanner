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
    <section className="rounded-3xl border border-outline-variant/60 bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-headline-md text-on-background">Quick ideas</h3>
        <Link href={`/trips/${tripId}/group-hub`} className="text-label-md text-primary">
          Open canvas
        </Link>
      </div>
      {pins.length === 0 ? (
        <p className="mt-4 text-body-md text-on-surface-variant">No ideas pinned yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {pins.slice(0, 3).map((pin) =>
            pin.type === 'link' ? (
              <LinkPinCard key={pin.id} content={pin.content} authorName={pin.createdBy.name} />
            ) : (
              <NotePinCard key={pin.id} content={pin.content} authorName={pin.createdBy.name} />
            ),
          )}
        </div>
      )}
    </section>
  );
}
