import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { getTripMember } from '@/lib/auth/trip-access';
import { canWriteTripContent } from '@/lib/auth/trip-roles';
import { GroupHubClient } from '@/components/group-hub/group-hub-client';
import { LoadingState } from '@/components/ui/loading-state';

type GroupHubPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function GroupHubPage({ params }: GroupHubPageProps) {
  const { tripId } = await params;
  const session = await auth();
  const member = session?.user?.id ? await getTripMember(tripId, session.user.id) : null;

  if (!session?.user?.id) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingState label="Loading group hub…" />}>
      <GroupHubClient
        tripId={tripId}
        userId={session.user.id}
        canEdit={member ? canWriteTripContent(member.role) : false}
      />
    </Suspense>
  );
}
