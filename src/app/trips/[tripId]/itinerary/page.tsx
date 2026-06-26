import { auth } from '@/lib/auth';
import { getTripMember } from '@/lib/auth/trip-access';
import { canWriteTripContent } from '@/lib/auth/trip-roles';
import { ItineraryPlanner } from '@/components/itinerary/itinerary-planner';

type ItineraryPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const { tripId } = await params;
  const session = await auth();
  const member = session?.user?.id ? await getTripMember(tripId, session.user.id) : null;

  return (
    <ItineraryPlanner tripId={tripId} canEdit={member ? canWriteTripContent(member.role) : false} />
  );
}
