import { auth } from '@/lib/auth';
import { getTripMember } from '@/lib/auth/trip-access';
import { canWriteTripContent } from '@/lib/auth/trip-roles';
import { BudgetTracker } from '@/components/budget/budget-tracker';

type BudgetPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function BudgetPage({ params }: BudgetPageProps) {
  const { tripId } = await params;
  const session = await auth();
  const member = session?.user?.id ? await getTripMember(tripId, session.user.id) : null;

  return <BudgetTracker tripId={tripId} canEdit={member ? canWriteTripContent(member.role) : false} />;
}
