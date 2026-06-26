import { auth } from '@/lib/auth';
import { getTripMember } from '@/lib/auth/trip-access';
import { InviteExplorer } from '@/components/trip/invite-explorer';
import { TopAppBar } from '@/components/trip/top-app-bar';

type DashboardPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tripId } = await params;
  const session = await auth();
  const member = session?.user?.id ? await getTripMember(tripId, session.user.id) : null;
  const isOwner = member?.role === 'owner';

  return (
    <div className="flex flex-1 flex-col">
      <TopAppBar
        title="Dashboard"
        subtitle="Trip overview, upcoming activities, and budget snapshot — Phase 1."
      />
      <div className="flex flex-1 flex-col gap-6 p-8">
        <InviteExplorer tripId={tripId} isOwner={!!isOwner} />
        <div className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-outline-variant bg-surface-container-low px-8 py-12 text-center">
          <div>
            <span className="material-symbols-outlined mb-4 text-5xl text-primary">construction</span>
            <p className="text-headline-md text-on-background">Module coming in Phase 1</p>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Dashboard widgets will appear here after the itinerary and budget APIs ship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
