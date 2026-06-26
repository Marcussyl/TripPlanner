'use client';

import { Button } from '@/components/ui/button';

type CollaborateBannerProps = {
  uniqueMemberCount: number;
  onInviteClick: () => void;
};

export function CollaborateBanner({ uniqueMemberCount, onInviteClick }: CollaborateBannerProps) {
  const planningCount = Math.max(uniqueMemberCount, 1);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-inverse-surface px-8 py-10 text-inverse-on-surface shadow-level-3 lg:px-12 lg:py-12">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-primary-container/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-headline-lg text-inverse-on-surface">Collaborate in real-time</h2>
          <p className="mt-3 text-body-lg text-inverse-on-surface/75">
            Plan itineraries, vote on ideas, and track expenses together. Everyone stays in sync
            whether you are at home or on the road.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span className="text-label-md text-inverse-on-surface/90">
              {planningCount} {planningCount === 1 ? 'person' : 'people'} planning now
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={onInviteClick} className="min-w-[140px]">
            Invite crew
          </Button>
          <Button
            variant="secondary"
            className="min-w-[140px] border-inverse-on-surface/30 bg-transparent text-inverse-on-surface hover:bg-white/10"
          >
            View guides
          </Button>
        </div>
      </div>
    </section>
  );
}
