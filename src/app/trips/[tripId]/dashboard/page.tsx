import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

type DashboardPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { tripId } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      name: true,
      destination: true,
      startDate: true,
      endDate: true,
      coverImage: true,
    },
  });

  if (!trip) {
    notFound();
  }

  return (
    <DashboardClient
      tripId={tripId}
      initialTrip={{
        ...trip,
        startDate: trip.startDate.toISOString(),
        endDate: trip.endDate.toISOString(),
      }}
    />
  );
}
