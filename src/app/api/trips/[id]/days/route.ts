import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createDaySchema } from '@/lib/validations/trip';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'viewer');

    const days = await prisma.itineraryDay.findMany({
      where: { tripId: id },
      orderBy: { dayNumber: 'asc' },
      include: {
        activities: {
          orderBy: { startTime: 'asc' },
        },
      },
    });

    return NextResponse.json({ days });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await requireTripMember(id, 'editor');

    const body = createDaySchema.parse(await request.json());

    const day = await prisma.itineraryDay.create({
      data: {
        tripId: id,
        dayNumber: body.dayNumber,
        date: new Date(body.date),
        label: body.label,
      },
      include: { activities: true },
    });

    return NextResponse.json({ day }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
