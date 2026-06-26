import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getTripMember } from '@/lib/auth/trip-access';
import { prisma } from '@/lib/prisma';
import { TripSidebar } from '@/components/trip/trip-sidebar';

type TripLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
};

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const member = await getTripMember(tripId, session.user.id);
  if (!member) {
    notFound();
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, image: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!trip) {
    notFound();
  }

  const isOwner = member.role === 'owner';

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex">
        <TripSidebar
          tripId={trip.id}
          tripName={trip.name}
          memberCount={trip.members.length}
          isOwner={isOwner}
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
