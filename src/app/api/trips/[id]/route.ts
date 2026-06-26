import { NextResponse } from 'next/server';
import { requireTripMember, TripAccessError } from '@/lib/auth/trip-access';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true, avatarUrl: true },
            },
          },
        },
        itineraryDays: {
          orderBy: { dayNumber: 'asc' },
          include: {
            activities: {
              orderBy: { startTime: 'asc' },
            },
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    if (error instanceof TripAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
