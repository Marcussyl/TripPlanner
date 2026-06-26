import { NextResponse } from 'next/server';
import { requireTripMember } from '@/lib/auth/trip-access';
import { handleApiError } from '@/lib/api/handle-api-error';
import { prisma } from '@/lib/prisma';
import { createPinSchema } from '@/lib/validations/trip';
import { emitTripEvent } from '@/lib/realtime/trip-events';

type RouteContext = {
  params: Promise<{ id: string; pinId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id, pinId } = await context.params;
    await requireTripMember(id, 'editor');

    const body = createPinSchema.partial().parse(await request.json());

    if (body.type === 'image') {
      return NextResponse.json({ error: 'Image pins are not supported yet' }, { status: 501 });
    }

    const existing = await prisma.canvasPin.findFirst({
      where: { id: pinId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    const pin = await prisma.canvasPin.update({
      where: { id: pinId },
      data: {
        ...(body.type != null ? { type: body.type } : {}),
        ...(body.content != null ? { content: body.content } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
      },
      include: {
        createdBy: { select: { id: true, name: true, avatarUrl: true, image: true } },
      },
    });

    await emitTripEvent(id, 'pin.updated', { pin });

    return NextResponse.json({ pin });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, pinId } = await context.params;
    await requireTripMember(id, 'editor');

    const existing = await prisma.canvasPin.findFirst({
      where: { id: pinId, tripId: id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    await prisma.canvasPin.delete({ where: { id: pinId } });
    await emitTripEvent(id, 'pin.deleted', { pinId });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
