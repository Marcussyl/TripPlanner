import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createActivitySchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const limit = Number(searchParams.get('limit') ?? '10');

    const activities = await prisma.activity.findMany({
      where: {
        day: { tripId: id },
        ...(upcoming ? { startTime: { gte: new Date() } } : {}),
      },
      orderBy: { startTime: 'asc' },
      take: upcoming ? Math.min(limit, 50) : undefined,
      include: {
        day: {
          select: { id: true, dayNumber: true, date: true, label: true },
        },
      },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'editor');

    const body = createActivitySchema.parse(await request.json());

    const day = await prisma.itineraryDay.findFirst({
      where: { id: body.dayId, tripId: id },
    });
    if (!day) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        dayId: body.dayId,
        type: body.type,
        title: body.title,
        startTime: body.startTime ? new Date(body.startTime) : null,
        duration: body.duration ?? null,
        lat: body.lat ?? null,
        lng: body.lng ?? null,
        notes: body.notes ?? null,
      },
      include: {
        day: {
          select: { id: true, dayNumber: true, date: true, label: true },
        },
      },
    });

    await emitTripEvent(id, 'activity.created', { activity });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
