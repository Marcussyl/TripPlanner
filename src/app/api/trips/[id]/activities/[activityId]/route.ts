import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { updateActivitySchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string; activityId: string }>;
};

async function getActivityForTrip(tripId: string, activityId: string) {
  return prisma.activity.findFirst({
    where: { id: activityId, day: { tripId } },
    include: {
      day: {
        select: { id: true, dayNumber: true, date: true, label: true },
      },
    },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, activityId } = await context.params;
    await requireTripMember(id, 'editor');

    const body = updateActivitySchema.parse(await request.json());
    const existing = await getActivityForTrip(id, activityId);
    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    const activity = await prisma.activity.update({
      where: { id: activityId },
      data: {
        ...(body.type != null ? { type: body.type } : {}),
        ...(body.title != null ? { title: body.title } : {}),
        ...(body.startTime !== undefined
          ? { startTime: body.startTime ? new Date(body.startTime) : null }
          : {}),
        ...(body.duration !== undefined ? { duration: body.duration } : {}),
        ...(body.lat !== undefined ? { lat: body.lat } : {}),
        ...(body.lng !== undefined ? { lng: body.lng } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
      },
      include: {
        day: {
          select: { id: true, dayNumber: true, date: true, label: true },
        },
      },
    });

    await emitTripEvent(id, 'activity.updated', { activity });

    return NextResponse.json({ activity });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, activityId } = await context.params;
    await requireTripMember(id, 'editor');

    const existing = await getActivityForTrip(id, activityId);
    if (!existing) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    await prisma.activity.delete({ where: { id: activityId } });
    await emitTripEvent(id, 'activity.deleted', { activityId });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
