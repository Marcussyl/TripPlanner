import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { updateDaySchema } from '@/lib/validations/trip';

type RouteContext = {
  params: Promise<{ id: string; dayId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, dayId } = await context.params;
    await requireTripMember(id, 'editor');

    const body = updateDaySchema.parse(await request.json());

    const existing = await prisma.itineraryDay.findFirst({
      where: { id: dayId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const day = await prisma.itineraryDay.update({
      where: { id: dayId },
      data: {
        ...(body.dayNumber != null ? { dayNumber: body.dayNumber } : {}),
        ...(body.date != null ? { date: new Date(body.date) } : {}),
        ...(body.label !== undefined ? { label: body.label } : {}),
      },
      include: { activities: true },
    });

    return NextResponse.json({ day });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, dayId } = await context.params;
    await requireTripMember(id, 'editor');

    const existing = await prisma.itineraryDay.findFirst({
      where: { id: dayId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    await prisma.itineraryDay.delete({ where: { id: dayId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
